"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/dataVis");
  };

  return (
    <div style={{ position: "relative", overflow: "hidden", fontFamily: "Arial, sans-serif" }}>
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 1,
          backgroundColor: "rgba(240, 240, 240, 0.8)",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            maxWidth: "900px",
            width: "100%",
          }}
        >
          {/* Header */}
          <header style={{ textAlign: "center", marginBottom: "30px" }}>
            <h1
              style={{
                fontSize: "2.5rem",
                margin: "0 0 10px 0",
                color: "#333",
                letterSpacing: "0.5px",
              }}
            >
              Perfume Note Visualization
            </h1>
          </header>

          {/* Exploration Section */}
          <section style={{ textAlign: "left", marginBottom: "30px" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                marginBottom: "20px",
                color: "#333",
                borderBottom: "1px solid #ddd", // Adjusted to match Legends
                paddingBottom: "10px",
              }}
            >
              Exploration
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(192, 192, 192, 0.5)",
                }}
              >
                <strong>1. Relationship of Notes</strong>
                <p style={{ margin: 0, color: "#555", lineHeight: "1.6" }}>
                  Hover or click on a node to highlight the connected notes and observe which fragrance notes are frequently paired together.
                </p>
              </div>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(192, 192, 192, 0.5)",
                }}
              >
                <strong>2. Analyze Note Role</strong>
                <p style={{ margin: 0, color: "#555", lineHeight: "1.6" }}>
                  Explore how top, middle, and base notes are used by clicking on the respective layers in the fragrance pyramid. This allows you to focus on specific roles of the notes.
                </p>
              </div>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(192, 192, 192, 0.5)",
                }}
              >
                <strong>3. Brand Comparison</strong>
                <p style={{ margin: 0, color: "#555", lineHeight: "1.6" }}>
                  Compare how the top 6 perfume brands utilize notes differently, highlighting seasonal variations in their creations.
                </p>
              </div>
            </div>
          </section>

          {/* Legends Section */}
          <section style={{ textAlign: "left", marginBottom: "30px" }}>
            <h3
              style={{
                fontSize: "1.2rem",
                marginBottom: "20px",
                color: "#333",
                borderBottom: "1px solid #ddd",
                paddingBottom: "10px",
              }}
            >
              Legends
            </h3>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "40px",
              }}
            >
              {/* Node Colors */}
              <div>
                <strong>Node Colors</strong>
                <ul style={{ display: "flex", gap: "15px", padding: 0, listStyle: "none" }}>
                  <li style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "#F45DA6",
                        marginRight: "5px",
                      }}
                    ></div>
                    Spring
                  </li>
                  <li style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "#7DC352",
                        marginRight: "5px",
                      }}
                    ></div>
                    Summer
                  </li>
                  <li style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "#D2691E",
                        marginRight: "5px",
                      }}
                    ></div>
                    Autumn
                  </li>
                  <li style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "#87CEEB",
                        marginRight: "5px",
                      }}
                    ></div>
                    Winter
                  </li>
                </ul>
              </div>

              {/* Link Thickness */}
              <div>
                <strong>Note Pairing</strong>
                <ul style={{ display: "flex", gap: "15px", padding: 0, listStyle: "none" }}>
                  <li style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "50px",
                        height: "2px",
                        backgroundColor: "#666",
                        marginRight: "5px",
                      }}
                    ></div>
                    Few
                  </li>
                  <li style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "50px",
                        height: "8px",
                        backgroundColor: "#666",
                        marginRight: "5px",
                      }}
                    ></div>
                    Common
                  </li>
                  <li style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "50px",
                        height: "12px",
                        backgroundColor: "#666",
                        marginRight: "5px",
                      }}
                    ></div>
                    Frequent
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* "Next" Button */}
          <section style={{ textAlign: "center", marginBottom: "20px" }}>
            <button
              onClick={handleNext}
              style={{
                padding: "14px 28px",
                fontSize: "1rem",
                fontWeight: "bold",
                backgroundColor: "#0070f3",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                transition: "background-color 0.3s ease, transform 0.2s",
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#005bb5";
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0070f3";
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
            >
              Next
            </button>
          </section>

          {/* Footer */}
          <footer style={{ textAlign: "center" }}>
            <p style={{ fontSize: "0.9rem", color: "#999" }}>
              Copyright © Suyoun Lee
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
