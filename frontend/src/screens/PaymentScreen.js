import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../actions/cartActions";
import { useLanguage } from "../LanguageContext";

function PaymentScreen({ history }) {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const { t } = useLanguage();

  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  if (!shippingAddress.address) {
    history.push("./shipping");
  }

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push("/placeorder");
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center px-4">
      <div className="w-full max-w-lg">
        <CheckoutSteps step1 step2 step3 />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            {t("paymentScreen.title")}
          </h1>
          <p className="mt-2 text-zinc-500">
            {t("paymentScreen.subtitle")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler}>
          <div className="space-y-3 mb-8">
            {/* PayPal Option */}
            <label
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                paymentMethod === "PayPal"
                  ? "border-amber-500 bg-amber-50/50"
                  : "border-zinc-200 hover:border-zinc-300 bg-white"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="PayPal"
                checked={paymentMethod === "PayPal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-amber-500 border-zinc-300 focus:ring-amber-500"
              />
              <div className="flex-1">
                <span className="text-sm font-semibold text-zinc-800">
                  {t("paymentScreen.paypal")}
                </span>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {t("paymentScreen.paypalDesc")}
                </p>
              </div>
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-zinc-900/20"
          >
            {t("paymentScreen.continueButton")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PaymentScreen;