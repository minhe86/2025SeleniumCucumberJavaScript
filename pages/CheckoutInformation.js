import UIPage from "./components/UIPage.js";
import { expect } from 'chai';
import { By, until } from 'selenium-webdriver';

export default class CheckoutInformationPage extends UIPage {
  constructor(driver) {
    super();
    this.driver = driver;
  }

  firstNameText = "[data-test='firstName']";
  lastNameText = "[data-test='lastName']";
  postalCodeText = "[data-test='postalCode']";
  cancelButton = "[data-test='cancel']";
  continueButton = "[data-test='continue']";

  waitForDisplayed = async () => {
    await this.driver.wait(until.elementIsVisible(await this.driver.findElement(By.css(this.cancelButton))));
    await this.driver.wait(until.elementIsVisible(await this.driver.findElement(By.css(this.continueButton))));
  };

  inputInformation = async (username, lastname, zipcode) => {
    await this.driver.findElement(By.css(this.firstNameText)).sendKeys(username);
    await this.driver.findElement(By.css(this.lastNameText)).sendKeys(lastname);
    await this.driver.findElement(By.css(this.postalCodeText)).sendKeys(zipcode);
  };

  clickContinue = async () => {
    const continueButton = await this.driver.findElement(By.css(this.continueButton));
    expect(await continueButton.isDisplayed()).to.be.true;
    await continueButton.click();
  };
}
