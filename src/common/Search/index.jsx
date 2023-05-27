import "./style.scss";
import { ReactComponent as FilterLogo } from "../../assets/svgs/filter.svg";
import { ReactComponent as AppLogo } from "../../assets/svgs/app-logo.svg";
import { useState } from "react";

function Search({ isActive }) {
  const [searchQuery, setSearchQuery] = useState("Cari Komoditas")

  // TODO @muhammadhafizmm: handle search page
  function handleOnClick() {
    console.log("mantap");
  }
  
  return (
    <div className="main-header">
      <div className="header">
        <div className="filter">
          <FilterLogo />
        </div>
        <div className="search-bar disable" onClick={handleOnClick}>
          <input type="text" disabled placeholder="Cari Komoditas" />
        </div>
        <div className="app-logo">
          <AppLogo />
        </div>
      </div>
    </div>
  );
}

export default Search;
