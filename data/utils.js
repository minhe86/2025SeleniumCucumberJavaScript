import _ from "lodash";
import path from "path";
import fs from "fs";
import csv from "csv-parser";

class Product {
  constructor(productNo, productName, productPrice, productDescription) {
    this.productNo = productNo;
    this.productName = productName;
    this.productPrice = productPrice;
    this.productDescription = productDescription;
  }
}

export const readProductsCSV = async (filePath) => {
  return new Promise((resolve, reject) => {
    const products = [];
    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
      return reject(new Error(`CSV file is not found: ${filePath}`));
    }

    fs.createReadStream(absolutePath)
      .pipe(csv())
      .on("data", (row) => {
        const productNo = parseInt(row.productNo);
        const productName = row.productName;
        const productPrice = parseFloat(row.productPrice);
        const productDescription = row.productDescription;

        products.push(
          new Product(productNo, productName, productPrice, productDescription)
        );
      })
      .on("end", () => {
        resolve(products);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

export const getProducts = async (filePath) => {
  try {
    const products = await readProductsCSV(filePath);
    if (products && products.length > 0) {
      //   console.log("product[0]=", products[0].productNo);  // Access the first product
      return products;
    } else {
      console.log("No products found.");
    }
  } catch (error) {
    console.error("Error reading CSV:", error);
  }
};
