import { Button } from "@/components/ui/button";
import how1 from "@/assets/img/how1.png";
import how2 from "@/assets/img/how2.png";
import how3 from "@/assets/img/how3.png";
import Image from "next/image";

const Landing = () => {
  console.log(how1);

  return (
    <div className="flex flex-col gap-16 text-base mt-16">
      <div className="flex flex-col gap-10 px-4 py-10 @container">
        <div className="flex flex-col gap-4">
          <h1 className=" tracking-ligh text-center text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
            Why mediakits?
          </h1>
          <p className=" text-base font-normal leading-normal max-w-full">
            Make your videos smaller so they’re easier to share and store. No
            watermarks, no file limits, no registration.
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-0">
          <div className="flex flex-1 gap-3 rounded-lg border shadow-md  p-4 flex-col">
            <div
              className=""
              data-icon="Clock"
              data-size="24px"
              data-weight="regular"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path>
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className=" text-base font-bold leading-tight">
                Quick compression
              </h2>
              <p className="text-[#999999] text-sm font-normal leading-normal">
                Compress your videos in just a few clicks.
              </p>
            </div>
          </div>
          <div className="flex flex-1 gap-3 rounded-lg border shadow-md  p-4 flex-col">
            <div
              className=""
              data-icon="ShieldCheck"
              data-size="24px"
              data-weight="regular"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.68l50.34-50.34a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z"></path>
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className=" text-base font-bold leading-tight">
                Privacy and security
              </h2>
              <p className="text-[#999999] text-sm font-normal leading-normal">
                Your videos are private and secure. We don’t store your files in
                anywhere.
              </p>
            </div>
          </div>
          <div className="flex flex-1 gap-3 rounded-lg border shadow-md  p-4 flex-col">
            <div
              className=""
              data-icon="WifiHigh"
              data-size="24px"
              data-weight="regular"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M140,204a12,12,0,1,1-12-12A12,12,0,0,1,140,204ZM237.08,87A172,172,0,0,0,18.92,87,8,8,0,0,0,29.08,99.37a156,156,0,0,1,197.84,0A8,8,0,0,0,237.08,87ZM205,122.77a124,124,0,0,0-153.94,0A8,8,0,0,0,61,135.31a108,108,0,0,1,134.06,0,8,8,0,0,0,11.24-1.3A8,8,0,0,0,205,122.77Zm-32.26,35.76a76.05,76.05,0,0,0-89.42,0,8,8,0,0,0,9.42,12.94,60,60,0,0,1,70.58,0,8,8,0,1,0,9.42-12.94Z"></path>
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className=" text-base font-bold leading-tight">
                High definition
              </h2>
              <p className="text-[#999999] text-sm font-normal leading-normal">
                Maintain high-definition video quality after compression.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10 px-4 py-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="tracking-light text-center text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
              How to compress a video on VidCompress
            </h1>
            <p className="text-base font-normal leading-normal max-w-full">
              Make your videos smaller so they’re easier to share and store. No
              watermarks, no file limits, no registration.
            </p>
          </div>
          <Button
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className="flex min-w-[84px] cursor-pointer max-w-[480px] items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-green hover:bg-green/90 text-[#FFFFFF] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] w-fit"
          >
            <span className="truncate">Try it now</span>
          </Button>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3">
          <div className="flex flex-col gap-3 pb-3">
            <div className="w-full h-[135px] overflow-hidden rounded-xl">
              <Image
                src={how1}
                className="w-full -translate-y-1/4"
                width={240}
                height={135}
                alt="how2"
              />
            </div>
            <p className="text-base font-medium leading-normal">
              Upload a video
            </p>
          </div>
          <div className="flex flex-col gap-3 pb-3">
            <div className="w-full h-[135px] overflow-hidden rounded-xl">
              <Image
                src={how2}
                className="w-full -translate-y-1/4"
                width={240}
                height={135}
                alt="how2"
              />
            </div>
            <p className="text-base font-medium leading-normal">
              Wait for the video to compress
            </p>
          </div>
          <div className="flex flex-col gap-3 pb-3">
            <div className="w-full h-[135px] overflow-hidden rounded-xl">
              <Image
                src={how3}
                className="w-full -translate-y-1/4"
                width={240}
                height={135}
                alt="how2"
              />
            </div>
            <p className="text-base font-medium leading-normal">
              Download your compressed video
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
