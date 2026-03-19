import { initAuth } from "./auth";
import { initHeader } from "./header/header";

async function runAuthInit(): Promise<void> {
  await initAuth();
  initHeader();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => runAuthInit());
} else {
  runAuthInit();
}
