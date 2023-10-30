import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError() as Error & { statusText?: string };
  console.error(error);

  return (
    <div id="error-page">
      <h1>Woops.</h1>
      <p>Sorry, that shouldn't have happened.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}