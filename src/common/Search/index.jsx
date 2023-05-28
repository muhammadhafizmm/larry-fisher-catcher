import { memo, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "./style.scss";
import { ReactComponent as FilterIcon } from "../../assets/svgs/filter.svg";
import { ReactComponent as ArrowBackIcon } from "../../assets/svgs/arrow-back.svg";
import { ReactComponent as CrossBackIcon } from "../../assets/svgs/cross.svg";
import { ReactComponent as AppLogo } from "../../assets/svgs/app-logo.svg";

function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const editableInput = useRef(null);

  function handleOnClick() {
    navigate("/search");
  }

  function handleBack() {
    navigate("/");
    setSearchQuery("");
  }

  function handleClearInput() {
    setSearchQuery("")
  }

  function handleOnSubmitWithEnter(event) {
    if (event.key === "Enter") {
      navigate({
        pathname: "/",
        search: `?q=${searchQuery}`,
      });
    }
  }

  useEffect(() => {
    if (location.pathname === "/search") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      document.body.style.overflow = "hidden";
      setActive(true);
    } else {
      document.body.style.overflow = "unset";
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
        <div
          className="search-bar"
          onClick={!active ? handleOnClick : undefined}
        >
          <input
            disabled={!active}
            ref={editableInput}
            type="text"
            placeholder="Cari Komoditas"
            onKeyDown={handleOnSubmitWithEnter}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="clear-input" onClick={handleClearInput}>
            <CrossBackIcon />
          </div>
        </div>
        <div className="app-logo">{!active && <AppLogo />}</div>
      </div>
    </div>
  );
}

export default memo(Search);
