import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";
import { useLanguage } from "../i18/LanguageContext";

function OrderScreen({ history, match }) {
  const orderId = match.params.id;
  const dispatch = useDispatch();
  const { t } = useLanguage();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading && !error && order) {
    order.itemsPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);
  }

  useEffect(() => {
    if (!order || successPay || order._id !== Number(orderId) || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, order, orderId, successPay, successDeliver]);

  const payHandler = () => {
    dispatch(payOrder(orderId));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  // WhatsApp store number — change this to your actual store number
  const STORE_WHATSAPP = "22232434312";

  const getWhatsAppLink = () => {
    if (!order) return "#";
    const message = encodeURIComponent(
      `مرحبًا! لقد قمتُ بطلب (الرمز: ${order.paymentCode}) بمجموع قدره ${order.totalPrice} أوقية. أودّ تأكيد عملية الدفع الخاصة بي.`
    );
    return `https://wa.me/${STORE_WHATSAPP}?text=${message}`;
  };

  // Determine customer name/email to display
  const customerName =
    order?.User?.name ||
    order?.shippingAddress?.guestName ||
    "Guest";
  const customerEmail =
    order?.User?.email ||
    order?.shippingAddress?.guestEmail ||
    "";

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-zinc-500 mb-1">{t("orderScreen.order")}</p>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          #{order._id}
        </h1>
        <div className="mt-2 h-1 w-12 bg-amber-500 rounded-full"></div>
      </div>

      {/* Payment Code Banner (shown when order is not paid) */}
      {!order.isPaid && (
        <div className="mb-8 bg-amber-50 border-2 border-amber-300 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-900 mb-1">
                {t("orderScreen.paymentCode")}
              </h3>
              <div className="inline-block bg-white border-2 border-amber-400 rounded-xl px-6 py-3 mb-3">
                <span className="text-2xl font-mono font-bold text-zinc-900 tracking-widest">
                  {order.paymentCode}
                </span>
              </div>
              <p className="text-sm text-amber-800 leading-relaxed">
                {t("orderScreen.paymentCodeDesc")}
              </p>
            </div>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-emerald-600/20"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("orderScreen.contactWhatsApp")}
            </a>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping */}
          <div className="bg-white border border-zinc-100 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-zinc-900 mb-4">
              {t("orderScreen.shipping")}
            </h2>

            <div className="space-y-2 text-sm text-zinc-600">
              <p>
                <span className="font-semibold text-zinc-800">
                  {customerName}
                </span>
              </p>
              {customerEmail && (
                <p>
                  <a
                    href={`mailto:${customerEmail}`}
                    className="text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    {customerEmail}
                  </a>
                </p>
              )}
              {order.shippingAddress?.guestPhone && (
                <p className="text-zinc-600">
                  {t("orderScreen.phone")}: {order.shippingAddress.guestPhone}
                </p>
              )}
              <p>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
            </div>

            <div className="mt-4">
              {order.isDeliver ? (
                <Message variant="success">
                  {t("orderScreen.deliveredOn")}{" "}
                  {order.deliveredAt
                    ? order.deliveredAt.substring(0, 10)
                    : null}
                </Message>
              ) : (
                <Message variant="warning">{t("orderScreen.notDelivered")}</Message>
              )}
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-white border border-zinc-100 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-zinc-900 mb-3">
              {t("orderScreen.payment")}
            </h2>
            <p className="text-sm text-zinc-600 mb-2">
              {t("orderScreen.paymentCodeLabel")}:{" "}
              <span className="font-mono font-bold text-zinc-800">
                {order.paymentCode}
              </span>
            </p>

            {order.isPaid ? (
              <Message variant="success">
                {t("orderScreen.paidOn")}{" "}
                {order.paidAt ? order.paidAt.substring(0, 10) : null}
              </Message>
            ) : (
              <Message variant="warning">{t("orderScreen.notPaid")}</Message>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white border border-zinc-100 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-zinc-900 mb-4">
              {t("orderScreen.orderItems")}
            </h2>

            {order.orderItems.length === 0 ? (
              <Message variant="info">{t("orderScreen.emptyOrder")}</Message>
            ) : (
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
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
              {t("orderScreen.orderSummary")}
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>{t("orderScreen.items")}</span>
                <span className="font-medium text-zinc-900">
                  UM{order.itemsPrice}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>{t("orderScreen.shippingCost")}</span>
                <span className="font-medium text-zinc-900">
                  UM{order.shippingPrice}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>{t("orderScreen.tax")}</span>
                <span className="font-medium text-zinc-900">
                  UM{order.taxPrice}
                </span>
              </div>
              <div className="pt-3 mt-3 border-t border-zinc-100 flex justify-between text-base font-bold text-zinc-900">
                <span>{t("orderScreen.total")}</span>
                <span>UM{order.totalPrice}</span>
              </div>
            </div>

            {/* Admin: Mark As Paid */}
            {loadingPay && <Loader />}
            {userInfo && userInfo.isAdmin && !order.isPaid && (
              <button
                type="button"
                onClick={payHandler}
                className="w-full mt-4 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98]"
              >
                {t("orderScreen.markAsPaid")}
              </button>
            )}

            {/* Admin: Mark As Delivered */}
            {loadingDeliver && <Loader />}
            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDeliver && (
                <button
                  type="button"
                  onClick={deliverHandler}
                  className="w-full mt-4 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98]"
                >
                  {t("orderScreen.markAsDelivered")}
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderScreen;