import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon — iris field + yellow “E” mark. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#3a0ca3",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#fff275",
            fontSize: 110,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          E
        </div>
      </div>
    ),
    { ...size },
  );
}
