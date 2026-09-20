import { ImageResponse } from "next/og"

export const alt = "Fetch Pet Supply — everything your best friend needs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#1E5631",
          padding: "96px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            backgroundColor: "#E3A93B",
            marginBottom: 32,
          }}
        />
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.1,
          }}
        >
          Fetch Pet Supply
        </div>
        <div style={{ fontSize: 40, color: "#E3A93B", marginTop: 20 }}>
          Everything your best friend needs
        </div>
      </div>
    ),
    { ...size }
  )
}
