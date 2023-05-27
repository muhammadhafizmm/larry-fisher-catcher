import { ReactComponent as FishLogo } from "../../assets/svgs/fish.svg";
import { ReactComponent as ScallerLogo } from "../../assets/svgs/scaller.svg";
import "./style.scss"

function KomoditasCard() {
  return (
    <div className="komoditas-card">
      <div className="komoditas-content">
        <div className="komoditas-info">
          <div className="komoditas-title">
            <span>Bandeng</span>
            <FishLogo />
          </div>
          <div className="komoditas-additional-info">
            <span className="additional-info">Aceh</span>
            <div className="devider"></div>
            <span className="additional-info">Aceh Kota</span>
          </div>
        </div>
        <div className="created">
          <span>Dibuat: 22 Mei 2023</span>
        </div>
      </div>
      <div className="komoditas-content">
        <div className="komoditas-size">
          <ScallerLogo />
          <span>200 kg</span>
        </div>
        <div className="komoditas-price">
          <span className="komoditas-number-price">Rp. 200.000,00</span>
          <span className="komoditas-measurment">/kg</span>
        </div>
      </div>
    </div>
  );
}

export default KomoditasCard;
