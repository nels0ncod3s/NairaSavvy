import { ImageResponse } from "next/og";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#183c30",
      }}
    >
      <svg width="130" height="130" viewBox="0 0 64 64">
        <path
          d="M21 48V16l22 32V16M14 27h36M14 37h36"
          fill="none"
          stroke="#d8ef87"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>,
    size,
  );
}
