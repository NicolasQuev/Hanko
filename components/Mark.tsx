import type { SeriesStatus } from "@/lib/types";

interface MarkProps {
  status: SeriesStatus;
  size?: number;
  variant?: "seal" | "strike";
}

export function Mark({ status, size = 18, variant = "seal" }: MarkProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    focusable: false,
  };

  switch (status) {
    case "watching":
      return (
        <svg {...common}>
          <circle
            cx="12"
            cy="12"
            r="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
          />
          <circle
            cx="12"
            cy="12"
            r="3"
            fill="currentColor"
          />
        </svg>
      );
    case "paused":
      return (
        <svg {...common}>
          <rect x="6.5" y="5" width="4" height="14" rx="1" fill="currentColor" />
          <rect x="13.5" y="5" width="4" height="14" rx="1" fill="currentColor" />
        </svg>
      );
    case "planned":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3.2" fill="currentColor" />
        </svg>
      );
    default:
      if (variant === "strike") {
        return (
          <svg {...common}>
            <line
              x1="4.5"
              y1="19.5"
              x2="19.5"
              y2="4.5"
              stroke="currentColor"
              strokeWidth="3.4"
              strokeLinecap="round"
            />
          </svg>
        );
      }
      return (
        <svg {...common}>
          <rect
            x="2.5"
            y="2.5"
            width="19"
            height="19"
            fill="currentColor"
          />
          <text
            x="12"
            y="16.6"
            textAnchor="middle"
            fontFamily="'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif"
            fontWeight="700"
            fontSize="12.5"
            fill="#f2efe6"
          >
            完
          </text>
        </svg>
      );
  }
}
