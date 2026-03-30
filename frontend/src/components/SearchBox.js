import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useLanguage } from "../i18/LanguageContext";

function SearchBox() {
  const [keyword, setKeyword] = useState("");
  const history = useHistory();
  const { t } = useLanguage();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      history.push(`/?keyword=${keyword}&page=1`);
    } else {
      history.push(history.location.pathname);
    }
  };

  return (
    <form onSubmit={submitHandler} className="w-full">
      <div className="relative">
        <svg
          className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          placeholder={t("header.searchPlaceholder")}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full ps-10 pe-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
        />
      </div>
    </form>
  );
}

export default SearchBox;