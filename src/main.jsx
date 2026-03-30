import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { CartProvider } from "./Modules/Cart/CartContext.jsx";
import { AuthProvider } from "./AuthProvide.jsx";

import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById("SGS")).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);

// ReactDOM.render(<App />, document.getElementById("root"));
