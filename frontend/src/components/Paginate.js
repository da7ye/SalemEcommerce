import React from "react";
import { Link } from "react-router-dom";

function Paginate({ pages, page, keyword = "", isAdmin = false }) {
  if (pages <= 1) return null;

  const basePath = isAdmin ? "/admin/productlist/" : "/";

  return (
    <div className="flex items-center justify-center gap-2">
      {[...Array(pages).keys()].map((x) => (
        <Link
          key={x + 1}
          to={`${basePath}?keyword=${keyword.split("?keyword=")[1] || ""}&page=${
            x + 1
          }`}
          className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
            x + 1 === page
              ? "bg-zinc-900 text-white shadow-md"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          {x + 1}
        </Link>
      ))}
    </div>
  );
}

export default Paginate;