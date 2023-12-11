import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store.ts";
import {
  createBrowserRouter,
  RouterProvider,
  // BrowserRouter,
  // Route,
} from "react-router-dom";
import "./index.css";
import ErrorPage from "./errorPage.tsx";
import GameMain from "./components/GameMain.tsx";
import Highscores from "./components/Highscores.tsx";

const router = createBrowserRouter([
  {
    path: "/", // TODO: landing page
    element: <GameMain />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/game", // TODO: landing page
    element: <GameMain />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/highscores", // TODO: landing page
    element: <Highscores />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
