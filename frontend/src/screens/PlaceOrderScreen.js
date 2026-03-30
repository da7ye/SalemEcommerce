import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
import { createOrder } from "../actions/orderActions";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";
import { useLanguage } from "../i18/LanguageContext";

function PlaceOrderScreen({ history }) {
  const dispatch = useDispatch();
  const { t } = useLanguage();

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, error, success } = orderCreate;

  const cart = useSelector((state) => state.cart);

  // Price calculations
  cart.itemsPrice = cart.cartItems
    .reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2);

  cart.shippingPrice = (cart.itemsPrice > 100 ? 0 : 10).toFixed(2);
  cart.taxPrice = Number(0.082 * cart.itemsPrice).toFixed(2);
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  if (!cart.paymentMethod) {
    history.push("/payment");
  }

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
    // eslint-disable-next-line
  }, [success, history]);

  const placeorder = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  return (
    <div>
      <div className="max-w-5xl mx-auto">
        <CheckoutSteps step1 step2 step3 step4 />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column — Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-zinc-900 mb-3">
                {t("placeOrderScreen.shipping")}
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </div>

            {/* Payment */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-zinc-900 mb-3">
                {t("placeOrderScreen.payment")}
              </h2>
              <p className="text-sm text-zinc-600">{cart.paymentMethod}</p>
            </div>

            {/* Order Items */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-zinc-900 mb-4">
                {t("placeOrderScreen.orderItems")}
              </h2>

              {cart.cartItems.length === 0 ? (
                <Message variant="info">{t("placeOrderScreen.emptyCart")}</Message>
              ) : (
                <div className="space-y-4">
                  {cart.cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 py-3 border-b border-zinc-50 last:border-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />

                      <Link
                        to={`/product/${item.product}`}
                        className="flex-1 text-sm font-medium text-zinc-800 hover:text-amber-700 transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>

                      <span className="text-sm text-zinc-600 whitespace-nowrap">
                        {item.qty} × UM{item.price} ={" "}
                        <span className="font-semibold text-zinc-900">
                          UM{(item.qty * item.price).toFixed(2)}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column — Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-zinc-900 mb-5">
                {t("placeOrderScreen.orderSummary")}
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>{t("placeOrderScreen.items")}</span>
                  <span className="font-medium text-zinc-900">
                    UM{cart.itemsPrice}
                  </span>
                </div>

                <div className="flex justify-between text-zinc-600">
                  <span>{t("placeOrderScreen.shippingCost")}</span>
                  <span className="font-medium text-zinc-900">
                    UM{cart.shippingPrice}
                  </span>
                </div>

                <div className="flex justify-between text-zinc-600">
                  <span>{t("placeOrderScreen.tax")}</span>
                  <span className="font-medium text-zinc-900">
                    UM{cart.taxPrice}
                  </span>
                </div>

                <div className="pt-3 mt-3 border-t border-zinc-100 flex justify-between text-base font-bold text-zinc-900">
                  <span>{t("placeOrderScreen.total")}</span>
                  <span>UM{cart.totalPrice}</span>
                </div>
              </div>

              {error && (
                <div className="mt-4">
                  <Message variant="danger">{error}</Message>
                </div>
              )}

              <button
                type="button"
                disabled={cart.cartItems.length === 0}
                onClick={placeorder}
                className="w-full mt-6 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-zinc-900/20"
              >
                {t("placeOrderScreen.placeOrderButton")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrderScreen;