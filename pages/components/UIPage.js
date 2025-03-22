import Component from "./Component.js";
import nconf from 'nconf';

export default class UIPage extends Component {
  constructor(driver) {
    super();
    this.driver = driver;
  }

  baseUrl = nconf.get('swagLabsBaseUrl');

  waitForDisplayed = async () => {};

  openUrl = async () => {
    await this.driver.get(this.baseUrl);
  };

}
