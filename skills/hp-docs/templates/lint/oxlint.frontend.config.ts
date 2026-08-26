import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import react from "ultracite/oxlint/react";
import tanstack from "ultracite/oxlint/tanstack";

export default defineConfig({
  extends: [core, react, tanstack],
  ignorePatterns: core.ignorePatterns,
  rules: {
    "unicorn/filename-case": "off",
    "sort-keys": "off",
    curly: "off",
    "prefer-destructuring": "off",
    "unicorn/prefer-at": "off",
    "react/hook-use-state": "off",
  },
});
