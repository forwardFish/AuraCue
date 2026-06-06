import { p0RouteRegistry } from "../routes/route-registry.mjs";
import { shellRouteParams } from "../fixtures/shell-fixtures.mjs";

export function materializeRoute(routePattern, params = shellRouteParams) {
  return routePattern.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
    const value = params[key];
    if (!value) {
      throw new Error(`Missing route parameter: ${key}`);
    }
    return encodeURIComponent(value);
  });
}

export function createShellNavigator(routes = p0RouteRegistry) {
  const history = [];

  function pushRoute(route, params) {
    const path = materializeRoute(route.route, params);
    const entry = {
      uiId: route.uiId,
      route: route.route,
      path,
      pagePath: route.pagePath,
      state: route.state,
      ownerScenario: route.ownerScenario,
      title: route.title
    };
    history.push(entry);
    return entry;
  }

  return {
    currentRoute() {
      return history.at(-1) ?? null;
    },
    history() {
      return [...history];
    },
    navigate(routePattern, params = shellRouteParams) {
      const route = routes.find((item) => item.route === routePattern);
      if (!route) {
        throw new Error(`Route is not registered: ${routePattern}`);
      }
      return pushRoute(route, params);
    },
    navigateByUiId(uiId, params = shellRouteParams) {
      const route = routes.find((item) => item.uiId === uiId);
      if (!route) {
        throw new Error(`UI route is not registered: ${uiId}`);
      }
      return pushRoute(route, params);
    }
  };
}
