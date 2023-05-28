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

export default memo(Pill);
