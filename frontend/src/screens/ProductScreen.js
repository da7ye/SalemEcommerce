import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  listProductDetails,
  createProductReview,
} from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";
import { useLanguage } from "../i18/LanguageContext";
import { getImageUrl } from "../utils/imageUrl";

function ProductScreen({ match, history }) {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { t } = useLanguage();

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { product, loading, error } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    success: successProductReview,
    loading: loadingProductReview,
    error: errorProductReview,
  } = productReviewCreate;

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(match.params.id));
  }, [dispatch, match, successProductReview]);

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReview(match.params.id, { rating, comment }));
  };

  return (
    <div>
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors mb-6"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        {t("productScreen.backToProducts")}
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          {/* Product Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            {/* Image */}
            <div className="lg:col-span-5">
              <div className="aspect-square rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-4 space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight leading-tight">
                  {product.name}
                </h1>
              </div>

              <Rating
                value={product.rating}
                text={`${product.numReviews} ${t("product.reviews")}`}
                color="#f59e0b"
              />

              <p className="text-3xl font-bold text-zinc-900">
                <span className="text-lg font-normal text-zinc-500 me-0.5">
                  UM
                </span>
                {product.price}
              </p>

              <div className="pt-4 border-t border-zinc-100">
                <h3 className="text-sm font-semibold text-zinc-700 mb-2">
                  {t("productScreen.description")}
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Purchase Card */}
            <div className="lg:col-span-3">
              <div className="sticky top-6 bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">{t("productScreen.price")}</span>
                  <span className="font-bold text-zinc-900">
                    UM{product.price}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">{t("productScreen.status")}</span>
                  <span
                    className={`font-semibold ${
                      product.countInStock > 0
                        ? "text-emerald-600"
                        : "text-red-500"
                    }`}
                  >
                    {product.countInStock > 0
                      ? t("productScreen.inStock")
                      : t("productScreen.outOfStock")}
                  </span>
                </div>

                {product.countInStock > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">{t("productScreen.qty")}</span>
                    <select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="w-20 px-3 py-2 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-800 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  disabled={product.countInStock === 0}
                  type="button"
                  onClick={addToCartHandler}
                  className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-zinc-900/20"
                >
                  {product.countInStock === 0
                    ? t("productScreen.outOfStock")
                    : t("productScreen.addToCart")}
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12 max-w-2xl">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">
              {t("productScreen.customerReviews")}
            </h2>

            {product.reviews.length === 0 && (
              <Message variant="info">{t("productScreen.noReviews")}</Message>
            )}

            <div className="space-y-4 mb-8">
              {product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white border border-zinc-100 rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-zinc-800">
                      {review.name}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {review.createdAt.substring(0, 10)}
                    </span>
                  </div>
                  <Rating value={review.rating} color="#f59e0b" />
                  <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>

            {/* Write a Review */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-zinc-900 mb-4">
                {t("productScreen.writeReview")}
              </h3>

              {loadingProductReview && <Loader />}
              {successProductReview && (
                <Message variant="success">
                  {t("productScreen.reviewSubmitted")}
                </Message>
              )}
              {errorProductReview && (
                <Message variant="danger">{errorProductReview}</Message>
              )}

              {userInfo ? (
                <form onSubmit={submitHandler} className="space-y-4">
                  <div>
                    <label
                      htmlFor="rating"
                      className="block text-sm font-medium text-zinc-700 mb-1.5"
                    >
                      {t("productScreen.ratingLabel")}
                    </label>
                    <select
                      id="rating"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                    >
                      <option value="">{t("productScreen.ratingSelect")}</option>
                      <option value="1">{t("productScreen.ratingPoor")}</option>
                      <option value="2">{t("productScreen.ratingFair")}</option>
                      <option value="3">{t("productScreen.ratingGood")}</option>
                      <option value="4">{t("productScreen.ratingVeryGood")}</option>
                      <option value="5">{t("productScreen.ratingExcellent")}</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="comment"
                      className="block text-sm font-medium text-zinc-700 mb-1.5"
                    >
                      {t("productScreen.yourReview")}
                    </label>
                    <textarea
                      id="comment"
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={t("productScreen.reviewPlaceholder")}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white resize-none"
                    />
                  </div>

                  <button
                    disabled={loadingProductReview}
                    type="submit"
                    className="py-3 px-6 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98]"
                  >
                    {t("productScreen.submitReview")}
                  </button>
                </form>
              ) : (
                <Message variant="info">
                  {t("productScreen.pleaseSignIn")}{" "}
                  <Link
                    to="/login"
                    className="text-amber-600 font-semibold hover:underline"
                  >
                    {t("productScreen.signInToReview")}
                  </Link>{" "}
                  {t("productScreen.toWriteReview")}
                </Message>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductScreen;