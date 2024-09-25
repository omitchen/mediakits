// ffmpeg  -i "/xx/before.mp4" -c:v "libx265" -x265-params "crf=18" -y  "/xx/after.mp4"

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
  "30",
  "-preset",
  "superfast",
  "-threads",
  "4",
  "-progress",
  "-",
  "-v",
  "",
  "-y",
  "output.mp4",
];

export const level2Params = [
  "-i",
  "input.mp4",
  "-preset",
  "medium",
  "-crf",
  "23",
  "output_level2.mp4",
];

export const level3Params = [
  "-i",
  "input.mp4",
  "-preset",
  "veryslow",
  "-crf",
  "18",
  "output_level3.mp4",
];
