export type FileMetadata = {
  name: string;
  path: string;
};

// A <p>, not a <div>: Safari Reader prunes a short div that is mostly link
// text, but keeps paragraphs. A plain link works without hydration.
export function DownloadFile({ name, path }: FileMetadata) {
  const extension = name.includes(".") ? name.split(".").pop()!.toUpperCase() : "FILE";
  return (
    <p className="-mx-2.5 my-3 pt-0">
      <a
        href={path}
        download={name}
        className="group border-rule bg-surface hover:border-accent-text flex items-center gap-3 rounded-xl border px-[9px] py-2.5 no-underline transition-colors"
      >
        <span className="bg-accent-soft text-on-soft flex size-11 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-medium tracking-wide">
          {extension}
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-ink block truncate font-medium">{name}</span>
          <span className="block text-sm text-muted">{extension} file</span>
        </span>
        <span className="bg-accent-text text-on-accent group-hover:bg-accent-hover flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors">
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
