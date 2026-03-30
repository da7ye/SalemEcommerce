import React from "react";

function FormContainer({ children }) {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

export default FormContainer;