import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { listMyOrders } from "../actions/orderActions";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";
import { useLanguage } from "../i18/LanguageContext";

function ProfileScreen({ history }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const { t } = useLanguage();

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { user, loading, error } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfle = useSelector((state) => state.userUpdateProfle);
  const { success } = userUpdateProfle;

  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      if (!user || !user.name || success || userInfo._id !== user._id) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails("profile"));
        dispatch(listMyOrders());
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [dispatch, history, userInfo, user, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage(t("register.passwordsMismatch"));
    } else {
      dispatch(
        updateUserProfile({
          id: user._id,
          name: name,
          email: email,
          password: password,
        })
      );
      setMessage("");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Profile Form */}
      <div className="lg:col-span-4 xl:col-span-3">
        <div className="sticky top-6">
          <h2 className="text-xl font-bold text-zinc-900 mb-6">
            {t("profile.title")}
          </h2>

          {message && <Message variant="danger">{message}</Message>}
          {error && <Message variant="danger">{error}</Message>}
          {success && (
            <Message variant="success">{t("profile.profileUpdated")}</Message>
          )}
          {loading && <Loader />}

          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-zinc-700 mb-1.5"
              >
                {t("profile.nameLabel")}
              </label>
              <input
                id="name"
                type="text"
                required
                placeholder={t("profile.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 mb-1.5"
              >
                {t("profile.emailLabel")}
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder={t("profile.emailPlaceholder")}
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
                {t("profile.newPasswordLabel")}
              </label>
              <input
                id="password"
                type="password"
                placeholder={t("profile.newPasswordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="passwordConfirm"
                className="block text-sm font-medium text-zinc-700 mb-1.5"
              >
                {t("profile.confirmPasswordLabel")}
              </label>
              <input
                id="passwordConfirm"
                type="password"
                placeholder={t("profile.confirmPasswordPlaceholder")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-zinc-900/20"
            >
              {t("profile.updateButton")}
            </button>
          </form>
        </div>
      </div>

      {/* Orders Table */}
      <div className="lg:col-span-8 xl:col-span-9">
        <h2 className="text-xl font-bold text-zinc-900 mb-6">
          {t("profile.myOrders")}
        </h2>

        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant="danger">{errorOrders}</Message>
        ) : orders.length === 0 ? (
          <Message variant="info">{t("profile.noOrders")}</Message>
        ) : (
          <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-zinc-50 border-b border-zinc-100 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <div className="col-span-2">{t("profile.id")}</div>
              <div className="col-span-3">{t("profile.date")}</div>
              <div className="col-span-2">{t("profile.total")}</div>
              <div className="col-span-2">{t("profile.paid")}</div>
              <div className="col-span-2">{t("profile.delivered")}</div>
              <div className="col-span-1"></div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-zinc-50">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 items-center hover:bg-zinc-50/50 transition-colors"
                >
                  <div className="md:col-span-2 text-sm font-mono text-zinc-600 truncate">
                    <span className="md:hidden text-xs font-sans text-zinc-400 me-2">
                      {t("profile.id")}:
                    </span>
                    {order._id}
                  </div>

                  <div className="md:col-span-3 text-sm text-zinc-600">
                    <span className="md:hidden text-xs text-zinc-400 me-2">
                      {t("profile.date")}:
                    </span>
                    {order.createdAt
                      ? order.createdAt.substring(0, 10)
                      : "—"}
                  </div>

                  <div className="md:col-span-2 text-sm font-semibold text-zinc-900">
                    <span className="md:hidden text-xs font-normal text-zinc-400 me-2">
                      {t("profile.total")}:
                    </span>
                    UM{order.totalPrice}
                  </div>

                  <div className="md:col-span-2">
                    <span className="md:hidden text-xs text-zinc-400 me-2">
                      {t("profile.paid")}:
                    </span>
                    {order.isPaid ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {order.paidAt
                          ? order.paidAt.substring(0, 10)
                          : "Yes"}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200">
                        {t("profile.unpaid")}
                      </span>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <span className="md:hidden text-xs text-zinc-400 me-2">
                      {t("profile.delivered")}:
                    </span>
                    {order.isDeliver ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {t("profile.delivered")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        {t("profile.pending")}
                      </span>
                    )}
                  </div>

                  <div className="md:col-span-1 flex justify-end">
                    <Link
                      to={`/order/${order._id}`}
                      className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                    >
                      {t("profile.view")}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileScreen;