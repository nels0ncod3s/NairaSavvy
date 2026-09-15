import { ImageResponse } from "next/og";
export const alt = "NairaSavvy — practical money guides for Nigerians";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#F5F0E8",
        color: "#1A1A1A",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 80,
        justifyContent: "space-between",
      }}
    >
      <div style={{ color: "#1B5E3B", fontSize: 42 }}>NairaSavvy</div>
      <div style={{ fontSize: 72, fontWeight: 700 }}>
        Make your next money decision with better information.
      </div>
      <div style={{ fontSize: 28 }}>
        Protect your savings · Know your rights · Cut costs
      </div>
    </div>,
    size,
  );
}
