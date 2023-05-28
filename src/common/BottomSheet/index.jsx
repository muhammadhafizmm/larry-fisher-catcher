import { useState } from "react";
import "./style.scss";

function BottomSheet({ isOpen, children}) {
  return (
    <div className={`bottom-sheet ${isOpen ? "active" : undefined}`}>
      {children}
    </div>
  );
}

export default BottomSheet;
