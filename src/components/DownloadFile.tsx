export type FileMetadata = {
  name: string;
  path: string;
};

// A <p>, not a <div>: Safari Reader prunes a short div that is mostly link
// text, but keeps paragraphs. A plain link works without hydration.
export function DownloadFile({ name, path }: FileMetadata) {
  return (
    <p className="m-2 flex justify-between rounded border-2 border-slate-500 bg-gray-200 px-3 py-2">
      <span>{name}</span>
      <a href={path} download={name}>
        Download
      </a>
    </p>
  );
}
