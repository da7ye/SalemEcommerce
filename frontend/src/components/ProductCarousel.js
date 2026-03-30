import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import Message from "./Message";
import { listTopProducts } from "../actions/productActions";
import { useLanguage } from "../i18/LanguageContext";
import { getImageUrl } from "../utils/imageUrl";
function ProductCarousel() {
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const { t } = useLanguage();

  const productTopRated = useSelector((state) => state.productTopRated);
  const { error, loading, products = [] } = productTopRated;

  useEffect(() => {
    dispatch(listTopProducts());
  }, [dispatch]);

  const next = useCallback(() => {
    if (products.length > 0) {
      setCurrent((prev) => (prev + 1) % products.length);
    }
  }, [products]);

  const prev = () => {
    if (products.length > 0) {
      setCurrent((prev) => (prev - 1 + products.length) % products.length);
    }
  };

  /* Auto-play */
  useEffect(() => {
    if (paused || !products || products.length === 0) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, products, next]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : !products || products.length === 0 ? null : (
    <div
      className="relative rounded-2xl overflow-hidden bg-zinc-900 mb-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div className="relative" style={{ height: "420px" }}>
        {products.map((product, index) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "block",
              opacity: index === current ? 1 : 0,
              transform: index === current ? "scale(1)" : "scale(1.05)",
              transition:
                "opacity 700ms ease-in-out, transform 700ms ease-in-out",
              pointerEvents: index === current ? "auto" : "none",
              textDecoration: "none",
            }}
          >
            {/* Image */}
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />

            {/* Gradient overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgb(24 24 27) 0%, rgb(24 24 27 / 0.3) 50%, transparent 100%)",
              }}
            />

            {/* Caption */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "24px 32px",
              }}
            >
              <p
                style={{
                  color: "#f59e0b",
                  fontSize: "12px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "8px",
                }}
              >
                {t("product.topRated")}
              </p>
              <h3
                style={{
                  color: "white",
                  fontSize: "24px",
                  fontWeight: 700,
                  lineHeight: 1.3,
                }}
              >
                {product.name}
              </h3>
              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "18px",
                  fontWeight: 600,
                  marginTop: "4px",
                }}
              >
                UM{product.price}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          prev();
        }}
        style={{
          position: "absolute",
          left: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.7)",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        <svg
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Right Arrow */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          next();
        }}
        style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.7)",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        <svg
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dots */}
      <div
        style={{
          position: "absolute",
          bottom: "12px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          zIndex: 10,
        }}
      >
        {products.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrent(index);
            }}
            style={{
              width: index === current ? "24px" : "8px",
              height: "8px",
              borderRadius: "9999px",
              background:
                index === current ? "#f59e0b" : "rgba(255,255,255,0.4)",
              border: "none",
              cursor: "pointer",
              transition: "all 300ms",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductCarousel;