import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { env, AutoModel, AutoProcessor, RawImage } from "@xenova/transformers";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Loading from "@/components/csr/loading";

export default function Page() {
  const [images, setImages] = useState([]);
  const [processedImages, setProcessedImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloadReady, setIsDownloadReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const modelRef = useRef(null);
  const processorRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        if (!navigator.gpu) {
          throw new Error("WebGPU is not supported in this browser.");
        }
        const model_id = "Xenova/modnet";
        env.backends.onnx.wasm.proxy = false;
        modelRef.current ??= await AutoModel.from_pretrained(model_id, {
          device: "webgpu",
        });
        processorRef.current ??= await AutoProcessor.from_pretrained(model_id);
      } catch (err) {
        setError(err);
      }
      setIsLoading(false);
    })();
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    setImages((prevImages) => [
      ...prevImages,
      ...acceptedFiles.map((file) => URL.createObjectURL(file)),
    ]);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
  });

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setProcessedImages((prevProcessed) =>
      prevProcessed.filter((_, i) => i !== index)
    );
  };

  const processImages = async () => {
    setIsProcessing(true);
    setProcessedImages([]);

    const model = modelRef.current;
    const processor = processorRef.current;

    for (let i = 0; i < images.length; ++i) {
      // Load image
      const img = await RawImage.fromURL(images[i]);

      // Pre-process image
      const { pixel_values } = await processor(img);

      // Predict alpha matte
      const { output } = await model({ input: pixel_values });

      const maskData = (
        await RawImage.fromTensor(output[0].mul(255).to("uint8")).resize(
          img.width,
          img.height
        )
      ).data;

      // Create new canvas
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      // Draw original image output to canvas
      ctx.drawImage(img.toCanvas(), 0, 0);

      // Update alpha channel
      const pixelData = ctx.getImageData(0, 0, img.width, img.height);
      for (let i = 0; i < maskData.length; ++i) {
        pixelData.data[4 * i + 3] = maskData[i];
      }
      ctx.putImageData(pixelData, 0, 0);
      setProcessedImages((prevProcessed) => [
        ...prevProcessed,
        canvas.toDataURL("image/png"),
      ]);
    }

    setIsProcessing(false);
    setIsDownloadReady(true);
  };

  const downloadAsZip = async () => {
    const zip = new JSZip();
    const promises = images.map(
      (image, i) =>
        new Promise((resolve) => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const img = new Image();
          img.src = processedImages[i] || image;

          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              if (blob) {
                zip.file(`image-${i + 1}.png`, blob);
              }
              resolve(null);
            }, "image/png");
          };
        })
    );

    await Promise.all(promises);

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "images.zip");
  };

  const clearAll = () => {
    setImages([]);
    setProcessedImages([]);
    setIsDownloadReady(false);
  };

  const copyToClipboard = async (url) => {
    try {
      // Fetch the image from the URL and convert it to a Blob
      const response = await fetch(url);
      const blob = await response.blob();

      // Create a clipboard item with the image blob
      const clipboardItem = new ClipboardItem({ [blob.type]: blob });

      // Write the clipboard item to the clipboard
      await navigator.clipboard.write([clipboardItem]);

      console.log("Image copied to clipboard");
    } catch (err) {
      console.error("Failed to copy image: ", err);
    }
  };

  const downloadImage = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <h2 className="mb-2 text-4xl">ERROR</h2>
          {/* <p className="max-w-[500px] text-xl">{error.message}</p> */}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loading />
          <p className="text-lg">
            Loading background removal model(Only once), powered by{" "}
            <a
              className="underline"
              target="_blank"
              href="https://github.com/xenova/transformers.js"
              rel="noreferrer"
            >
              🤗 Transformers.js
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 pt-[var(--headerHeight)]">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-center text-4xl font-bold">
          Batch Background Remover
        </h1>
        <h2 className="mb-2 text-center text-lg font-semibold">
          In-browser background remover
        </h2>
        <div
          {...getRootProps()}
          className={`mb-8 cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors duration-300 ease-in-out
            ${isDragAccept ? "border-green-500 bg-green-900/20" : ""}
            ${isDragReject ? "border-red-500 bg-red-900/20" : ""}
            ${
              isDragActive
                ? "border-blue-500 bg-blue-900/20"
                : "border-gray-700 hover:border-blue-500 hover:bg-blue-900/10"
            }
          `}
        >
          <input {...getInputProps()} className="hidden" />
          <p className="mb-2 text-lg">
            {isDragActive
              ? "Drop the images here..."
              : "Drag and drop some images here"}
          </p>
          <p className="text-sm text-gray-400">or click to select files</p>
        </div>
        <div className="mb-8 flex flex-col items-center gap-4">
          <button
            onClick={processImages}
            disabled={isProcessing || images.length === 0}
            className="rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:bg-gray-700"
          >
            {isProcessing ? "Processing..." : "Process"}
          </button>
          <div className="flex gap-4">
            <button
              onClick={downloadAsZip}
              disabled={!isDownloadReady}
              className="rounded-md bg-green-600 px-3 py-1 text-sm text-white transition-colors duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:bg-gray-700"
            >
              Download as ZIP
            </button>
            <button
              onClick={clearAll}
              className="rounded-md bg-red-600 px-3 py-1 text-sm text-white transition-colors duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              Clear All
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {images.map((src, index) => (
            <div key={index} className="group relative">
              <img
                src={processedImages[index] || src}
                alt={`Image ${index + 1}`}
                className="h-48 w-full rounded-lg object-cover"
              />
              {processedImages[index] && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <button
                    onClick={() =>
                      copyToClipboard(processedImages[index] || src)
                    }
                    className="mx-2 rounded-md bg-white px-3 py-1 text-sm text-gray-900 transition-colors duration-200 hover:bg-gray-200"
                    aria-label={`Copy image ${index + 1} to clipboard`}
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => downloadImage(processedImages[index] || src)}
                    className="mx-2 rounded-md bg-white px-3 py-1 text-sm text-gray-900 transition-colors duration-200 hover:bg-gray-200"
                    aria-label={`Download image ${index + 1}`}
                  >
                    Download
                  </button>
                </div>
              )}
              <button
                onClick={() => removeImage(index)}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black bg-opacity-50 text-white opacity-0 transition-opacity duration-300 hover:bg-opacity-70 group-hover:opacity-100"
                aria-label={`Remove image ${index + 1}`}
              >
                &#x2715;
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
