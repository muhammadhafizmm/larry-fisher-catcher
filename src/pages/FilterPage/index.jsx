import "./style.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Pill from "../../common/Pill";
import BottomSheet from "../../common/BottomSheet";

function FilterPage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  // const [locations, setLocation] = useState([])
  const [selectedLocation, setSelectedLocation] = useState([]);

  function itemExistInList(list, data) {
    return list.some((item) => JSON.stringify(item) === JSON.stringify(data));
  }

  function handleSelectPill(area) {
    if (itemExistInList(selectedLocation, area)) {
      setSelectedLocation((prev) =>
        prev.filter((item) => JSON.stringify(item) !== JSON.stringify(area))
      );
    } else {
      setSelectedLocation((prev) => [...prev, area]);
    }
  }

  function handleCloseOverlay() {
    setIsOpen(false);
    setTimeout(() => {
      navigate("/");
    }, 800);
  }

  useEffect(() => {
    setTimeout(() => {
      setIsOpen(true);
    }, 200);
  }, []);

  // useEffect(() => {
    
  // }, [])

  return (
    <div className="filter-page-wrapper">
      <div
        className={`filter-page-overlay ${isOpen && "active"}`}
        onClick={handleCloseOverlay}
      ></div>
      <div className="filter-page-container">
        <BottomSheet isOpen={isOpen}>
          <div className="filter-page-content">
            <span className="filter-title">Filter</span>
            <div className="filter-item">
              <div className="filter-label-wrapper">
                <span className="filter-label">Lokasi</span>
                <span className="filter-more">Lihat Lainnya</span>
              </div>
              <div className="filter-pill-wrapper">
                <Pill
                  handleOnClick={() =>
                    handleSelectPill({ provinsi: "Jawa Barat", area: "Depok" })
                  }
                  isActive={itemExistInList(selectedLocation, {
                    provinsi: "Jawa Barat",
                    area: "Depok",
                  })}
                >
                  Jawa Barat - Depok
                </Pill>
                <Pill>Aceh - Aceh Kota</Pill>
                <Pill>Jawa Barat - Bogor</Pill>
                <Pill>Jawa Timur - Surabaya</Pill>
                <Pill>Jakarta - DKI Jakarta</Pill>
              </div>
            </div>
            <div className="filter-item">
              <div className="filter-label-wrapper">
                <span className="filter-label">Berat</span>
                <span className="filter-more">Lihat Lainnya</span>
              </div>
              <div className="filter-pill-wrapper">
                <Pill>10 Kg</Pill>
                <Pill>20 Kg</Pill>
                <Pill>30 Kg</Pill>
                <Pill>40 Kg</Pill>
                <Pill>50 Kg</Pill>
                <Pill>60 Kg</Pill>
                <Pill>70 Kg</Pill>
                <Pill>80 Kg</Pill>
                <Pill>90 Kg</Pill>
              </div>
            </div>
          </div>
        </BottomSheet>
      </div>
    </div>
  );
}

export default FilterPage;
