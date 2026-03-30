import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import { listProducts } from "../actions/productActions";
import { useLanguage } from "../i18/LanguageContext";

function HomeScreen({ history }) {
  const dispatch = useDispatch();
  const { t } = useLanguage();

  const productList = useSelector((state) => state.productList);
  const { products, page, pages, loading, error } = productList;

  let keyword = history.location.search;

  useEffect(() => {
    dispatch(listProducts(keyword));
  }, [dispatch, keyword]);

  return (
    <div>
      {!keyword && <ProductCarousel />}

      {/* Section Header */}
      <div className="mb-8 mt-4">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          {keyword ? t("home.searchResults") : t("home.latestProducts")}
        </h1>
        <div className="mt-2 h-1 w-12 bg-amber-500 rounded-full"></div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-10">
            <Paginate page={page} pages={pages} keyword={keyword} />
          </div>
        </div>
      )}
    </div>
  );
}

export default HomeScreen;