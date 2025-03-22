import UIPage from "./components/UIPage.js";
import { expect } from 'chai';
import { By, until } from 'selenium-webdriver';
import fs from 'fs';
const config = JSON.parse(fs.readFileSync('./configs/config.default.json', 'utf8'));


export default class LoginPage extends UIPage {
  constructor(driver) {
    super();
    this.driver = driver;
  }

  timeout = parseInt(config.seleniumTimeouts.elementWait, 10);
  username = "input#user-name";
  password = "input#password";
  loginButton = "input#login-button";
  errorMessageField = "div.error-message-container";
  errorMessageForUsrPw = "Epic sadface: Username and password do not match any user in this service";
  errorMessageForLockedUsr = "Epic sadface: Sorry, this user has been locked out."

  waitForDisplayed = async () => {
    await this.driver.wait(until.elementIsVisible(await this.driver.findElement(By.css(this.username))), this.timeout);
    await this.driver.wait(until.elementIsVisible(await this.driver.findElement(By.css(this.password))), this.timeout);
    await this.driver.wait(until.elementIsVisible(await this.driver.findElement(By.css(this.loginButton))), this.timeout);
  };

  loginApplication = async (user, passwd) => {
    await this.driver.findElement(By.css(this.username)).sendKeys(user);
    await this.driver.findElement(By.css(this.password)).sendKeys(passwd);
    await this.driver.findElement(By.css(this.loginButton)).click();
  };

  verifyLoginErrorMessage = async (user, passwd) => {
    if (user === "locked_out_user" && passwd === "secret_sauce") {
       expect(await this.driver.findElement(By.css(this.errorMessageField)).getText()).to.include(this.errorMessageForLockedUsr)
    }
    else {
      expect(await this.driver.findElement(By.css(this.errorMessageField)).getText()).to.include(this.errorMessageForUsrPw)
    }
  }

  verifyPageDetails = async () => {
    const currentUrl = await this.driver.getCurrentUrl();
    expect(currentUrl).to.include('www.saucedemo.com'); 

    const pageTitle = await this.driver.getTitle();
    expect(pageTitle).to.include('Swag Labs'); 

    const usernameField = await this.driver.findElement(By.css(this.username)); 
    const isUsernameEditable = await usernameField.getAttribute('readonly');
    expect(isUsernameEditable).to.be.null; 

    const passwordField = await this.driver.findElement(By.css(this.password)); 
    const isPasswordEditable = await passwordField.getAttribute('readonly');
    expect(isPasswordEditable).to.be.null; 

    const loginButton = await this.driver.findElement(By.css(this.loginButton));
    const isLoginButtonVisible = await loginButton.isDisplayed();
    if (!isLoginButtonVisible) {
      throw new Error('Login button is not visible');
    }
  };
}
