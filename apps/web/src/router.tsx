import type { AnchorHTMLAttributes } from "react";
import * as stylex from "@stylexjs/stylex";
import { AppShell } from "@astryxdesign/core/AppShell";
import { Divider } from "@astryxdesign/core/Divider";
import { VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { TopNav, TopNavHeading, TopNavItem } from "@astryxdesign/core/TopNav";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Link,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
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
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <AppShell
      contentPadding={4}
      height="auto"
      mobileNav={false}
      variant="section"
      topNav={
        <TopNav
          label="Main navigation"
          heading={<TopNavHeading as={RouterLink} heading="VitePlus Stack" headingHref="/" />}
          startContent={
            <>
              <TopNavItem as={RouterLink} href="/" isSelected={pathname === "/"} label="Todos" />
              <TopNavItem
                as={RouterLink}
                href="/settings"
                isSelected={pathname === "/settings"}
                label="Settings"
              />
            </>
          }
        />
      }
    >
      <VStack gap={8} maxWidth={960} width="100%" xstyle={styles.content}>
        <Outlet />
        <VStack as="footer" gap={6}>
          <Divider />
          <Text as="p" color="secondary" type="supporting">
            React, TanStack Router, TanStack Query, Zustand, Hono, Drizzle, StyleX, Astryx, and
            VitePlus.
          </Text>
        </VStack>
      </VStack>
    </AppShell>
  );
}

function RouterLink({ href = "/", target, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <Link to={href} {...props} {...(target === undefined ? {} : { target })} />;
}

const styles = stylex.create({
  content: {
    marginInline: "auto",
  },
});
