import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import FileUpload from "./FileUpload";

export default function Component() {
  const [isLoading, setIsLoading] = useState(true);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [outputFileName, setOutputFileName] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionRatio, setCompressionRatio] = useState<number | null>(null);

  const load = async () => {
    setIsLoading(true);
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
    setIsLoading(false);
  };

  const transcode = async (file: File) => {
    const ffmpeg = ffmpegRef.current;
    const inputFileName = file.name;
    const [originalFileName, fileExtension = "mp4"] =
      inputFileName.split(/\.(?=[^.]+$)/);
    const outputFileName = `compressed_${originalFileName}.${fileExtension}`;
    setOutputFileName(outputFileName);

    await ffmpeg.writeFile(inputFileName, await fetchFile(file));

    // 获取输入视频的信息
    let videoInfo = "";
    ffmpeg.on("log", ({ message }) => {
      videoInfo += message + "\n";
    });

    await ffmpeg.exec(["-i", inputFileName]);

    // 解析视频信息以获取分辨率和比特率
    const resolutionMatch = videoInfo.match(/(\d{3,4})x(\d{3,4})/);
    const bitrateMatch = videoInfo.match(/bitrate: (\d+) kb\/s/);

    const inputWidth = resolutionMatch ? parseInt(resolutionMatch[1]) : 0;
    const inputBitrate = bitrateMatch ? parseInt(bitrateMatch[1]) : 0;

    console.log("====", {
      inputWidth,
      inputBitrate,
      inputFileName,
      outputFileName,
      resolutionMatch,
      bitrateMatch,
    });

    // 根据输入视频的特征决定压缩参数
    let compressionParams = [];
    if (inputWidth > 1280 || inputBitrate > 2000) {
      compressionParams = [
        "-i",
        inputFileName,
        "-c:v",
        "libx264",
        "-crf",
        "28",
        "-preset",
        "veryfast",
        "-c:a",
        "aac",
        "-b:a",
        "96k",
        "-movflags",
        "+faststart",
        "-f",
        fileExtension,
      ];
    } else {
      // 对于较小或质量较低的视频，也稍微增加压缩力度
      compressionParams = [
        "-i",
        inputFileName,
        "-c:v",
        "libx264",
        "-crf",
        "23", // 增加CRF值
        "-preset",
        "veryfast", // 使用更快的预设
        "-c:a",
        "aac",
        "-b:a",
        "96k", // 降低音频比特率
        "-f",
        fileExtension,
      ];
    }
    ffmpeg.on("progress", ({ progress }) => {
      setProgress(Math.round(progress * 100));
    });

    await ffmpeg.exec([...compressionParams, outputFileName]);
    const data = await ffmpeg.readFile(outputFileName);

    const originalSize = file.size;
    const compressedSize = data.length;
    const ratio = (1 - compressedSize / originalSize) * 100;
    setCompressionRatio(parseFloat(ratio.toFixed(2)));

    if (videoRef.current) {
      const blob = new Blob([data], { type: `video/${fileExtension}` });
      if (blob.size > 0) {
        const url = URL.createObjectURL(blob);
        videoRef.current.src = url;
      } else {
        console.error("compressed video file size is zero");
      }
    }
  };

  const handleFileChange = async (file: File) => {
    setOutputFileName("");
    setCompressionRatio(null);
    setProgress(0);
    if (file) {
      setIsCompressing(true);
      transcode(file)
        .catch((err) => {
          console.error("err", err);
        })
        .finally(() => {
          setIsCompressing(false);
        });
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="justify-center items-center flex flex-col overflow-y-auto gap-4 max-w-[1200px] w-full m-auto h-auto px-3 py-4">
        {isCompressing ? (
          <>
            <Progress value={progress} />
            <p className="leading-tight text-center">
              Compressing: {progress}% <br />
              <span className="text-red-400">{`(please don't close this page)`}</span>
            </p>
          </>
        ) : (
          <div className="md:w-[600px] w-full">
            <FileUpload onChange={handleFileChange} />
          </div>
        )}
        {compressionRatio !== null && (
          <p className="leading-tight text-center">
            compress ratio: {compressionRatio}%
          </p>
        )}
        <video
          ref={videoRef}
          controls
          loop
          autoPlay
          playsInline
          muted
          onError={() => {
            const a = document.createElement("a");
            a.href = videoRef.current?.src || "";
            a.download = outputFileName;
            a.click();
          }}
          className="max-w-[500px] max-h-[500px] w-full h-auto"
        ></video>
      </div>
    </div>
  );
}
