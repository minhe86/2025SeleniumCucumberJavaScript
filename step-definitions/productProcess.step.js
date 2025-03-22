import _ from "lodash";
import { When, setDefaultTimeout } from "@cucumber/cucumber";
import { ContentType } from "allure-js-commons";
import HomePage from "../pages/Home.js";
import CheckoutCartPage from "../pages/CheckoutCart.js";
import CheckoutCompletePage from "../pages/CheckoutComplete.js";
import CheckoutInformationPage from "../pages/CheckoutInformation.js";
import CheckoutOverviewPage from "../pages/CheckoutOverview.js";
import { getProducts } from "../data/utils.js";
import nconf from "nconf";
import { expect } from 'chai';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

setDefaultTimeout(nconf.get("cucumberTimeout:default"));

When("User verifies the product name {string}", async function (productName) {
  const homePage = await HomePage.create(this.driver);
  await homePage.verifyProductName1(productName);
});

When(
  "User verifies the product details of product {int} on Home page",
  async function (productIndex) {
    const filePath = "data/products.csv";
    const products = await getProducts(filePath);
    const selectedProduct = _.find(products, { productNo: productIndex });
    await this.attach(
      `Test Data: ${JSON.stringify(selectedProduct, null, 2)}`,
      ContentType.TEXT
    );

    const homePage = await HomePage.create(this.driver);
    await homePage.verifyProductDetails(selectedProduct);
    this.products = products;
  }
);

When("User verifies all products details on Home page", async function () {
  const filePath = "data/products.csv";
  const products = await getProducts(filePath);
  await this.attach(
    `Test Data: ${JSON.stringify(products, null, 2)}`,
    ContentType.TEXT
  );

  const homePage = await HomePage.create(this.driver);
  await homePage.verifyProductsDetails(products);
  this.products = products;
});

When("User adds product(s) [{}] to the cart", async function (productsList) {
  const toSelectProducts = productsList.split(",").map((index) => {
    const productIndex = parseInt(index, 10);
    expect(this.products[productIndex]).not.to.be.null;
    return this.products[productIndex];
  });

  const homePage = await HomePage.create(this.driver);
  for (const toSelectProduct of toSelectProducts) {
    await homePage.addProductToCart(toSelectProduct);
    if (!toSelectProduct.selected) {
      toSelectProduct.selected = true;
    }
  }
  await this.attach(
    `Test Data : ${JSON.stringify(toSelectProducts, null, 2)}`,
    ContentType.TEXT
  );

  // console.log(
  //   "after adding, products=" + JSON.stringify(this.products, null, 2)
  // );
});

When("User navigates to checkout", async function () {
  const homePage = await HomePage.create(this.driver);
  await homePage.navigateToShoppingCart();
});

When("User checkouts product(s)", async function () {
  const checkoutCartPage = await CheckoutCartPage.create(this.driver);
  await checkoutCartPage.checkout();
});

When("User inputs user information", async function (detailsTable) {
  const details = detailsTable.rowsHash();
  const username = details["firstname"];
  const lastname = details["lastname"];
  const zipcode = details["zipcode"];

  const checkoutInformationPage = await CheckoutInformationPage.create(this.driver);
  await checkoutInformationPage.inputInformation(username, lastname, zipcode);
  await checkoutInformationPage.clickContinue();
});

When("User completes the purchase", async function () {
  const screenshot = await this.driver.takeScreenshot();
  // below code is not working, so have to use workaround
  //this.attach(screenshot, 'image/png');
  const screenshotPath = join(__dirname, 'screenshot.png');
  fs.writeFileSync(screenshotPath, screenshot, 'base64');
  this.attach(fs.readFileSync(screenshotPath), 'image/png');

  const checkoutOverviewPage = await CheckoutOverviewPage.create(this.driver);
  await checkoutOverviewPage.clickFinish();
});

When("User backs to Home Page", async function () {
  const checkoutCompletePage = await CheckoutCompletePage.create(this.driver);
  await checkoutCompletePage.clickBackHome();
});