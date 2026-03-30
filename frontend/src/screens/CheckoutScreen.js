import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import { saveShippingAddress } from "../actions/cartActions";
import { createOrder } from "../actions/orderActions";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";
import { useLanguage } from "../i18/LanguageContext";

function CheckoutScreen({ history }) {
  const dispatch = useDispatch();
  const { t } = useLanguage();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, cartItems } = cart;

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, error, success } = orderCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Shipping fields
  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");

  // Guest contact fields (shown only if not logged in)
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  // Price calculations
  const itemsPrice = cartItems
    .reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2);
  const shippingPrice = (Number(itemsPrice) > 100 ? 0 : 10).toFixed(2);
  const taxPrice = Number(0.082 * itemsPrice).toFixed(2);
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
    // eslint-disable-next-line
  }, [success, history]);

  const placeOrderHandler = (e) => {
    e.preventDefault();

    // Save shipping address
    dispatch(saveShippingAddress({ address, city, postalCode, country }));

    // Create order
    dispatch(
      createOrder({
        orderItems: cartItems,
        shippingAddress: {
          address,
          city,
          postalCode,
          country,
          guestName: userInfo ? userInfo.name : guestName,
          guestEmail: userInfo ? userInfo.email : guestEmail,
          guestPhone,
        },
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    );
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-5xl mx-auto">
        <Message variant="info">
          {t("checkoutScreen.emptyCart")}{" "}
          <Link to="/" className="text-amber-600 font-semibold hover:underline">
            {t("checkoutScreen.continueShopping")}
          </Link>
        </Message>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          {t("checkoutScreen.title")}
        </h1>
        <div className="mt-2 h-1 w-12 bg-amber-500 rounded-full"></div>
      </div>

      <form onSubmit={placeOrderHandler}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info (guest only) */}
            {!userInfo && (
              <div className="bg-white border border-zinc-100 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-zinc-900 mb-4">
                  {t("checkoutScreen.contactInfo")}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="guestName"
                      className="block text-sm font-medium text-zinc-700 mb-1.5"
                    >
                      {t("checkoutScreen.fullNameLabel")}
                    </label>
                    <input
                      id="guestName"
                      type="text"
                      required
                      placeholder={t("checkoutScreen.fullNamePlaceholder")}
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="guestEmail"
                        className="block text-sm font-medium text-zinc-700 mb-1.5"
                      >
                        {t("checkoutScreen.emailLabel")}
                      </label>
                      <input
                        id="guestEmail"
                        type="email"
                        required
                        placeholder={t("checkoutScreen.emailPlaceholder")}
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="guestPhone"
                        className="block text-sm font-medium text-zinc-700 mb-1.5"
                      >
                        {t("checkoutScreen.phoneLabel")}
                      </label>
                      <input
                        id="guestPhone"
                        type="tel"
                        required
                        placeholder={t("checkoutScreen.phonePlaceholder")}
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Logged-in user info */}
            {userInfo && (
              <div className="bg-white border border-zinc-100 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-zinc-900 mb-3">
                  {t("checkoutScreen.contactInfo")}
                </h2>
                <p className="text-sm text-zinc-600">
                  {t("checkoutScreen.orderingAs")}{" "}
                  <span className="font-semibold text-zinc-800">
                    {userInfo.name}
                  </span>{" "}
                  ({userInfo.email})
                </p>
              </div>
            )}

            {/* Shipping Address */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-zinc-900 mb-4">
                {t("checkoutScreen.shippingAddress")}
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-zinc-700 mb-1.5"
                  >
                    {t("checkoutScreen.addressLabel")}
                  </label>
                  <input
                    id="address"
                    type="text"
                    required
                    placeholder={t("checkoutScreen.addressPlaceholder")}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-zinc-700 mb-1.5"
                    >
                      {t("checkoutScreen.cityLabel")}
                    </label>
                    <input
                      id="city"
                      type="text"
                      required
                      placeholder={t("checkoutScreen.cityPlaceholder")}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-medium text-zinc-700 mb-1.5"
                    >
                      {t("checkoutScreen.postalCodeLabel")}
                    </label>
                    <input
                      id="postalCode"
                      type="text"
                      required
                      placeholder={t("checkoutScreen.postalCodePlaceholder")}
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-zinc-700 mb-1.5"
                  >
                    {t("checkoutScreen.countryLabel")}
                  </label>
                  <input
                    id="country"
                    type="text"
                    required
                    placeholder={t("checkoutScreen.countryPlaceholder")}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-zinc-900 mb-4">
                {t("checkoutScreen.orderItems")}
              </h2>
              <div className="space-y-4">
                {cartItems.map((item, index) => (
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
            </div>
          </div>

          {/* Right Column — Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-zinc-900 mb-5">
                {t("checkoutScreen.orderSummary")}
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>{t("checkoutScreen.items")}</span>
                  <span className="font-medium text-zinc-900">UM{itemsPrice}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>{t("checkoutScreen.shipping")}</span>
                  <span className="font-medium text-zinc-900">UM{shippingPrice}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>{t("checkoutScreen.tax")}</span>
                  <span className="font-medium text-zinc-900">UM{taxPrice}</span>
                </div>
                <div className="pt-3 mt-3 border-t border-zinc-100 flex justify-between text-base font-bold text-zinc-900">
                  <span>{t("checkoutScreen.total")}</span>
                  <span>UM{totalPrice}</span>
                </div>
              </div>

              {error && (
                <div className="mt-4">
                  <Message variant="danger">{error}</Message>
                </div>
              )}

              <button
                type="submit"
                disabled={cartItems.length === 0}
                className="w-full mt-6 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-zinc-900/20"
              >
                {t("checkoutScreen.placeOrderButton")}
              </button>

              <p className="mt-3 text-xs text-zinc-400 text-center">
                {t("checkoutScreen.whatsappNote")}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CheckoutScreen;