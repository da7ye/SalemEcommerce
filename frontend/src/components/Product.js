import React from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { useLanguage } from "../i18/LanguageContext";
import { getImageUrl } from "../utils/imageUrl";
function Product({ product }) {
  const { t } = useLanguage();

  return (
    <Link
      to={`/product/${product._id}`}
      className="group block bg-white rounded-2xl border border-zinc-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-zinc-200/50 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-zinc-50">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="text-sm font-semibold text-zinc-800 line-clamp-2 leading-snug group-hover:text-amber-700 transition-colors">
          {product.name}
        </h3>

        <Rating
          value={product.rating}
          text={`${product.numReviews} ${t("product.reviews")}`}
          color="#f59e0b"
        />

        <p className="text-lg font-bold text-zinc-900">
          <span className="text-sm font-normal text-zinc-500 me-0.5">UM</span>
          {product.price}
        </p>
      </div>
    </Link>
  );
}

export default Product;