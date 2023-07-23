"use client";

export type FileMetadata = {
  name: string;
  path: string;
};

export function DownloadFile({ name, path }: FileMetadata) {
  const onClick = () => {
    window.location.assign(path);
  };
  return (
    <div className="m-2 flex justify-between rounded border-2 border-slate-500 bg-gray-200 px-3 py-2">
      {name}
      <button onClick={onClick}>Download</button>
    </div>
  );
}
