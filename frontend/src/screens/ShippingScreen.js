import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../actions/cartActions";
import { useLanguage } from "../i18/LanguageContext";

function ShippingScreen({ history }) {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const { t } = useLanguage();

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    history.push("./payment");
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center px-4">
      <div className="w-full max-w-lg">
        <CheckoutSteps step1 step2 />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            {t("shippingScreen.title")}
          </h1>
          <p className="mt-2 text-zinc-500">
            {t("shippingScreen.subtitle")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-zinc-700 mb-1.5"
            >
              {t("shippingScreen.addressLabel")}
            </label>
            <input
              id="address"
              type="text"
              required
              placeholder={t("shippingScreen.addressPlaceholder")}
              value={address ? address : ""}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-zinc-700 mb-1.5"
            >
              {t("shippingScreen.cityLabel")}
            </label>
            <input
              id="city"
              type="text"
              required
              placeholder={t("shippingScreen.cityPlaceholder")}
              value={city ? city : ""}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="postalCode"
              className="block text-sm font-medium text-zinc-700 mb-1.5"
            >
              {t("shippingScreen.postalCodeLabel")}
            </label>
            <input
              id="postalCode"
              type="text"
              required
              placeholder={t("shippingScreen.postalCodePlaceholder")}
              value={postalCode ? postalCode : ""}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-zinc-700 mb-1.5"
            >
              {t("shippingScreen.countryLabel")}
            </label>
            <input
              id="country"
              type="text"
              required
              placeholder={t("shippingScreen.countryPlaceholder")}
              value={country ? country : ""}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-zinc-900/20"
          >
            {t("shippingScreen.continueButton")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ShippingScreen;