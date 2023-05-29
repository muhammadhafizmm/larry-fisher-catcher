import "./style.scss";
import { useEffect, useMemo, useState } from "react";

import KomoditasCard, {
  KomoditasCardSkeleton,
} from "../../common/KomoditasCard";
import Search from "../../common/Search";

import { getProductList } from "../../service";
import { ReactComponent as PlusIcon } from "../../assets/svgs/plus.svg";

import { addHistoryDataToStorage } from "./helper";
import {
  Outlet,
  useSearchParams,
  useLocation,
  useNavigate,
} from "react-router-dom";

function KomoditasList() {
  const [param] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
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

  const [query, setQuery] = useState({
    limit: 10,
    offset: 0,
    ...(Object.keys(querySearch).length && { search: querySearch }),
  });

  const [producs, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isReachEnd, setIsReachEnd] = useState(false);

  function handleClickAdd() {
    navigate("/komoditas/add");
  }

  useEffect(() => {
    if (location.pathname === "/") {
      setLoading(true);
      setProducts([]);
      const tempQuerySearch = {
        ...(querySearch.komoditas && {
          komoditas: querySearch.komoditas.toUpperCase(),
        }),
        ...(querySearch.area_provinsi && {
          area_provinsi: querySearch.area_provinsi.toUpperCase(),
        }),
        ...(querySearch.area_kota && {
          area_kota: querySearch.area_kota.toUpperCase(),
        }),
        ...(querySearch.size && { size: querySearch.size }),
      };
      setQuery((prev) => ({
        ...prev,
        offset: 0,
        ...(Object.keys(tempQuerySearch).length
          ? { search: tempQuerySearch }
          : { search: undefined }),
      }));
      // register query search to history data to history data
      if (querySearch.komoditas) {
        addHistoryDataToStorage(querySearch.komoditas);
      }
      setIsReachEnd(false);
    }
  }, [querySearch]);

  useEffect(() => {
    setLoading(true);
    async function fetchListData() {
      try {
        const response = await getProductList(query);
        if (!response.length || response.length < query.limit) {
          setIsReachEnd(true);
        }
        if (!query.offset) {
          setProducts([...response]);
        } else {
          setProducts((prevProducts) => [...prevProducts, ...response]);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
    if (!isReachEnd) {
      fetchListData();
    }
  }, [query, isReachEnd]);

  useEffect(() => {
    function handleOnScroll() {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (
        scrollTop + clientHeight >= scrollHeight - 300 &&
        !isReachEnd &&
        !loading
      ) {
        setLoading(true);
        setQuery((prev) => {
          return {
            ...prev,
            offset: prev.offset + prev.limit,
          };
        });
      } else return;
    }
    window.addEventListener("scroll", handleOnScroll);
    return () => window.removeEventListener("scroll", handleOnScroll);
  }, [isReachEnd, loading]);

  return (
    <div className="komoditas-container">
      <Search />
      <div className="content">
        {loading &&
          !producs.length &&
          [...Array(5)].map((_, idx) => (
            <KomoditasCardSkeleton key={`skeleton_${idx}`} />
          ))}
        {producs &&
          producs.map((product) => (
            <KomoditasCard key={product.uuid} product={product} />
          ))}
        {!isReachEnd && <KomoditasCardSkeleton />}
      </div>
      <div className="add-komoditas-container">
        <div className="button-wrapper">
          <div className="button" onClick={handleClickAdd}>
            <span>Tambah Akomodasi</span>
            <PlusIcon />
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default KomoditasList;
