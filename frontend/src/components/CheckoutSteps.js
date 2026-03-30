import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18/LanguageContext";

function CheckoutSteps({ step1, step2, step3, step4 }) {
  const { t } = useLanguage();

  const steps = [
    { label: t("checkout.signIn"), path: "/login", active: step1 },
    { label: t("checkout.shipping"), path: "/shipping", active: step2 },
    { label: t("checkout.payment"), path: "/payment", active: step3 },
    { label: t("checkout.placeOrder"), path: "/placeorder", active: step4 },
  ];

  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          {/* Step */}
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step.active
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-400"
              }`}
            >
              {index + 1}
            </div>
            {step.active ? (
              <Link
                to={step.path}
                className="text-sm font-medium text-zinc-900 hover:text-amber-600 transition-colors hidden sm:block"
              >
                {step.label}
              </Link>
            ) : (
              <span className="text-sm text-zinc-400 hidden sm:block">
                {step.label}
              </span>
            )}
          </div>

          {/* Connector */}
          {index < steps.length - 1 && (
            <div
              className={`w-8 sm:w-16 h-px mx-2 ${
                steps[index + 1].active ? "bg-zinc-900" : "bg-zinc-200"
              }`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default CheckoutSteps;