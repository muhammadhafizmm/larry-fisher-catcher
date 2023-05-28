import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

import "./style.scss";
import { ReactComponent as FilterIcon } from "../../assets/svgs/filter.svg";
import { ReactComponent as ArrowBackIcon } from "../../assets/svgs/arrow-back.svg";
import { ReactComponent as CrossBackIcon } from "../../assets/svgs/cross.svg";
import { ReactComponent as AppLogo } from "../../assets/svgs/app-logo.svg";
import { toTitleCase } from "../../utils/string";
import { constructSearchQuery } from "../../pages/KomoditasList/helper";

function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(false);
  const [param] = useSearchParams();

  const querySearch = useMemo(() => {
    const tempQuerySearch = {
      ...(param.get("komoditas") && {
        komoditas: toTitleCase(param.get("komoditas")),
      }),
      ...(param.get("province") && {
        area_provinsi: param.get("province").toUpperCase(),
      }),
      ...(param.get("city") && { area_kota: param.get("city").toUpperCase() }),
      ...(param.get("size") && { size: param.get("size") }),
    };
    return tempQuerySearch;
  }, [param]);

  const [searchQuery, setSearchQuery] = useState(querySearch.komoditas || "");
  const editableInput = useRef(null);

  function handleOnClick() {
    navigate({
      pathname: "/search",
      search: constructSearchQuery(
        querySearch.komoditas,
        querySearch.area_provinsi,
        querySearch.area_kota,
        querySearch.size
      ),
    });
  }

  function handleBack() {
    navigate({
      pathname: "/",
      search: constructSearchQuery(
        querySearch.komoditas,
        querySearch.area_provinsi,
        querySearch.area_kota,
        querySearch.size
      ),
    });
  }

  function handleClearInput() {
    setSearchQuery("");
    navigate({
      pathname: "/",
      search: constructSearchQuery(
        undefined,
        querySearch.area_provinsi,
        querySearch.area_kota,
        querySearch.size
      ),
    });
  }

  function handleOpenFilter() {
    navigate({
      pathname: "/filter",
      search: constructSearchQuery(
        querySearch.komoditas,
        querySearch.area_provinsi,
        querySearch.area_kota,
        querySearch.size
      ),
    });
  }

  function handleOnSubmitWithEnter(event) {
    if (event.key === "Enter") {
      navigate({
        pathname: "/",
        search: constructSearchQuery(
          searchQuery,
          querySearch.area_provinsi,
          querySearch.area_kota,
          querySearch.size
        ),
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
    if (querySearch.komoditas) {
      setSearchQuery(querySearch.komoditas);
    }
  }, [querySearch.komoditas]);

  return (
    <div className="main-header">
      <div className="header">
        <div className="filter">
          {!active ? (
            <div onClick={handleOpenFilter}>
              {((querySearch.area_kota && querySearch.area_provinsi) ||
                querySearch.size) && <span className="filter-apply"></span>}
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
