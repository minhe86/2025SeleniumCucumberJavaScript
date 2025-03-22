import UIPage from "./components/UIPage.js";
import { expect } from 'chai';
import { By, until } from 'selenium-webdriver';
import fs from 'fs';
const config = JSON.parse(fs.readFileSync('./configs/config.default.json', 'utf8'));

export default class HomePage extends UIPage {
  constructor(driver) {
    super();
    this.driver = driver;
  }

  timeout = parseInt(config.seleniumTimeouts.elementWait, 10);
  burgerMenu = "button#react-burger-menu-btn";
  shoppingCartLink = "a.shopping_cart_link";

  getProductNameLocator = (productNo) => {
    return By.css(`a#item_${productNo}_title_link`);
  }

  getProductInventoryLocators = async (productNo) => {
    const productNameLocator = this.getProductNameLocator(productNo);
    const inventoryItems = await this.driver.findElements(By.css('div.inventory_item_description'));

    let selectedInventoryContainer;
    for (const item of inventoryItems) {
      const productNameElement = await item.findElements(productNameLocator);
      if (productNameElement.length > 0) {
        selectedInventoryContainer = item;
        break;
      }
    }
    if (!selectedInventoryContainer) {
      throw new Error(`Product with productNo ${productNo} not found.`);
    }

    return {
      productName: await selectedInventoryContainer.findElement(productNameLocator),
      productDescription: await selectedInventoryContainer.findElement(By.css('div.inventory_item_desc')),
      productPrice: await selectedInventoryContainer.findElement(By.css('div.inventory_item_price')),
      productAddRemoveButton: await selectedInventoryContainer.findElement(By.css('button')),
    };
  }

  waitForDisplayed = async () => {
    const product1Locators = await this.getProductInventoryLocators(1);
    await this.driver.wait(until.elementIsVisible(product1Locators.productName), this.timeout);
    await this.driver.wait(until.elementIsVisible(product1Locators.productDescription), this.timeout);
    await this.driver.wait(until.elementIsVisible(product1Locators.productPrice), this.timeout);
    await this.driver.wait(until.elementIsVisible(product1Locators.productAddRemoveButton), this.timeout);
    await this.driver.wait(until.elementIsVisible(await this.driver.findElement(By.css(this.burgerMenu))), this.timeout);
  };

  verifyPageDetails = async () => {
    const currentUrl = await this.driver.getCurrentUrl();
    expect(currentUrl).to.include('inventory.html');

    const pageTitle = await this.driver.getTitle();
    expect(pageTitle).to.include('Swag Labs');

    const product1Locators = await this.getProductInventoryLocators(1);

    if (!(await product1Locators.productName.isDisplayed())) {
      throw new Error("Product 1 is not visible");
    } else {
      expect(await product1Locators.productName.isDisplayed()).to.be.true;
      expect(
        await product1Locators.productDescription.isDisplayed()
      ).to.be.true;
      expect(await product1Locators.productPrice.isDisplayed()).to.be.true;
      expect(
        await product1Locators.productAddRemoveButton.isEnabled()
      ).to.be.true;
    }

    expect(await this.driver.findElement(By.css(this.burgerMenu)).isEnabled()).to.be.true;
  };

  verifyProductName1 = async (productName) => {
    const product1Locators = await this.getProductInventoryLocators(1);
    expect(await product1Locators.productName.getText()).to.equal(
      productName
    );
  };

  verifyProductDetails = async (product) => {
    const productLocators = await this.getProductInventoryLocators(
      product.productNo
    );

    expect(await productLocators.productName.getText()).to.equal(
      product.productName
    );
    expect(await productLocators.productDescription.getText()).to.equal(
      product.productDescription
    );
    const expectedPriceFormat =
      "$" +
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(product.productPrice);
    expect(await productLocators.productPrice.getText()).to.equal(
      expectedPriceFormat
    );
    expect(
      await productLocators.productAddRemoveButton.isEnabled()
    ).to.be.true;
  };

  verifyProductsDetails = async (products) => {
    for (const product of products) {
      await this.verifyProductDetails(product);
    }
  };

  navigateToSideMenu = async () => {
    expect(await this.driver.findElement(By.css(this.burgerMenu)).isEnabled()).to.be.true;
    await this.driver.findElement(By.css(this.burgerMenu)).click();
  };

  navigateToShoppingCart = async () => {
    expect(await this.driver.findElement(By.css(this.shoppingCartLink)).isEnabled()).to.be.true;
    await this.driver.findElement(By.css(this.shoppingCartLink)).click();
  };

  addProductToCart = async (product) => {
    const productLocators = await this.getProductInventoryLocators(product.productNo);
    await productLocators.productAddRemoveButton.click();
    // need get it again, otherwise it will be stale -  StaleElementReferenceError: stale element reference: stale element not found in the current frame.
    const buttonText = await (await this.getProductInventoryLocators(product.productNo)).productAddRemoveButton.getText();
    expect(buttonText).to.equal('Remove');
  };
}
