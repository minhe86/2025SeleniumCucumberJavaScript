import { setWorldConstructor } from '@cucumber/cucumber';

setWorldConstructor(function ({attach}) {
  this.driver = null;
  this.timeout = 0;
  this.attach = attach;
  this.products = [];
});
