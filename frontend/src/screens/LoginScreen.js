import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/userActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useLanguage } from "../i18/LanguageContext";

function LoginScreen({ location, history }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useLanguage();

  const dispatch = useDispatch();

  const redirect = location.search ? location.search.split("=")[1] : "/";

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo, loading, error } = userLogin;

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
            {t("login.welcomeBack")}
          </h1>
          <p className="mt-2 text-zinc-500">
            {t("login.signInSubtitle")}
          </p>
        </div>

        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-700 mb-1.5"
            >
              {t("login.emailLabel")}
            </label>
            <input
              id="email"
              type="email"
              placeholder={t("login.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-700 mb-1.5"
            >
              {t("login.passwordLabel")}
            </label>
            <input
              id="password"
              type="password"
              placeholder={t("login.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-zinc-900/20"
          >
            {t("login.signInButton")}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-zinc-500">
          {t("login.newHere")}{" "}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : "/register"}
            className="text-amber-600 hover:text-amber-700 font-semibold transition-colors"
          >
            {t("login.createAccount")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginScreen;