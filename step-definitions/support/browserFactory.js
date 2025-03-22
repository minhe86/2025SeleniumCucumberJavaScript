import { Builder, Capabilities } from 'selenium-webdriver';
import dotenv from 'dotenv';
dotenv.config();

export async function createDriver() {
  const browser = process.env.BROWSER || 'chrome';
  const headless = process.env.HEADLESS === 'true';

  let capabilities;
  switch (browser.toLowerCase()) {
    case 'chrome':
      capabilities = Capabilities.chrome();
      const chromeOptions = { args: [] };
      if (headless) {
        chromeOptions.args.push('--headless');
      }
      capabilities.set('goog:chromeOptions', chromeOptions);
      break;
    case 'firefox':
      capabilities = Capabilities.firefox();
      const firefoxOptions = { args: [] };
      if (headless) {
        firefoxOptions.args.push('-headless');
      }
      capabilities.set('moz:firefoxOptions', firefoxOptions);
      break;
    case 'edge':
      capabilities = Capabilities.edge();
      break;
    case 'safari':
      capabilities = Capabilities.safari();
      break;
    default:
      throw new Error(`Unsupported browser: ${browser}`);
  }
  const driver = await new Builder().withCapabilities(capabilities).build();

  if (process.env.SCREEN_RESOLUTION) {
    const [width, height] = process.env.SCREEN_RESOLUTION.split('x');
    await driver.manage().window().setRect({ width: parseInt(width, 10), height: parseInt(height, 10) });
  }

  return driver;
}