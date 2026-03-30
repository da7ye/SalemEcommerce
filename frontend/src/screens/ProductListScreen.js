import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import {
  listProducts,
  deleteProduct,
  createProduct,
} from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
import { useLanguage } from "../i18/LanguageContext";

function ProductListScreen({ match, history }) {
  const dispatch = useDispatch();
  const { t } = useLanguage();

  const productList = useSelector((state) => state.productList);
  const { products, pages, page, loading, error } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    success: successDelete,
    loading: loadingDelete,
    error: errorDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    product: createdProduct,
    success: successCreate,
    loading: loadingCreate,
    error: errorCreate,
  } = productCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  let keyword = history.location.search;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (!userInfo.isAdmin) {
      history.push("/login");
    }

    if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts(keyword));
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    keyword,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm(t("productList.confirmDelete"))) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            {t("productList.title")}
          </h1>
          <div className="mt-2 h-1 w-12 bg-amber-500 rounded-full"></div>
        </div>

        <button
          onClick={createProductHandler}
          className="inline-flex items-center gap-2 py-2.5 px-5 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-zinc-900/20"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {t("productList.createProduct")}
        </button>
      </div>

      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-zinc-50 border-b border-zinc-100 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <div className="col-span-1">{t("productList.id")}</div>
              <div className="col-span-3">{t("productList.name")}</div>
              <div className="col-span-2">{t("productList.price")}</div>
              <div className="col-span-2">{t("productList.category")}</div>
              <div className="col-span-2">{t("productList.brand")}</div>
              <div className="col-span-2 text-end">{t("productList.actions")}</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-zinc-50">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 items-center hover:bg-zinc-50/50 transition-colors"
                >
                  <div className="md:col-span-1 text-sm font-mono text-zinc-500 truncate">
                    <span className="md:hidden text-xs font-sans text-zinc-400 me-2">
                      {t("productList.id")}:
                    </span>
                    {product._id}
                  </div>

                  <div className="md:col-span-3 text-sm font-medium text-zinc-800 truncate">
                    <span className="md:hidden text-xs font-normal text-zinc-400 me-2">
                      {t("productList.name")}:
                    </span>
                    {product.name}
                  </div>

                  <div className="md:col-span-2 text-sm font-semibold text-zinc-900">
                    <span className="md:hidden text-xs font-normal text-zinc-400 me-2">
                      {t("productList.price")}:
                    </span>
                    UM{product.price}
                  </div>

                  <div className="md:col-span-2 text-sm text-zinc-600">
                    <span className="md:hidden text-xs text-zinc-400 me-2">
                      {t("productList.category")}:
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600">
                      {product.category}
                    </span>
                  </div>

                  <div className="md:col-span-2 text-sm text-zinc-600">
                    <span className="md:hidden text-xs text-zinc-400 me-2">
                      {t("productList.brand")}:
                    </span>
                    {product.brand}
                  </div>

                  <div className="md:col-span-2 flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/product/${product._id}/edit`}
                      className="p-2 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                      title={t("productList.editProduct")}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </Link>

                    <button
                      onClick={() => deleteHandler(product._id)}
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title={t("productList.deleteProduct")}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Paginate pages={pages} page={page} isAdmin={true} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductListScreen;