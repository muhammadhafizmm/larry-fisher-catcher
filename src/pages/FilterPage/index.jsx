import "./style.scss";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import BottomSheet from "../../common/BottomSheet";
import Pill, { PillSkeleton } from "../../common/Pill";
import { getProductArea, getProductSize } from "../../service";

import { toTitleCase } from "../../utils/string";
import { isTwoObjectIdentical } from "./helper";
import { constructSearchQuery } from "../KomoditasList/helper";
import ViewMoreFilterOption from "./ViewMoreFilterOptions";

const RENDERED_LOCATION_LENGHT = 5;
const RENDERED_SIZE_LENGHT = 9;

function FilterPage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMoreOptions, setViewMoreOption] = useState({
    openModal: false,
    type: undefined,
  });

  const [sizes, setSizes] = useState([]);
  const [locations, setLocations] = useState([]);

  const [renderedSizes, setRenderedSizes] = useState([]);
  const [renderedLocations, setRenderedLocations] = useState([]);

  const [param] = useSearchParams();
  const querySearch = useMemo(() => {
    const tempQuerySearch = {
      ...(param.get("komoditas") && {
        komoditas: param.get("komoditas").toUpperCase(),
      }),
      ...(param.get("province") && {
        area_provinsi: param.get("province").toUpperCase(),
      }),
      ...(param.get("city") && { area_kota: param.get("city").toUpperCase() }),
      ...(param.get("size") && { size: param.get("size") }),
    };
    return tempQuerySearch;
  }, [param]);

  const [selectedSize, setSelectedSize] = useState(
    querySearch.size ? { size: querySearch.size } : undefined
  );
  const [selectedLocation, setSelectedLocation] = useState(
    querySearch.area_provinsi && querySearch.area_kota
      ? { province: querySearch.area_provinsi, city: querySearch.area_kota }
      : undefined
  );

  function handleOpenViewMore(type) {
    setViewMoreOption((prev) => ({
      ...prev,
      type,
    }));

    // not best practice, tapi no time. skripsi belom kelar :))))
    setTimeout(() => {
      setViewMoreOption((prev) => ({
        ...prev,
        openModal: true,
      }));
    }, 200);
  }

  function handleCloseViewMore() {
    setViewMoreOption((prev) => ({
      ...prev,
      openModal: false,
    }));

    setTimeout(() => {
      setViewMoreOption((prev) => ({
        ...prev,
        type: undefined,
      }));
    }, 300);
  }

  function handleViewMoreOptionChange(value) {
    if (viewMoreOptions.type === "location") {
      setSelectedLocation(value);
    } else if (viewMoreOptions.type === "size") {
      setSelectedSize(value);
    }
    handleCloseViewMore();
  }

  function handleResetFilter() {
    setSelectedSize(undefined);
    setSelectedLocation(undefined);
  }

  function handleCloseOverlay() {
    setIsOpen(false);
    setTimeout(() => {
      navigate({
        pathname: "/",
        search: constructSearchQuery(
          querySearch.komoditas,
          selectedLocation?.province,
          selectedLocation?.city,
          selectedSize?.size
        ),
      });
    }, 800);
  }

  const renderSelectedLocationNotIncludes = useCallback(() => {
    if (
      !selectedLocation ||
      !selectedLocation.province ||
      !selectedLocation.city
    )
      return null;
    const tempSelectedLocation = {
      province: selectedLocation.province,
      city: selectedLocation.city,
    };
    const isSelectedLocationExistInList = renderedLocations.some(
      (item) => JSON.stringify(item) === JSON.stringify(tempSelectedLocation)
    );
    return !isSelectedLocationExistInList ? (
      <Pill
        key={`option_${tempSelectedLocation.province}_${tempSelectedLocation.city}`}
        handleOnClick={() => setSelectedLocation(tempSelectedLocation)}
        isActive={isTwoObjectIdentical(selectedLocation, tempSelectedLocation)}
      >
        {`${toTitleCase(tempSelectedLocation.province)} - ${toTitleCase(
          tempSelectedLocation.city
        )}`}
      </Pill>
    ) : null;
  }, [renderedLocations, selectedLocation]);

  const renderSelectedSizeNotIncludes = useCallback(() => {
    if (!selectedSize || !selectedSize.size) return null;
    const tempSelectedSize = {
      size: selectedSize.size,
    };
    const isSelectedSizeExistInList = renderedSizes.some(
      (item) => JSON.stringify(item) === JSON.stringify(tempSelectedSize)
    );
    return !isSelectedSizeExistInList ? (
      <Pill
        key={`option_${tempSelectedSize.size}}`}
        handleOnClick={() => setSelectedSize(tempSelectedSize)}
        isActive={isTwoObjectIdentical(selectedSize, tempSelectedSize)}
      >
        {`${tempSelectedSize.size} Kg`}
      </Pill>
    ) : null;
  }, [renderedSizes, selectedSize]);

  useEffect(() => {
    setLoading(true);
    async function fetchFilterOptionData() {
      await Promise.all([await getProductArea(), await getProductSize()]).then(
        (response) => {
          let sizes = response[1];
          const locations = response[0];

          // remove duplicate value
          sizes = sizes.filter(
            (currentObj, currentIndex, entireArray) =>
              entireArray.findIndex((obj) => obj.size === currentObj.size) ===
              currentIndex
          );

          // sort size
          sizes.sort((prev, next) => parseInt(prev.size) - parseInt(next.size));
          setSizes(sizes);
          setRenderedSizes(sizes.slice(0, RENDERED_SIZE_LENGHT));
          setRenderedLocations(locations.slice(0, RENDERED_LOCATION_LENGHT));

          // sort provice
          locations.sort(
            (prev, next) =>
              prev.province &&
              next.province &&
              prev.province.localeCompare(next.province)
          );
          setLocations(locations);
          setLoading(false);
        }
      );
    }
    fetchFilterOptionData();
    setTimeout(() => {
      setIsOpen(true);
    }, 200);
  }, []);

  return (
    <div className="filter-page-wrapper">
      <div className={`bottom-sheet-wrapper ${!!isOpen && "active"}`}>
        <div
          className={`filter-page overlay ${!!isOpen && "active"}`}
          onClick={handleCloseOverlay}
        ></div>
        <div className="filter-page-container">
          <BottomSheet isOpen={isOpen}>
            <div className="filter-page-content">
              <div className="filter-title-wrapper">
                <span className="filter-title">Filter</span>
                <span className="filter-reset" onClick={handleResetFilter}>
                  Reset
                </span>
              </div>
              <div className="filter-item">
                <div className="filter-label-wrapper">
                  <span className="filter-label">Lokasi</span>
                  <span
                    className="filter-more"
                    onClick={() => handleOpenViewMore("location")}
                  >
                    Lihat Lainnya
                  </span>
                </div>
                <div className="filter-pill-wrapper">
                  {!loading && renderSelectedLocationNotIncludes()}
                  {loading &&
                    !renderedLocations.length &&
                    [...Array(RENDERED_LOCATION_LENGHT)].map((_, idx) => (
                      <PillSkeleton
                        width={120}
                        key={`skeleton_location_${idx}`}
                      />
                    ))}
                  {!!renderedLocations.length &&
                    renderedLocations.map((locationData, _) => (
                      <Pill
                        key={`option_${locationData.province}_${locationData.city}`}
                        handleOnClick={() => setSelectedLocation(locationData)}
                        isActive={isTwoObjectIdentical(
                          selectedLocation,
                          locationData
                        )}
                      >
                        {`${toTitleCase(locationData.province)} - ${toTitleCase(
                          locationData.city
                        )}`}
                      </Pill>
                    ))}
                </div>
              </div>
              <div className="filter-item">
                <div className="filter-label-wrapper">
                  <span className="filter-label">Berat</span>
                  <span
                    className="filter-more"
                    onClick={() => handleOpenViewMore("size")}
                  >
                    Lihat Lainnya
                  </span>
                </div>
                <div className="filter-pill-wrapper">
                  {!loading && renderSelectedSizeNotIncludes()}
                  {loading &&
                    !renderedSizes.length &&
                    [...Array(RENDERED_SIZE_LENGHT)].map((_, idx) => (
                      <PillSkeleton
                        width={63}
                        key={`skeleton_location_${idx}`}
                      />
                    ))}
                  {!!renderedSizes.length &&
                    renderedSizes.map((sizeData, _) => (
                      <Pill
                        key={`option_${sizeData.size}}`}
                        handleOnClick={() => setSelectedSize(sizeData)}
                        isActive={isTwoObjectIdentical(selectedSize, sizeData)}
                      >
                        {`${sizeData.size} Kg`}
                      </Pill>
                    ))}
                </div>
              </div>
            </div>
          </BottomSheet>
        </div>
      </div>
      <div
        className={`bottom-sheet-wrapper ${
          !!viewMoreOptions.openModal && "active"
        }`}
      >
        <div
          className={`view-more-filter overlay ${
            !!viewMoreOptions.openModal && "active"
          }`}
          onClick={handleCloseViewMore}
        ></div>
        <div className="filter-page-container view-more">
          {!loading && viewMoreOptions.type && (
            <ViewMoreFilterOption
              title={viewMoreOptions.type === "location" ? "Lokasi" : "Berat"}
              listData={viewMoreOptions.type === "location" ? locations : sizes}
              formatListData={
                viewMoreOptions.type === "location"
                  ? (value) =>
                      value.province && value.city
                        ? `${toTitleCase(value.province)} - ${toTitleCase(
                            value.city
                          )}`
                        : null
                  : (value) => (value.size ? `${value.size} Kg` : null)
              }
              handleChangeData={(value) => handleViewMoreOptionChange(value)}
              isOpen={viewMoreOptions.openModal}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default FilterPage;
