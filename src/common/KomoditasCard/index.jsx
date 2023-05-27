import { ReactComponent as FishLogo } from "../../assets/svgs/fish.svg";
import { ReactComponent as ScallerLogo } from "../../assets/svgs/scaller.svg";
import {
  formatStringDate,
  toIDRCurrency,
  toTitleCase,
} from "../../utils/string";
import "./style.scss";

function KomoditasCard({ product }) {
  return (
    <div className="komoditas-card">
      <div className="komoditas-content">
        <div className="komoditas-info">
          <div className="komoditas-title">
            <span>{toTitleCase(product.komoditas)}</span>
            <FishLogo />
          </div>
          <div className="komoditas-additional-info">
            <span className="additional-info">
              {product.area_provinsi
                ? toTitleCase(product.area_provinsi)
                : "Tidak Diketahui"}
            </span>
            <div className="devider"></div>
            <span className="additional-info">
              {product.area_kota
                ? toTitleCase(product.area_kota)
                : "Tidak Diketahui"}
            </span>
          </div>
        </div>
        <div className="created">
          <span>
            Dibuat: {formatStringDate(product.tgl_parsed, "DD MMM YYYY")}
          </span>
        </div>
      </div>
      <div className="komoditas-content">
        <div className="komoditas-size">
          <ScallerLogo />
          <span>{product.size} kg</span>
        </div>
        <div className="komoditas-price">
          <span className="komoditas-number-price">
            {toIDRCurrency(product.price)}
          </span>
          <span className="komoditas-measurment">/kg</span>
        </div>
      </div>
    </div>
  );
}

export function KomoditasCardSkeleton() {
  return <div className="komoditas-skeleton"></div>;
}

export default KomoditasCard;
