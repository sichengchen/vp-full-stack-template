import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { Separator } from "@template/ui/components/separator";
import { buttonVariants } from "@template/ui/components/button";
import { cn } from "@template/ui/lib/utils";
import { HomePage } from "./routes/home";
import { SettingsPage } from "./routes/settings";

type RouterContext = {
  queryClient: QueryClient;
};

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([indexRoute, settingsRoute]);

export function createAppRouter(queryClient: QueryClient) {
  return createRouter({
    routeTree,
    context: {
      queryClient,
    },
    defaultPreload: "intent",
  });
}

function RootLayout() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
          <Link to="/" className="font-semibold">
            VitePlus Stack
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              to="/"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              activeProps={{
                className: "bg-accent text-accent-foreground",
              }}
            >
              Todos
            </Link>
            <Link
              to="/settings"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              activeProps={{
                className: "bg-accent text-accent-foreground",
              }}
            >
              Settings
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8">
        <Outlet />
      </main>
      <footer className="mx-auto w-full max-w-5xl px-4 pb-8">
        <Separator />
        <p className="text-muted-foreground mt-6 text-sm">
          React, TanStack Router, TanStack Query, Zustand, Hono, Drizzle, Tailwind, shadcn/ui Base
          UI mode, and VitePlus.
        </p>
      </footer>
    </div>
  );
}
