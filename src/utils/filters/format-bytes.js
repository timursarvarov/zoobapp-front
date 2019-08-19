export default function formatBytes(bytes, decimals) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;

  const dm = decimals <= 0 ? 0 : decimals || 2;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  // eslint-disable-next-line no-restricted-properties
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
