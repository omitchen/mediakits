export function convertBytesToAppropriateUnit(bytes: number): string {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (bytes >= GB) {
    return (bytes / GB).toFixed(2) + " GB";
  } else if (bytes >= MB) {
    return (bytes / MB).toFixed(2) + " MB";
  } else if (bytes >= KB) {
    return (bytes / KB).toFixed(2) + " KB";
  } else {
    return bytes.toFixed(0) + " B";
  }
}
