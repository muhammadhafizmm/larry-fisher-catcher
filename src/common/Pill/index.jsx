import { memo } from "react";
import "./style.scss";
function Pill({ children, handleOnClick, isActive }) {
  return (
    <span
      className={`pill-container ${isActive && "active"}`}
      style={handleOnClick && { cursor: "pointer" }}
      onClick={() => handleOnClick && handleOnClick()}
    >
      {children}
    </span>
  );
}

export function PillSkeleton({ width }) {
  return <span className="pill-skeleton" style={{ width }}></span>;
}

export default memo(Pill);
