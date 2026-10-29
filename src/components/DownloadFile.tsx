export type FileMetadata = {
  name: string;
  path: string;
};

// A <p>, not a <div>: Safari Reader prunes a short div that is mostly link
// text, but keeps paragraphs. A plain link works without hydration.
export function DownloadFile({ name, path }: FileMetadata) {
  return (
    <p className="m-2">
      <a
        href={path}
        download={name}
        className="flex justify-between rounded border-2 border-primary-200 bg-primary-50 px-3 py-2 text-text-900 no-underline transition-colors hover:border-primary-400"
      >
        <span>{name}</span>
        <span className="font-medium text-primary-700">Download</span>
      </a>
    </p>
  );
}
