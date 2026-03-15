import { initAuth } from "./auth";

function runAuthInit(): void {
  initAuth();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runAuthInit);
} else {
  runAuthInit();
}
