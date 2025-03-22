import UIPage from "./components/UIPage.js";
import { expect } from 'chai';
import { By, until } from 'selenium-webdriver';

export default class CheckoutCompletePage extends UIPage {
  constructor(driver) {
    super();
    this.driver = driver;
  }

  backHomeButton = "[data-test='back-to-products']";

  waitForDisplayed = async () => {
    await this.driver.wait(until.elementIsVisible(await this.driver.findElement(By.css(this.backHomeButton))));
  };

  clickBackHome = async () => {
    const backHomeButton = await this.driver.findElement(By.css(this.backHomeButton));
    expect(await backHomeButton.isDisplayed()).to.be.true;
    await backHomeButton.click();
  };
}
