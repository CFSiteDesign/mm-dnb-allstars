import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-deep-1 px-4">
      <div className="max-w-md text-center">
        <h1 className="display text-6xl text-yellow">404</h1>
        <p className="mt-4 text-bone">Wrong turn. Sunrise this way.</p>
        <Link to="/" className="mt-6 inline-flex border-ink bg-yellow px-4 py-2 text-ink display text-sm hard-shadow-sm">
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-deep-1 px-4">
      <div className="max-w-md text-center">
        <h1 className="display text-2xl text-bone">This page didn't load</h1>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="border-ink bg-yellow px-4 py-2 text-ink display text-sm hard-shadow-sm">Try again</button>
          <a href="/" className="border-ink bg-bone px-4 py-2 text-ink display text-sm hard-shadow-sm">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#01142c" },
      { title: "DNB ALL STARS THAILAND × MAD MONKEY | 8 spots · $250" },
      { name: "description", content: "8 packages. DnB Allstars Thailand, Phuket, 22–24 Jan 2027. 3 day pass, 4 nights at Mad Monkey, daily shuttle, pre-parties. $250. All in." },
      { property: "og:title", content: "DNB ALL STARS THAILAND × MAD MONKEY — 8 spots, $250" },
      { property: "og:description", content: "3 day pass, 4 nights, daily shuttle, pre-parties. One payment. Phuket, 22–24 Jan 2027." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Mad Monkey Hostels" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "DNB ALL STARS THAILAND × MAD MONKEY" },
      { name: "twitter:description", content: "8 spots. $250. Book the flight." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;900&family=Bungee&family=Caveat:wght@700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
