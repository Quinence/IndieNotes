import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import { getUser } from "~/session.server";
import stylesheet from "~/tailwind.css";
import rdtStylesheet from "remix-development-tools/index.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  ...(process.env.NODE_ENV === "development"
    ? [{ rel: "stylesheet", href: rdtStylesheet }]
    : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ user: await getUser(request) });
};
function App() {
  console.log("Rendering Root");
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
let AppExport = App;
// This imports the dev tools only if you're in development
if (process.env.NODE_ENV === "development") {
  const { withDevTools } = require("remix-development-tools");
  AppExport = withDevTools(AppExport);
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <div className="text-5xl font-bold p-20 border-red-400  bg-red-100 text-red-900 text-center m-10 rounded-lg border">
          {isRouteErrorResponse(error) ? error.status : "Something Went Wrong"}
          <Link
            to="/"
            prefetch="intent"
            className="text-2xl bg-red-800 text-red-100 p-4 block rounded-xl mt-10"
          >
            {" "}
            Go to Homepage
          </Link>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export default AppExport;
