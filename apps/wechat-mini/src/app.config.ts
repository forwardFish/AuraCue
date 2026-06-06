import { p0Routes } from "./routes/p0-routes";

export default {
  pages: Array.from(new Set(p0Routes.map((route) => route.pagePath))),
  window: {
    navigationBarTitleText: "AuraCue",
    navigationStyle: "custom"
  }
};
