import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";
import SearchBox from "./SearchBox";
import { useLanguage } from "../i18/LanguageContext";

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [adminDropdown, setAdminDropdown] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);

  const userRef = useRef();
  const adminRef = useRef();
  const langRef = useRef();

  const { t, language, setLanguage, isRTL } = useLanguage();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
    setUserDropdown(false);
    setMobileOpen(false);
  };

  /* Close dropdowns on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserDropdown(false);
      }
      if (adminRef.current && !adminRef.current.contains(e.target)) {
        setAdminDropdown(false);
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLink =
    "text-sm font-medium text-zinc-400 hover:text-white transition-colors";

  const languages = [
    { code: "en", label: "EN", flag: "🇬🇧" },
    { code: "fr", label: "FR", flag: "🇫🇷" },
    { code: "ar", label: "AR", flag: "🇲🇷" },
  ];

  const currentLang = languages.find((l) => l.code === language);

  return (
    <header className="bg-zinc-900 sticky top-0 z-50 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <img
              src="/images/logo-sal.png"
              alt={t("header.brand")}
              className="w-11  rounded-lg h-11 object-contain drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]"
            />
            <span className="text-white font-bold text-lg tracking-tight hidden sm:block">
              {t("header.brand")}
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBox />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => {
                  setLangDropdown(!langDropdown);
                  setUserDropdown(false);
                  setAdminDropdown(false);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
              >
                <span className="text-base">{currentLang?.flag}</span>
                <span className="text-sm font-medium">{currentLang?.label}</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform ${
                    langDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {langDropdown && (
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-40 bg-white rounded-xl shadow-xl border border-zinc-100 py-1 z-50`}>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                        language === lang.code
                          ? "bg-amber-50 text-amber-700 font-semibold"
                          : "text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{t(`language.${lang.code}`)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
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
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              <span className="text-sm font-medium">{t("header.cart")}</span>
            </Link>

            {/* User Menu */}
            {userInfo ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => {
                    setUserDropdown(!userDropdown);
                    setAdminDropdown(false);
                    setLangDropdown(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <span className="text-amber-400 text-xs font-bold">
                      {userInfo.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{userInfo.name}</span>
                  <svg
                    className={`w-3.5 h-3.5 transition-transform ${
                      userDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {userDropdown && (
                  <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 bg-white rounded-xl shadow-xl border border-zinc-100 py-1 z-50`}>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdown(false)}
                      className="block px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                      {t("header.profile")}
                    </Link>
                    <button
                      onClick={logoutHandler}
                      className="w-full text-left px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                      {t("header.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
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
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                <span className="text-sm font-medium">{t("header.login")}</span>
              </Link>
            )}

            {/* Admin Menu */}
            {userInfo && userInfo.isAdmin && (
              <div className="relative" ref={adminRef}>
                <button
                  onClick={() => {
                    setAdminDropdown(!adminDropdown);
                    setUserDropdown(false);
                    setLangDropdown(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                >
                  <span className="text-sm font-medium">{t("header.admin")}</span>
                  <svg
                    className={`w-3.5 h-3.5 transition-transform ${
                      adminDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {adminDropdown && (
                  <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 bg-white rounded-xl shadow-xl border border-zinc-100 py-1 z-50`}>
                    <Link
                      to="/admin/userlist"
                      onClick={() => setAdminDropdown(false)}
                      className="block px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                      {t("header.users")}
                    </Link>
                    <Link
                      to="/admin/productlist"
                      onClick={() => setAdminDropdown(false)}
                      className="block px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                      {t("header.products")}
                    </Link>
                    <Link
                      to="/admin/orderlist"
                      onClick={() => setAdminDropdown(false)}
                      className="block px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                      {t("header.orders")}
                    </Link>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-zinc-800 py-4 space-y-1">
            {/* Mobile Search */}
            <div className="pb-3 mb-3 border-b border-zinc-800">
              <SearchBox />
            </div>

            {/* Mobile Language Switcher */}
            <div className="pb-3 mb-3 border-b border-zinc-800">
              <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                {t("language.label")}
              </p>
              <div className="flex gap-2 px-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      language === lang.code
                        ? "bg-amber-500 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2.5 rounded-lg ${navLink}`}
            >
              {t("header.cart")}
            </Link>

            {userInfo ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg ${navLink}`}
                >
                  {t("header.profile")}
                </Link>
                <button
                  onClick={logoutHandler}
                  className={`block w-full text-left px-3 py-2.5 rounded-lg ${navLink}`}
                >
                  {t("header.logout")}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-lg ${navLink}`}
              >
                {t("header.login")}
              </Link>
            )}

            {userInfo && userInfo.isAdmin && (
              <div className="pt-3 mt-3 border-t border-zinc-800">
                <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                  {t("header.admin")}
                </p>
                <Link
                  to="/admin/userlist"
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg ${navLink}`}
                >
                  {t("header.users")}
                </Link>
                <Link
                  to="/admin/productlist"
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg ${navLink}`}
                >
                  {t("header.products")}
                </Link>
                <Link
                  to="/admin/orderlist"
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg ${navLink}`}
                >
                  {t("header.orders")}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;