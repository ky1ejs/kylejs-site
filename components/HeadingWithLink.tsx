"use client";

import React, { useState } from "react";

interface HeadingWithLinkProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  id?: string;
  children: React.ReactNode;
  className?: string;
}

const HeadingWithLink = ({
  level,
  id,
  children,
  className = "",
  ...props
}: HeadingWithLinkProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const copyToClipboard = async () => {
    if (id) {
      const url = `${window.location.origin}${window.location.pathname}#${id}`;
      try {
        await navigator.clipboard.writeText(url);
        // Could add a toast notification here in the future
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    }
  };

  const renderHeading = () => {
    const headingProps = {
      id,
      className,
      ...props,
    };

    switch (level) {
      case 1:
        return <h1 {...headingProps}>{children}</h1>;
      case 2:
        return <h2 {...headingProps}>{children}</h2>;
      case 3:
        return <h3 {...headingProps}>{children}</h3>;
      case 4:
        return <h4 {...headingProps}>{children}</h4>;
      case 5:
        return <h5 {...headingProps}>{children}</h5>;
      case 6:
        return <h6 {...headingProps}>{children}</h6>;
      default:
        return <h2 {...headingProps}>{children}</h2>;
    }
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {id && (
        <button
          onClick={copyToClipboard}
          className={`hover:text-primary absolute top-1/2 -left-8 -translate-y-1/2 transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          aria-label={`Copy link to ${children}`}
          title="Copy link to this heading"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </button>
      )}
      {renderHeading()}
    </div>
  );
};

// Individual heading components for each level
export const H1 = (props: Omit<HeadingWithLinkProps, "level">) => (
  <HeadingWithLink level={1} {...props} />
);

export const H2 = (props: Omit<HeadingWithLinkProps, "level">) => (
  <HeadingWithLink level={2} {...props} />
);

export const H3 = (props: Omit<HeadingWithLinkProps, "level">) => (
  <HeadingWithLink level={3} {...props} />
);

export const H4 = (props: Omit<HeadingWithLinkProps, "level">) => (
  <HeadingWithLink level={4} {...props} />
);

export const H5 = (props: Omit<HeadingWithLinkProps, "level">) => (
  <HeadingWithLink level={5} {...props} />
);

export const H6 = (props: Omit<HeadingWithLinkProps, "level">) => (
  <HeadingWithLink level={6} {...props} />
);

export default HeadingWithLink;
