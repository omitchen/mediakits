// import Image from "next/image";
// import localFont from "next/font/local";
import NoSSRWrapper from "@/components/csr";
import VideoCompressor from "@/components/VideoCompressor";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const runtime = "edge";

export default function Home() {
  return (
    <NoSSRWrapper>
      <VideoCompressor />
    </NoSSRWrapper>
  );
}
