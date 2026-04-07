import React from "react";

/**
 * Full-screen overlay displayed during any async network action.
 * Rendered inside ProtectedRoute so it covers the entire app including
 * the sidebar, navbar, and page content.
 */
const LoadingOverlay = () => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(2, 6, 23, 0.65)",
      backdropFilter: "blur(4px)",
      WebkitBackdropFilter: "blur(4px)"
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
      {/* Spinner ring */}
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          border: "4px solid rgba(99, 102, 241, 0.25)",
          borderTopColor: "#6366f1",
          animation: "ep-spin 0.75s linear infinite"
        }}
      />
      <p style={{ color: "#a5b4fc", fontSize: "14px", fontWeight: 500, letterSpacing: "0.02em" }}>
        Processing…
      </p>
    </div>

    {/* Keyframe injected inline — avoids any CSS module dependency */}
    <style>{`
      @keyframes ep-spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default LoadingOverlay;
