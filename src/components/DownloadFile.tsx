export type FileMetadata = {
  name: string;
  path: string;
};

// A <p>, not a <div>: Safari Reader prunes a short div that is mostly link
// text, but keeps paragraphs. A plain link works without hydration.
export function DownloadFile({ name, path }: FileMetadata) {
  const extension = name.includes(".") ? name.split(".").pop()!.toUpperCase() : "FILE";
  return (
    <p className="my-3">
      <a
        href={path}
        download={name}
        className="group flex items-center gap-3 rounded-xl border border-primary-200 bg-primary-50 p-3 no-underline transition-colors hover:border-primary-400 hover:bg-primary-100"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-200 text-xs font-bold tracking-wide text-primary-800">
          {extension}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium text-text-900">{name}</span>
          <span className="block text-sm text-muted">{extension} file</span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary-500 px-3 py-1.5 text-sm font-medium text-white transition-transform group-hover:-translate-y-px">
          <svg
            aria-hidden="true"
            className="size-4 transition-transform group-hover:translate-y-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 4v11" />
            <path d="m7 10 5 5 5-5" />
            <path d="M5 20h14" />
          </svg>
          <span className="max-sm:sr-only">Download</span>
        </span>
      </a>
    </p>
  );
}
