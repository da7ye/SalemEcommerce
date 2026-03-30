import React from "react";

function Loader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-10 h-10 border-4 border-zinc-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-10 h-10 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
}

export default Loader;