export default {
  paths: ["features/"],
  import: [
    "@babel/register",
    "step-definitions/support/world.js",
    "step-definitions/support/support.js",
    "step-definitions/*.step.js",
  ],
  requireModule: ["allure-cucumberjs"],
  format: ["allure-cucumberjs/reporter"],
  formatOptions: {
    snippetInterface: "async-await",
    resultsDir: "allure-results",
  },
  parallel: 3,
  retry: 2,
};
