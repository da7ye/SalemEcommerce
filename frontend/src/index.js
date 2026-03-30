import React from "react";
import ReactDOM from "react-dom";

/* REDUX */
import { Provider } from "react-redux";
import store from "./store";

/* LANGUAGE */
import { LanguageProvider } from "./i18/LanguageContext";

/* COMPONENTS */
import App from "./App";
import reportWebVitals from "./reportWebVitals";

/* STYLING */
import "./index.css";
ReactDOM.render(
  <Provider store={store}>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </Provider>,
  document.getElementById("root")
);

reportWebVitals();