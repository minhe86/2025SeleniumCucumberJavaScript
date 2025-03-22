class Component {
  static async create(...args) {
    const component = new this(...args);
    await component.waitForDisplayed();
    return component;
  }

  async waitForDisplayed() {
    throw new Error(
      `${this.constructor.name}.waitForDisplayed is not implemented.`
    );
  }

  async verifyPageDetails() {
    throw new Error(
      `${this.constructor.name}.verifyPageDetails is not implemented.`
    );
  }
}

export default Component;
