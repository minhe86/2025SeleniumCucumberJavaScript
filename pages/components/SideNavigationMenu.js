import Component from "./Component.js";
import { By, until } from 'selenium-webdriver';

export default class SideNavigationMenu extends Component {
  constructor(driver) {
    super();
    this.driver = driver;
  }

  crossButton = "button#react-burger-cross-btn";
  allItemsLink = "a#inventory_sidebar_link";
  aboutLink = "a#about_sidebar_link";
  logoutLink = "a#logout_sidebar_link";

  waitForDisplayed = async () => {
    await this.driver.wait(until.elementIsVisible(await this.driver.findElement(By.css(this.crossButton))));
    await this.driver.wait(until.elementIsVisible(await this.driver.findElement(By.css(this.allItemsLink))));
    await this.driver.wait(until.elementIsVisible(await this.driver.findElement(By.css(this.aboutLink))));
    await this.driver.wait(until.elementIsVisible(await this.driver.findElement(By.css(this.logoutLink))));
  };

  verifyPageDetails = async () => {
    expect(await this.driver.findElement(By.css(this.crossButton)).isEnabled()).to.be.true;
    expect(await this.driver.findElement(By.css(this.allItemsLink)).isEnabled()).to.be.true;
    expect(await this.driver.findElement(By.css(this.aboutLink)).isEnabled()).to.be.true;
    expect(await this.driver.findElement(By.css(this.aboutLink)).getAttribute("href")).to.equal("https://saucelabs.com/");
    expect(await this.driver.findElement(By.css(this.logoutLink)).isEnabled()).to.be.true;
  };

  logout = async () => {
    await this.driver.findElement(By.css(this.logoutLink)).click();
  };
}
