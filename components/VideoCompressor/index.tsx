import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { DownloadIcon } from "@radix-ui/react-icons";
import FileUpload from "./FileUpload";
import { level1Params } from "./content";
import isMobile from "@/lib/ismobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Landing from "./landing";
import Loading from "@/components/csr/loading";
import { convertBytesToAppropriateUnit } from "@/utils/conversion";

interface LoadURLs {
  coreURL: string;
  wasmURL: string;
  workerURL?: string;
}

enum processStatus {
  idle = "idle",
  processing = "processing",
  success = "success",
  error = "error",
}

interface BeforeAfterSize {
  before: number;
  after: number;
}

export default function Component() {
  const [isLoading, setIsLoading] = useState(true);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [outputFileName, setOutputFileName] = useState("");
  const [process, setProcess] = useState<processStatus>(processStatus.idle);
  const [beforeAfterSize, setBeforeAfterSize] =
    useState<BeforeAfterSize | null>(null);
  const [playable, setPlayable] = useState(true);

  const load = async () => {
    const ffmpeg = ffmpegRef.current;
    let loadURLs: LoadURLs = { coreURL: "", wasmURL: "" };

    if (!isMobile()) {
      const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/umd";
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
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
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

    const compressionParams = level1Params;
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
    // const ratio = (1 - compressedSize / originalSize) * 100;
    // setCompressionRatio(parseFloat(ratio.toFixed(2)));

    setBeforeAfterSize({
      before: originalSize,
      after: compressedSize,
    });

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
    setBeforeAfterSize(null);
    setProgress(0);
    if (file) {
      setProcess(processStatus.processing);
      transcode(file)
        .then(() => {
          setProcess(processStatus.success);
        })
        .catch((err) => {
          console.error("err", err);
          setProcess(processStatus.error);
        });
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen pt-[var(--headerHeight)]">
      <div className="justify-center items-center flex flex-col overflow-y-auto gap-4 max-w-[800px] w-full m-auto h-auto px-3 py-4">
        <h1 className="text-3xl font-bold">
          Online Free Video Compression Tool
        </h1>
        <p>
          <span className="font-bold text-green">
            Focus on privacy,Save Space, Boost Efficiency!
          </span>{" "}
          Use our online free video compression tool to quickly compress video
          files, making it easy to upload and share while maintaining high
          quality. (use desktop for best speed)
        </p>
        <div className="flex h-[176px] w-full flex-col gap-2">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center">
              <Loading />
              <p className="text-gray-600">
                Initialize the core module, Power by FFmpeg
              </p>
            </div>
          ) : process === processStatus.processing ? (
            <>
              <Progress value={progress} />
              <p className="leading-tight text-center">
                Compressing: {progress}% <br />
                <span className="text-red-400">{`(please don't close this page)`}</span>
              </p>
            </>
          ) : (
            <div className="w-full">
              <FileUpload onChange={handleFileChange} />
            </div>
          )}
        </div>
        {beforeAfterSize !== null && (
          <p className="leading-tight text-2xl text-center flex items-center">
            original size:
            <span className="line-through text-red-500">
              {convertBytesToAppropriateUnit(beforeAfterSize.before)}
            </span>
            🪄 compressed size: ✨
            <span className="font-bold text-green">
              {convertBytesToAppropriateUnit(beforeAfterSize.after)} ✨
            </span>{" "}
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
            setPlayable(false);
          }}
          className={cn(
            "max-w-[500px] max-h-[500px] w-full h-auto",
            process === processStatus.success ? "block" : "hidden"
          )}
        ></video>
        {!playable && (
          <p className="text-xs text-gray-400">
            The browser does not support playing this format of video. You can
            download it to your local computer for viewing.
          </p>
        )}
        {process === processStatus.success && (
          <Button
            variant="outline"
            size="lg"
            className="max-w-[500px] w-full"
            onClick={() => {
              const a = document.createElement("a");
              a.href = videoRef.current?.src || "";
              a.download = outputFileName;
              a.click();
            }}
          >
            <DownloadIcon className="w-4 h-4 mr-2" />
            Download
          </Button>
        )}
        <Landing />
      </div>
    </div>
  );
}
