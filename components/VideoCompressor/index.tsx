import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import FileUpload from "./FileUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { level1Params, level2Params, level3Params } from "./content";
import isMobile from "@/lib/ismobile";

enum Level {
  Level1 = "1",
  Level2 = "2",
  Level3 = "3",
}

interface LoadURLs {
  coreURL: string;
  wasmURL: string;
  workerURL?: string;
}

export default function Component() {
  const [isLoading, setIsLoading] = useState(true);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [outputFileName, setOutputFileName] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionRatio, setCompressionRatio] = useState<number | null>(null);
  const [level, setLevel] = useState<string>(Level.Level1);

  const load = async () => {
    const ffmpeg = ffmpegRef.current;
    let loadURLs: LoadURLs = { coreURL: "", wasmURL: "" };

    if (!isMobile()) {
      const baseURL = "/core-mt";
      const [coreURL, wasmURL] = await Promise.all([
        toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      ]);
      const workerURL = await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        "text/javascript"
      );
      loadURLs = { coreURL, wasmURL, workerURL };
    } else {
      const baseURL = "/core";
      const [coreURL, wasmURL] = await Promise.all([
        toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      ]);
      loadURLs = { coreURL, wasmURL };
    }

    await ffmpeg.load(loadURLs);
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

    const compressionParams =
      level === Level.Level1
        ? level1Params
        : level === Level.Level2
        ? level2Params
        : level3Params;

    compressionParams[1] = file.name;
    compressionParams[compressionParams.length - 1] = outputFileName;

    console.log("compressionParams", compressionParams);

    const start = Date.now();
    console.log("start", start);

    ffmpeg.on("progress", ({ progress }) => {
      setProgress(Math.round(progress * 100));
    });
    await ffmpeg.exec(compressionParams);
    const end = Date.now();
    console.log(`Compression took ${(end - start) / 1000} seconds`);
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
        <div>
          <Select
            defaultValue={Level.Level1}
            onValueChange={(value) => setLevel(value)}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Compression level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">
                Level 1
                <span className="text-xs">(fastest,but not good quality)</span>
              </SelectItem>
              <SelectItem value="2">
                Level 2 <span className="text-xs">(good quality)</span>
              </SelectItem>
              <SelectItem value="3">
                Level 3 <span className="text-xs">(best quality)</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
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
