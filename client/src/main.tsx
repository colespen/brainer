import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store.ts";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import ErrorPage from "./errorPage.tsx";
import GameMain from "./components/GameMain.tsx";
import Highscores from "./components/Highscores.tsx";

const router = createBrowserRouter([
  // {
  //   path: "/", // TODO: landing page
  //   element: <GameMain />,
  //   errorElement: <ErrorPage />,
  // },
  {
    path: "/", // temp redirect
    element: <React.Fragment />,
    loader: () => redirect("/game"),
    errorElement: <ErrorPage />,
  },
  {
    path: "/game",
    element: <GameMain />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/highscores",
    element: <Highscores />,
    errorElement: <ErrorPage />,
  },
]);

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
