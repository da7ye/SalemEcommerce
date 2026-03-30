import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18/LanguageContext";

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-20 bg-zinc-900 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/static/images/logo-sal.png"
                alt={t("footer.brand")}
                className="w-12 h-12  rounded-lg object-contain drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]"
              />
              <span className="text-white font-bold text-lg tracking-tight">
                {t("footer.brand")}
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
              {t("footer.brandDescription")}
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
              {t("footer.shop")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-zinc-400 hover:text-amber-400 transition-colors"
                >
                  {t("footer.allProducts")}
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-sm text-zinc-400 hover:text-amber-400 transition-colors"
                >
                  {t("footer.cart")}
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-sm text-zinc-400 hover:text-amber-400 transition-colors"
                >
                  {t("footer.myOrders")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
              {t("footer.account")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/login"
                  className="text-sm text-zinc-400 hover:text-amber-400 transition-colors"
                >
                  {t("footer.signIn")}
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-sm text-zinc-400 hover:text-amber-400 transition-colors"
                >
                  {t("footer.createAccount")}
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-sm text-zinc-400 hover:text-amber-400 transition-colors"
                >
                  {t("footer.profile")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
              {t("footer.stayUpdated")}
            </h4>
            <p className="text-sm text-zinc-400 mb-4">
              {t("footer.newsletterText")}
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex"
            >
              <input
                type="email"
                placeholder={t("footer.emailPlaceholder")}
                className="flex-1 min-w-0 px-3.5 py-2.5 rounded-s-xl bg-zinc-800 border border-zinc-700 border-e-0 text-sm text-white placeholder-zinc-500 outline-none focus:border-amber-500 transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-e-xl bg-amber-500 hover:bg-amber-400 text-zinc-900 text-sm font-semibold transition-colors shrink-0"
              >
                {t("footer.join")}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} {t("footer.brand")}. {t("footer.rights")}
          </p>

          <div className="flex items-center gap-5">
            <span className="text-xs text-zinc-600 hover:text-zinc-400 cursor-pointer transition-colors">
              {t("footer.privacy")}
            </span>
            <span className="text-xs text-zinc-600 hover:text-zinc-400 cursor-pointer transition-colors">
              {t("footer.terms")}
            </span>
            <span className="text-xs text-zinc-600 hover:text-zinc-400 cursor-pointer transition-colors">
              {t("footer.support")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;