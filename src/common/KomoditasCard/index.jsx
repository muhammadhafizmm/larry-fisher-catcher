import { ReactComponent as FishLogo } from "../../assets/svgs/fish.svg";
import { ReactComponent as ScallerLogo } from "../../assets/svgs/scaller.svg";
import {
  formatStringDate,
  toIDRCurrency,
  toTitleCase,
} from "../../utils/string";
import "./style.scss";

function KomoditasCard({ product }) {
  // if all data undefined or null
  if (Object.values(product).every((val) => val === undefined || val === null))
    return null;

  return (
    <div className="komoditas-card">
      <div className="komoditas-content">
        <div className="komoditas-info">
          <div className="komoditas-title">
            <span>
              {product.komoditas
                ? toTitleCase(product.komoditas)
                : "Tidak Diketahui"}
            </span>
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
            Dibuat:{" "}
            {product.tgl_parsed
              ? formatStringDate(product.tgl_parsed, "DD MMM YYYY")
              : "Tidak Diketahui"}
          </span>
        </div>
      </div>
      <div className="komoditas-content">
        <div className="komoditas-size">
          <ScallerLogo />
          <span>{product.size || "Tidak Diketahui"} kg</span>
        </div>
        <div className="komoditas-price">
          <span className="komoditas-number-price">
            {product.price ? toIDRCurrency(product.price) : "Tidak Diketahui"}
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
