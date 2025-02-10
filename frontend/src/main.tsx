import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { persistor, store } from "./app/store.ts";
import { Provider } from "react-redux";
import { CssBaseline } from "@mui/material";
import { PersistGate } from "redux-persist/integration/react";
import { addInterceptors } from "./utils/axiosAPI.ts";

addInterceptors(store);

createRoot(document.getElementById("root")!).render(

    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
);
