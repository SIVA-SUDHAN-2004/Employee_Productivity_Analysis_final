import React from "react";

const Card = ({ children, className = "" }) => (
  <div className={`bg-slate-900/70 border border-slate-800 rounded-2xl p-4 ${className}`}>
    {children}
  </div>
);

export default Card;
