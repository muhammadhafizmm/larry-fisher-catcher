import "./style.scss";
import { useNavigate } from "react-router-dom";

function SearchPage() {
  const navigate = useNavigate();
  function handleSelectHistory(value) {
    navigate({
      pathname: "/",
      search: `?q=${value}`,
    });
  }

  return (
    <div className="search-page-content">
      {localStorage.getItem("history-data") && (
        <div className="search-page-history">
          <span className="history-title">Riwayat Pencarian</span>
          <div className="history-item">
            {Array.isArray(JSON.parse(localStorage.getItem("history-data"))) &&
              JSON.parse(localStorage.getItem("history-data")).map((value) => (
                <span
                  className="history-bullet"
                  onClick={() => handleSelectHistory(value)}
                >
                  {value}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
