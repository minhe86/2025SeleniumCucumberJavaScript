import _ from "lodash";
import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import UIPage from "../pages/components/UIPage.js";
import SideNavigationMenu from "../pages/components/SideNavigationMenu.js";
import LoginPage from "../pages/Login.js";
import HomePage from "../pages/Home.js";
import * as Pages from "../pages/index.js";
import nconf from "nconf";

setDefaultTimeout(nconf.get("cucumberTimeout:default"));

Given("User launches SwagLabs application URL", async function () {
  if (!this.driver) {
    throw new Error("this.driver is not initialized");
  }
  const e2ePage = await UIPage.create(this.driver);
  await e2ePage.openUrl();
  await LoginPage.create(this.driver);
});

When(
  "User logs in the app using username {string} and password {string}",
  async function (username, password) {
    const loginPage = await LoginPage.create(this.driver);
    await loginPage.loginApplication(username, password);
  }
);

Then("User is directed to {string} page", async function (pageName) {
  const pageKey = _.upperFirst(_.camelCase(pageName));
  await Pages[pageKey].create(this.driver);
});

When(
  "Standard/Problem/PeformanceGlitch/Error/Visual user logs in",
  async function (detailsTable) {
    const loginPage = await LoginPage.create(this.driver);
    const details = detailsTable.rowsHash();
    // console.log("details=" + JSON.stringify(details, null, 2));
    const username = details["username"];
    const password = details["password"];
    await loginPage.loginApplication(username, password);
  }
);

Then(
  "User can see error message for {string} and {string} on Login page",
  async function (username, password) {
    const loginPage = await LoginPage.create(this.driver);
    await loginPage.verifyLoginErrorMessage(username, password);
  }
);

When("User logs out", async function () {
  const homePage = await HomePage.create(this.driver);
  await homePage.navigateToSideMenu();

  const sideNavigationMenu = await SideNavigationMenu.create(this.driver);
  await sideNavigationMenu.logout();
});

Then("User can see details on {string} page", async function (pageName) {
  const pageKey = _.upperFirst(_.camelCase(pageName));
  const page = await Pages[pageKey].create(this.driver);
  switch (pageName) {
    case "Login":
    case "Home":
    case "Checkout Information":
    case "Checkout Complete": {
      return;
    }
    case "Checkout Cart": {
      const selectedProducts = _.filter(this.products, ['selected', true]);
      await page.verifyPageDetails(selectedProducts);
      return;
    }
    case "Checkout Overview": {
      const selectedProducts = _.filter(this.products, ['selected', true]);
      await page.verifyPageDetails(selectedProducts);
      return;
    }
    default: {
      await page.verifyPageDetails();
    }
  }
});
