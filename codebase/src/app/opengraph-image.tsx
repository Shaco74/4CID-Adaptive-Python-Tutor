import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Python Bootcamp - Lerne Python mit KI-Unterstützung";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 256 255"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="a"
                x1="12.959%"
                x2="79.639%"
                y1="12.039%"
                y2="78.201%"
              >
                <stop offset="0%" stopColor="#387EB8" />
                <stop offset="100%" stopColor="#366994" />
              </linearGradient>
              <linearGradient
                id="b"
                x1="19.128%"
                x2="90.742%"
                y1="20.579%"
                y2="88.429%"
              >
                <stop offset="0%" stopColor="#FFE052" />
                <stop offset="100%" stopColor="#FFC331" />
              </linearGradient>
            </defs>
            <path
              fill="url(#a)"
              d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z"
            />
            <path
              fill="url(#b)"
              d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.131 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z"
            />
          </svg>
          <span style={{ fontSize: 72, fontWeight: "bold" }}>Python Bootcamp</span>
        </div>
        <div
          style={{
            fontSize: 32,
            opacity: 0.9,
            textAlign: "center",
            maxWidth: "80%",
          }}
        >
          Lerne Python-Programmierung mit KI-Unterstützung
        </div>
        <div
          style={{
            fontSize: 24,
            opacity: 0.7,
            marginTop: "24px",
          }}
        >
          4C/ID Lernmethode • Interaktive Übungen • Personalisiertes Feedback
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
