import KomoditasCard from "../../common/KomoditasCard";
import Search from "../../common/Search";
import "./style.scss";

function KomoditasList() {
  return (
    <div className="komoditas-container">
      <Search />
      <div className="content">
        <KomoditasCard/>
      </div>
    </div>
  );
}

export default KomoditasList;
