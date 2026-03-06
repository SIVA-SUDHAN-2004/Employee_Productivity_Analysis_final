// client/src/pages/NotFoundPage.jsx
import React from "react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-sm text-slate-400 mb-4">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <a
          href="/"
          className="px-4 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-sm"
        >
          Go back to dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
