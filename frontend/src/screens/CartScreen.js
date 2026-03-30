import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../actions/cartActions";
import { useLanguage } from "../i18/LanguageContext";

function CartScreen({ match, location, history }) {
  const productId = match.params.id;
  const qty = location.search ? Number(location.search.split("=")[1]) : 1;
  const { t } = useLanguage();

  const dispatch = useDispatch();

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    history.push("/checkout");
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          {t("cart.title")}
        </h1>
        <div className="mt-2 h-1 w-12 bg-amber-500 rounded-full"></div>
      </div>

      {cartItems.length === 0 ? (
        <Message variant="info">
          {t("cart.empty")}{" "}
          <Link to="/" className="text-amber-600 font-semibold hover:underline">
            {t("cart.continueShopping")}
          </Link>
        </Message>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.product}
                className="flex items-center gap-4 p-4 bg-white border border-zinc-100 rounded-2xl transition-all hover:shadow-md"
              >
                <Link to={`/product/${item.product}`} className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.product}`}
                    className="text-sm font-semibold text-zinc-800 hover:text-amber-700 transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-base font-bold text-zinc-900">
                    UM{item.price}
                  </p>
                </div>

                <div className="shrink-0">
                  <select
                    value={item.qty}
                    onChange={(e) =>
                      dispatch(addToCart(item.product, Number(e.target.value)))
                    }
                    className="w-16 px-2 py-2 text-sm border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-800 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => removeFromCartHandler(item.product)}
                  className="shrink-0 p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title={t("cart.removeItem")}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-zinc-900 mb-4">
                {t("cart.orderSummary")}
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-zinc-600">
                  <span>
                    {t("cart.items")} (
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  </span>
                  <span className="font-medium text-zinc-900">
                    UM
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100">
                <div className="flex justify-between text-base font-bold text-zinc-900 mb-6">
                  <span>{t("cart.subtotal")}</span>
                  <span>
                    UM
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                  className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-zinc-900/20"
                >
                  {t("cart.proceedToCheckout")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartScreen;