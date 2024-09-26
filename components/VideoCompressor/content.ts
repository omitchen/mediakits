// -i input.mp4: Specify the input file
// -c:v libx264: Use H.264 encoder
// -tag:v avc1: Set video tag to AVC1 for better compatibility
// -movflags faststart: Optimize file structure for faster playback start
// -crf 30: Set Constant Rate Factor to 30 (higher value means lower quality and smaller file size)
// -preset superfast: Use superfast preset, sacrificing some compression efficiency for faster encoding speed
// -threads 4: Use 4 threads for encoding
// -progress -: Display encoding progress
// -v "": Disable verbose output
// -y: Overwrite output file (if it exists)
// output.mp4: Output filename

export const level1Params = [
  "-i",
  "input.mp4",
  "-c:v",
  "libx264",
  "-tag:v",
  "avc1",
  "-movflags",
  "faststart",
  "-crf",
  "23",
  "-preset",
  "veryfast",
  "-threads",
  "4",
  "-progress",
  "-",
  "-v",
  "",
  "-y",
  "output_level1.mp4",
];

export const level2Params = [
  "-i",
  "input.mp4",
  "-c:v",
  "libx264",
  "-tag:v",
  "avc1",
  "-movflags",
  "faststart",
  "-crf",
  "28",
  "-preset",
  "veryfast",
  "-threads",
  "4",
  "-progress",
  "-",
  "-v",
  "",
  "-y",
  "output_level2.mp4",
];

export const level3Params = [
  "-i",
  "input.mp4",
  "-c:v",
  "libx264",
  "-tag:v",
  "avc1",
  "-movflags",
  "faststart",
  "-crf",
  "33",
  "-preset",
  "veryfast",
  "-threads",
  "4",
  "-progress",
  "-",
  "-v",
  "",
  "-y",
  "output_level3.mp4",
];
