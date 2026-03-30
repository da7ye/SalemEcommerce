import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getUserDetails, updateUser } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../constants/userConstants";
import { useLanguage } from "../i18/LanguageContext";

function UserEditScreen({ match, history }) {
  const userId = match.params.id;
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { user, loading, error } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    error: errorUpdate,
    loading: loadingUpdate,
    success: successUpdate,
  } = userUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      history.push("/admin/userlist");
    } else {
      if (!user.name || user._id !== Number(userId)) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [dispatch, user, userId, history, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: user._id, name, email, isAdmin }));
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center px-4">
      <div className="w-full max-w-lg">
        {/* Back Link */}
        <Link
          to="/admin/userlist"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t("userEdit.backToUsers")}
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            {t("userEdit.title")}
          </h1>
          <p className="mt-2 text-zinc-500">
            {t("userEdit.subtitle")}
          </p>
        </div>

        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-zinc-700 mb-1.5"
              >
                {t("userEdit.nameLabel")}
              </label>
              <input
                id="name"
                type="text"
                placeholder={t("userEdit.namePlaceholder")}
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
                {t("userEdit.emailLabel")}
              </label>
              <input
                id="email"
                type="email"
                placeholder={t("userEdit.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
              />
            </div>

            <div>
              <label
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  isAdmin
                    ? "border-amber-500 bg-amber-50/50"
                    : "border-zinc-200 hover:border-zinc-300 bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="w-4 h-4 text-amber-500 border-zinc-300 rounded focus:ring-amber-500"
                />
                <div>
                  <span className="text-sm font-semibold text-zinc-800">
                    {t("userEdit.administrator")}
                  </span>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {t("userEdit.adminDesc")}
                  </p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-zinc-900/20"
            >
              {t("userEdit.updateButton")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default UserEditScreen;