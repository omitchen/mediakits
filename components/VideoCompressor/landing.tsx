import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Landing = () => {
  return (
    <div className="flex flex-col gap-16 text-base mt-16">
      <Card>
        <CardHeader>
          <CardTitle>How To Compress a Video?</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside pl-4">
            <li>
              Click the “Upload or Drag file here” button to select your video
              file
            </li>
            <li>
              Keep the default options (they do a great job!) or specify
              advanced options
            </li>
            <li>Click on the “Compress Video” button to start compression</li>
            <li>
              When the status change to “Done” click the “Download Video” button
            </li>
          </ol>
        </CardContent>
        <CardFooter>
          <p>
            World&apos;s best video compressor to compress{" "}
            <span className="font-bold">MP4, AVI, MOV, WEBM, MKV </span>
            file. Choose the default options to compress video size by 40%, or
            choose a custom size.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Landing;
