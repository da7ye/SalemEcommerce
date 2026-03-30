import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listOrders } from "../actions/orderActions";
import { useLanguage } from "../i18/LanguageContext";

function OrderListScreen({ history }) {
  const dispatch = useDispatch();
  const { t } = useLanguage();

  const orderList = useSelector((state) => state.orderList);
  const { orders, loading, error } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, userInfo]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          {t("orderList.title")}
        </h1>
        <div className="mt-2 h-1 w-12 bg-amber-500 rounded-full"></div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-zinc-50 border-b border-zinc-100 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            <div className="col-span-1">{t("orderList.id")}</div>
            <div className="col-span-2">{t("orderList.user")}</div>
            <div className="col-span-2">{t("orderList.date")}</div>
            <div className="col-span-2">{t("orderList.total")}</div>
            <div className="col-span-2">{t("orderList.paid")}</div>
            <div className="col-span-2">{t("orderList.delivered")}</div>
            <div className="col-span-1"></div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-zinc-50">
            {orders.map((order) => (
              <div
                key={order._id}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 items-center hover:bg-zinc-50/50 transition-colors"
              >
                <div className="md:col-span-1 text-sm font-mono text-zinc-500 truncate">
                  <span className="md:hidden text-xs font-sans text-zinc-400 me-2">
                    {t("orderList.id")}:
                  </span>
                  {order._id}
                </div>

                <div className="md:col-span-2 text-sm font-medium text-zinc-800 truncate">
                  <span className="md:hidden text-xs font-normal text-zinc-400 me-2">
                    {t("orderList.user")}:
                  </span>
                  {order.User && order.User.name}
                </div>

                <div className="md:col-span-2 text-sm text-zinc-600">
                  <span className="md:hidden text-xs text-zinc-400 me-2">
                    {t("orderList.date")}:
                  </span>
                  {order.createdAt && order.createdAt.substring(0, 10)}
                </div>

                <div className="md:col-span-2 text-sm font-semibold text-zinc-900">
                  <span className="md:hidden text-xs font-normal text-zinc-400 me-2">
                    {t("orderList.total")}:
                  </span>
                  UM{order.totalPrice}
                </div>

                <div className="md:col-span-2">
                  <span className="md:hidden text-xs text-zinc-400 me-2">
                    {t("orderList.paid")}:
                  </span>
                  {order.isPaid ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {order.paidAt.substring(0, 10)}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200">
                      {t("orderList.unpaid")}
                    </span>
                  )}
                </div>

                <div className="md:col-span-2">
                  <span className="md:hidden text-xs text-zinc-400 me-2">
                    {t("orderList.delivered")}:
                  </span>
                  {order.isDeliver ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {order.deliveredAt.substring(0, 10)}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      {t("orderList.pending")}
                    </span>
                  )}
                </div>

                <div className="md:col-span-1 flex justify-end">
                  <Link
                    to={`/order/${order._id}`}
                    className="p-2 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                    title={t("orderList.viewDetails")}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderListScreen;