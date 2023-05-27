import { memo, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "./style.scss";
import { ReactComponent as FilterIcon } from "../../assets/svgs/filter.svg";
import { ReactComponent as ArrowBackIcon } from "../../assets/svgs/arrow-back.svg";
import { ReactComponent as AppLogo } from "../../assets/svgs/app-logo.svg";

function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("Cari Komoditas");
  const editableInput = useRef(null);

  // TODO @muhammadhafizmm: handle search page
  function handleOnClick() {
    navigate("/search");
  }

  function handleBack() {
    navigate("/");
    setSearchQuery("");
  }

  function handleOnSubmitWithEnter(event) {
    if (event.key === "Enter") {
      console.log(searchQuery);
    }
  }

  useEffect(() => {
    if (location.pathname === "/search") {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [location.pathname]);

  // onclick focus input
  useEffect(() => {
    if (active && editableInput.current) {
      editableInput.current.focus();
    }
  }, [editableInput, active]);

  return (
    <div className="main-header">
      <div className="header">
        <div className="filter">
          {!active ? (
            <FilterIcon />
          ) : (
            <div onClick={handleBack}>
              <ArrowBackIcon />
            </div>
          )}
        </div>
        {!active ? (
          <div className="search-bar disable" onClick={handleOnClick}>
            <input type="text" disabled placeholder="Cari Komoditas" />
          </div>
        ) : (
          <input
            ref={editableInput}
            type="text"
            placeholder="Cari Komoditas"
            onKeyDown={handleOnSubmitWithEnter}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}
        <div className="app-logo">{!active && <AppLogo />}</div>
      </div>
    </div>
  );
}

export default memo(Search);
