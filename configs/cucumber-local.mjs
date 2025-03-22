export default {
  paths: ["features/"],
  import: [
    "@babel/register",
    "step-definitions/support/world.js",
    "step-definitions/support/support.js",
    "step-definitions/*.step.js",
  ],
  requireModule: ["allure-cucumberjs"],
  format: ["progress", "summary", "progress-bar", ["html", "cucumber-report.html"]],
  formatOptions: {
    snippetInterface: "async-await",
  },
  dryRun: false,
  retry: 0,
};
