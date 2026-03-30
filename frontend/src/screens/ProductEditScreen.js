import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listProductDetails, updateProduct } from "../actions/productActions";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";
import { useLanguage } from "../i18/LanguageContext";

function ProductEditScreen({ match, history }) {
  const productId = match.params.id;
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { product, loading, error } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    success: successUpdate,
    loading: loadingUpdate,
    error: errorUpdate,
  } = productUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      history.push("/admin/productlist");
    } else {
      if (!product.name || product._id !== Number(productId)) {
        dispatch(listProductDetails(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
  }, [dispatch, product, productId, history, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      })
    );
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();

    formData.append("image", file);
    formData.append("product_id", productId);

    setUploading(true);

    try {
      const config = {
        header: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post(
        "/api/products/upload/",
        formData,
        config
      );

      setImage(data);
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center px-4">
      <div className="w-full max-w-2xl">
        {/* Back Link */}
        <Link
          to="/admin/productlist"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t("productEdit.backToProducts")}
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            {t("productEdit.title")}
          </h1>
          <p className="mt-2 text-zinc-500">
            {t("productEdit.subtitle")}
          </p>
        </div>

        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <form onSubmit={submitHandler} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-zinc-700 mb-1.5"
                >
                  {t("productEdit.nameLabel")}
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder={t("productEdit.namePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-zinc-700 mb-1.5"
                >
                  {t("productEdit.priceLabel")}
                </label>
                <input
                  id="price"
                  type="number"
                  placeholder={t("productEdit.pricePlaceholder")}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-zinc-700 mb-1.5"
              >
                {t("productEdit.imageLabel")}
              </label>
              <input
                id="image"
                type="text"
                placeholder={t("productEdit.imagePlaceholder")}
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
              />

              <label className="mt-3 flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-zinc-200 rounded-xl cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all duration-200">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <span>{t("productEdit.uploadImage")}</span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={uploadFileHandler}
                />
              </label>

              {uploading && <Loader />}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium text-zinc-700 mb-1.5"
                >
                  {t("productEdit.brandLabel")}
                </label>
                <input
                  id="brand"
                  type="text"
                  placeholder={t("productEdit.brandPlaceholder")}
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="countinstock"
                  className="block text-sm font-medium text-zinc-700 mb-1.5"
                >
                  {t("productEdit.stockLabel")}
                </label>
                <input
                  id="countinstock"
                  type="number"
                  placeholder={t("productEdit.stockPlaceholder")}
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-zinc-700 mb-1.5"
              >
                {t("productEdit.categoryLabel")}
              </label>
              <input
                id="category"
                type="text"
                placeholder={t("productEdit.categoryPlaceholder")}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-zinc-700 mb-1.5"
              >
                {t("productEdit.descriptionLabel")}
              </label>
              <textarea
                id="description"
                rows="4"
                placeholder={t("productEdit.descriptionPlaceholder")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-zinc-900/20"
            >
              {t("productEdit.updateButton")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProductEditScreen;