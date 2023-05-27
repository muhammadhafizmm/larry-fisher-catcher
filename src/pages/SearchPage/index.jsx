import "./style.scss";
import { useEffect } from "react";

function SearchPage() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    console.log("mantap");
  }, []);
  return (
    <div className="search-page-content">
      <div className="search-page-history">
        <span className="history-title">Riwayat Pencarian</span>
        <div className="history-item">
          <span className="history-bullet">Nila</span>
          <span className="history-bullet">Rendang</span>
          <span className="history-bullet">Sapi</span>
          <span className="history-bullet">Kura-kura</span>
          <span className="history-bullet">Kudanil</span>
          <span className="history-bullet">Kucing</span>
          <span className="history-bullet">Anjing Laut</span>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
