import { BeforeAll, Before, After, AfterStep } from "@cucumber/cucumber";
import { createDriver } from './browserFactory.js';
import { ContentType } from "allure-js-commons";
import _ from 'lodash';
import nconf from 'nconf';
import fs from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';


let driver;

BeforeAll(async function () {
  nconf
    .env({
      transform: ({ key, value }) => {
        if (_.includes(['true', 'false'], value)) value = JSON.parse(value);
        return { key, value };
      },
    })
    .argv()
    .file('default', './configs/config.default.json');
});

Before(async function () {
  driver = await createDriver();
  this.driver = driver;
});

After(async function () {
  if (driver) {
    await driver.quit();
  }
});

AfterStep(async function (step) {
  if (step.result.status !== "PASSED") {
    try {
      const projectRoot = process.cwd();
      const screenshotsDir = join(projectRoot, 'step-definitions/screenshots');
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }

      const screenshot = await driver.takeScreenshot();
      // below code is not working, so have to use workaround
      //this.attach(screenshot, 'image/png');
      const screenshotPath = join(screenshotsDir, `screenshot-${uuidv4()}.png`);
      fs.writeFileSync(screenshotPath, screenshot, 'base64');
      this.attach(fs.readFileSync(screenshotPath), ContentType.PNG);
    } catch (error) {
      console.error(
        "Failed to capture screenshot or attach step details:",
        error
      );
    }
  }
});
