import "./style.scss";
import { useCallback, useEffect, useState } from "react";

import KomoditasCard, {
  KomoditasCardSkeleton,
} from "../../common/KomoditasCard";
import Search from "../../common/Search";

import { ReactComponent as PlusIcon } from "../../assets/svgs/plus.svg";
import { getProductList } from "../../service";

function KomoditasList() {
  const [producs, setProducts] = useState([]);
  const [query, setQuery] = useState({
    limit: 10,
    offset: 0,
  });
  const [isReachEnd, setIsReachEnd] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    async function fetchListData() {
      try {
        const response = await getProductList(query);
        if (!response.length) {
          setIsReachEnd(true);
        }
        setProducts((prevProducts) => [...prevProducts, ...response]);
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
    </div>
  );
}

export default KomoditasList;
