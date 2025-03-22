import UIPage from "./components/UIPage.js";
import { expect } from 'chai';
import { By, until } from 'selenium-webdriver';

export default class CheckoutCartPage extends UIPage {
  constructor(driver) {
    super();
    this.driver = driver;
  }

  continueShoppingButton = "[data-test='continue-shopping']";
  checkoutButton = "[data-test='checkout']";
  
  getProductNameLocator = (productNo) => {
    return By.css(`a#item_${productNo}_title_link`);
  }

  getProductInventoryLocators = async (productNo) => {
    const productNameLocator = this.getProductNameLocator(productNo);
    const inventoryItems = await this.driver.findElements(By.css('div.cart_item'));

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
    await this.driver.wait(until.elementIsVisible(await this.driver.findElement(By.css(this.continueShoppingButton))));
    await this.driver.wait(until.elementIsVisible(await this.driver.findElement(By.css(this.checkoutButton))));
  };

  verifyCheckoutProductDetails = async (product) => {
    const productLocators = await this.getProductInventoryLocators(
      product.productNo
    );

    expect(await productLocators.productName.getText()).to.equal(
      product.productName
    );
    
    const expectedPriceFormat = "$" + new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(product.productPrice);
    expect(await productLocators.productPrice.getText()).to.equal(expectedPriceFormat);
    expect(await productLocators.productAddRemoveButton.isEnabled()).to.be.true;
    expect(await productLocators.productAddRemoveButton.getText()).to.equal("Remove");
  };

  verifyPageDetails = async (selectedProducts) => {
    const currentUrl = await this.driver.getCurrentUrl();
    expect(currentUrl).to.include('cart.html');
    const pageTitle = await this.driver.getTitle();
    expect(pageTitle).to.include('Swag Labs');
    const continueShoppingButton = await this.driver.findElement(By.css(this.continueShoppingButton));
    expect(await continueShoppingButton.isDisplayed()).to.be.true;
    const checkoutButton = await this.driver.findElement(By.css(this.checkoutButton));
    expect(await checkoutButton.isDisplayed()).to.be.true;
    if (selectedProducts.length !== 0) {
      for (const product of selectedProducts) {
        await this.verifyCheckoutProductDetails(product);
      }
    }
  };

  checkout = async () => {
    const checkoutButton = await this.driver.findElement(By.css(this.checkoutButton));
    expect(await checkoutButton.isDisplayed()).to.be.true;
    await checkoutButton.click();
  };
}
