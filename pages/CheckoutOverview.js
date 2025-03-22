import UIPage from "./components/UIPage.js";
import { expect } from 'chai';
import { By, until } from 'selenium-webdriver';

export default class CheckoutOverviewPage extends UIPage {
  constructor(driver) {
    super();
    this.driver = driver;
  }

  subtotalLabel = "[data-test='subtotal-label']";
  cancelButton = "[data-test='cancel']";
  finishButton = "[data-test='finish']";

  getProductNameLocator = (productNo) => {
    return By.css(`a#item_${productNo}_title_link`);
  }

  getProductInventoryLocators = async (productNo) => {
    const productNameLocator = this.getProductNameLocator(productNo);
    const inventoryItems = await this.driver.findElements(By.css('div.cart_item_label'));

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
    };
  }

  waitForDisplayed = async () => {
    await this.driver.wait(until.elementIsVisible(await this.driver.findElement(By.css(this.cancelButton))));
    await this.driver.wait(until.elementIsVisible(await this.driver.findElement(By.css(this.finishButton))));
  };

  verifyCheckoutProductDetails = async (product) => {
    const productLocators = await this.getProductInventoryLocators(product.productNo);
    expect(await productLocators.productName.getText()).to.equal(
      product.productName
    );
    const expectedPriceFormat = "$" + new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(product.productPrice);
    expect(await productLocators.productPrice.getText()).to.equal(
      expectedPriceFormat
    );

  };

  verifyCheckoutInfoDetails = async (selectedProducts) => {
    const subtotal = selectedProducts.reduce((acc, product) => {
      return acc + product.productPrice;
    }, 0);

    const expectedPriceFormat =
      "Item total: $" +
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(subtotal);
    expect(await this.driver.findElement(By.css(this.subtotalLabel)).getText()).to.equal(
      expectedPriceFormat
    );
  };

  verifyPageDetails = async (selectedProducts) => {
    const pageTitle = await this.driver.getTitle();
    expect(pageTitle).to.include('Swag Labs');
    expect(await this.driver.findElement(By.css(this.finishButton)).isDisplayed()).to.be.true;
    expect(await this.driver.findElement(By.css(this.cancelButton)).isDisplayed()).to.be.true;

    if (selectedProducts.length !== 0) {
      for (const product of selectedProducts) {
        await this.verifyCheckoutProductDetails(product);
      }
    };

    await this.verifyCheckoutInfoDetails(selectedProducts);
  };

  clickFinish = async () => {
    const finishButton = await this.driver.findElement(By.css(this.finishButton));
    expect(await finishButton.isDisplayed()).to.be.true;
    await finishButton.click();
  };

}
