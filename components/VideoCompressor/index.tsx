import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import FileUpload from "./FileUpload";

export default function Component() {
  const [isLoading, setIsLoading] = useState(true);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [outputFileName, setOutputFileName] = useState("");

  const load = async () => {
    setIsLoading(true);
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
      if (messageRef.current) messageRef.current.innerHTML = message;
    });
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

    // 根据输入视频的特征决定压缩参数
    let compressionParams = [];
    console.log("====", inputWidth > 1280 || inputBitrate > 2000);
    if (inputWidth > 1280 || inputBitrate > 2000) {
      compressionParams = [
        "-i",
        inputFileName,
        "-c:v",
        "libx264",
        "-crf",
        "23",
        "-preset",
        "medium",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-movflags",
        "+faststart",
        "-f",
        "mp4",
      ];
    } else {
      // 如果视频已经很小或质量较低，仅进行轻微压缩
      compressionParams = [
        "-c:v",
        "libx264",
        "-crf",
        "18",
        "-preset",
        "fast",
        "-c:a",
        "copy",
      ];
    }

    // 执行压缩
    await ffmpeg.exec([...compressionParams, outputFileName]);

    // 读取压缩后的文件
    const data = await ffmpeg.readFile(outputFileName);

    // 更新视频源
    if (videoRef.current) {
      const blob = new Blob([data], { type: `video/${fileExtension}` });
      if (blob.size > 0) {
        const url = URL.createObjectURL(blob);
        videoRef.current.src = url;
      } else {
        console.error("压缩后的视频文件大小为零");
      }
    }

    // 重置进度
    setProgress(0);
  };

  const handleFileChange = async (file: File) => {
    setOutputFileName("");
    if (file) {
      transcode(file).catch((err) => {
        console.error("err", err);
      });
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      {/* <input type="file" accept="video/*" onChange={handleFileChange} /> */}
      <FileUpload onChange={handleFileChange} />
      <p ref={messageRef}></p>
      <br />
      {progress > 0 && <p>处理进度: {progress}%</p>}
      <video
        ref={videoRef}
        controls
        onError={() => {
          // 不支持播放直接触发下载逻辑
          const a = document.createElement("a");
          a.href = videoRef.current?.src || "";
          a.download = outputFileName;
          a.click();
        }}
        className="max-w-[500px] max-h-[500px]"
      ></video>
      <Button>压缩</Button>
    </div>
  );
}
