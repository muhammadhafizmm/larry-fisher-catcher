import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

import "./style.scss";
import { ReactComponent as FilterIcon } from "../../assets/svgs/filter.svg";
import { ReactComponent as ArrowBackIcon } from "../../assets/svgs/arrow-back.svg";
import { ReactComponent as CrossBackIcon } from "../../assets/svgs/cross.svg";
import { ReactComponent as AppLogo } from "../../assets/svgs/app-logo.svg";

function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(false);
  const [param] = useSearchParams();
  const querySearch = useMemo(() => param.get("q"), [param]);

  const [searchQuery, setSearchQuery] = useState(querySearch || "");
  const editableInput = useRef(null);

  function handleOnClick() {
    navigate("/search");
  }

  function handleBack() {
    navigate("/");
  }

  function handleClearInput() {
    setSearchQuery("");
    navigate({
      pathname: "/",
      search: `?q=`,
    });
  }

  function handleOpenFilter() {
    navigate("/filter");
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
    if (location.pathname === "/search" || location.pathname === "/filter") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      document.body.style.overflow = "hidden";
      if (location.pathname === "/search") {
        setActive(true);
      }
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

  useEffect(() => {
    if (querySearch) {
      setSearchQuery(querySearch);
    }
  }, [querySearch]);

  return (
    <div className="main-header">
      <div className="header">
        <div className="filter">
          {!active ? (
            <div onClick={handleOpenFilter}>
              <FilterIcon />
            </div>
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
