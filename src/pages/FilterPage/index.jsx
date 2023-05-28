import "./style.scss";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";

import BottomSheet from "../../common/BottomSheet";
import Pill, { PillSkeleton } from "../../common/Pill";
import { getProductArea, getProductSize } from "../../service";

import { toTitleCase } from "../../utils/string";
import { isTwoObjectIdentical } from "./SelectSize/helper";
import { constructSearchQuery } from "../KomoditasList/helper";

const RENDERED_LOCATION_LENGHT = 5;
const RENDERED_SIZE_LENGHT = 9;

function FilterPage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [sizes, setSizes] = useState([]);
  const [locations, setLocations] = useState([]);

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
    if (!querySearch.area_provinsi && !querySearch.area_kota) return null;
    const selectedLocation = {
      province: querySearch.area_provinsi,
      city: querySearch.area_kota,
    };
    const isSelectedLocationExistInList = locations.some(
      (item) => JSON.stringify(item) === JSON.stringify(selectedLocation)
    );
    return !isSelectedLocationExistInList ? (
      <Pill
        key={`option_${selectedLocation.province}_${selectedLocation.city}`}
        handleOnClick={() => setSelectedLocation(selectedLocation)}
        isActive={isTwoObjectIdentical(selectedLocation, selectedLocation)}
      >
        {`${toTitleCase(selectedLocation.province)} - ${toTitleCase(
          selectedLocation.city
        )}`}
      </Pill>
    ) : null;
  }, [querySearch.area_provinsi, querySearch.area_kota, locations]);

  useEffect(() => {
    setLoading(true);
    async function fetchFilterOptionData() {
      await Promise.all([await getProductArea(), await getProductSize()]).then(
        (response) => {
          const sizes = response[1].slice(0, RENDERED_SIZE_LENGHT);
          const locations = response[0].slice(0, RENDERED_LOCATION_LENGHT);
          setSizes(sizes);
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
      <div
        className={`filter-page-overlay ${isOpen && "active"}`}
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
                <span className="filter-more">Lihat Lainnya</span>
              </div>
              <div className="filter-pill-wrapper">
                {!loading && renderSelectedLocationNotIncludes()}
                {loading &&
                  !locations.length &&
                  [...Array(RENDERED_LOCATION_LENGHT)].map((_, idx) => (
                    <PillSkeleton
                      width={120}
                      key={`skeleton_location_${idx}`}
                    />
                  ))}
                {!!locations.length &&
                  locations.map((locationData, _) => (
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
                <span className="filter-more">Lihat Lainnya</span>
              </div>
              <div className="filter-pill-wrapper">
                {loading &&
                  !sizes.length &&
                  [...Array(RENDERED_SIZE_LENGHT)].map((_, idx) => (
                    <PillSkeleton width={63} key={`skeleton_location_${idx}`} />
                  ))}
                {!!sizes.length &&
                  sizes.map((sizeData, _) => (
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
        <Outlet />
      </div>
    </div>
  );
}

export default FilterPage;
