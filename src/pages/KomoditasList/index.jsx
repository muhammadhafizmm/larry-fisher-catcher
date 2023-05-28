import "./style.scss";
import { useEffect, useMemo, useState } from "react";

import KomoditasCard, {
  KomoditasCardSkeleton,
} from "../../common/KomoditasCard";
import Search from "../../common/Search";

import { getProductList } from "../../service";
import { ReactComponent as PlusIcon } from "../../assets/svgs/plus.svg";

import { addHistoryDataToStorage } from "./helper";
import { Outlet, useSearchParams, useLocation } from "react-router-dom";

function KomoditasList() {
  const [param] = useSearchParams();
  const location = useLocation();
  const querySearch = useMemo(() => param.get("q"), [param]);

  const [query, setQuery] = useState({
    limit: 10,
    offset: 0,
    search: querySearch ? { komoditas: querySearch.toUpperCase() } : undefined,
  });

  const [producs, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isReachEnd, setIsReachEnd] = useState(false);

  useEffect(() => {
    if (location.pathname === "/") {
      setLoading(true);
      setProducts([]);
      if (querySearch) {
        setQuery((prev) => ({
          ...prev,
          offset: 0,
          search: { komoditas: querySearch.toUpperCase() },
        }));
        // register query search to history data to history data
        addHistoryDataToStorage(querySearch);
        setIsReachEnd(false);
      } else {
        setQuery((prev) => ({
          ...prev,
          offset: 0,
          search: undefined,
        }));
        setIsReachEnd(false);
      }
    }
  }, [querySearch]);

  useEffect(() => {
    setLoading(true);
    async function fetchListData() {
      try {
        const response = await getProductList(query);
        if (!response.length) {
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
          <div className="button">
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
