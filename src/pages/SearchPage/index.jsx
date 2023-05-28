import { useMemo } from "react";
import Pill from "../../common/Pill";
import "./style.scss";
import { useNavigate, useSearchParams } from "react-router-dom";
import { constructSearchQuery } from "../KomoditasList/helper";

function SearchPage() {
  const navigate = useNavigate();
  const [param] = useSearchParams();
  const querySearch = useMemo(() => {
    const tempQuerySearch = {
      ...(param.get("komoditas") && {
        komoditas: param.get("komoditas").toUpperCase(),
      }),
      ...(param.get("province") && {
        area_provinsi: param.get("province").toUpperCase(),
      }),
      ...(param.get("city") && { area_kota: param.get("city").toUpperCase() }),
      ...(param.get("size") && { size: param.get("size") }),
    };
    return tempQuerySearch;
  }, [param]);

  function handleSelectHistory(value) {
    navigate({
      pathname: "/",
      search: constructSearchQuery(
        value,
        querySearch.area_provinsi,
        querySearch.area_kota,
        querySearch.size
      ),
    });
  }

  return (
    <div className="search-page-content">
      {localStorage.getItem("history-data") && (
        <div className="search-page-history">
          <span className="history-title">Riwayat Pencarian</span>
          <div className="history-item">
            {Array.isArray(JSON.parse(localStorage.getItem("history-data"))) &&
              JSON.parse(localStorage.getItem("history-data")).map(
                (value, idx) => (
                  <Pill
                    key={`history_${value}_${idx}`}
                    handleOnClick={() => handleSelectHistory(value)}
                  >
                    {value}
                  </Pill>
                )
              )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
