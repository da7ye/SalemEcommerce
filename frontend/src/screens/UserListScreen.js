import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listUsers, deleteUser } from "../actions/userActions";
import { useLanguage } from "../i18/LanguageContext";

function UserListScreen({ history }) {
  const dispatch = useDispatch();
  const { t } = useLanguage();

  const userList = useSelector((state) => state.userList);
  const { users, loading, error } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, successDelete, userInfo]);

  const deleteHandler = (id) => {
    if (window.confirm(t("userList.confirmDelete")))
      dispatch(deleteUser(id));
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          {t("userList.title")}
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
            <div className="col-span-1">{t("userList.id")}</div>
            <div className="col-span-3">{t("userList.name")}</div>
            <div className="col-span-4">{t("userList.email")}</div>
            <div className="col-span-2">{t("userList.admin")}</div>
            <div className="col-span-2 text-end">{t("userList.actions")}</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-zinc-50">
            {users.map((user) => (
              <div
                key={user._id}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 items-center hover:bg-zinc-50/50 transition-colors"
              >
                <div className="md:col-span-1 text-sm font-mono text-zinc-500 truncate">
                  <span className="md:hidden text-xs font-sans text-zinc-400 me-2">
                    {t("userList.id")}:
                  </span>
                  {user._id}
                </div>

                <div className="md:col-span-3 text-sm font-medium text-zinc-800">
                  <span className="md:hidden text-xs font-normal text-zinc-400 me-2">
                    {t("userList.name")}:
                  </span>
                  {user.name}
                </div>

                <div className="md:col-span-4 text-sm text-zinc-600 truncate">
                  <span className="md:hidden text-xs text-zinc-400 me-2">
                    {t("userList.email")}:
                  </span>
                  {user.email}
                </div>

                <div className="md:col-span-2">
                  <span className="md:hidden text-xs text-zinc-400 me-2">
                    {t("userList.admin")}:
                  </span>
                  {user.isAdmin ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {t("userList.adminBadge")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-500">
                      {t("userList.userBadge")}
                    </span>
                  )}
                </div>

                <div className="md:col-span-2 flex items-center justify-end gap-2">
                  <Link
                    to={`/admin/user/${user._id}/edit`}
                    className="p-2 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                    title={t("userList.editUser")}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </Link>

                  <button
                    onClick={() => deleteHandler(user._id)}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title={t("userList.deleteUser")}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserListScreen;