import { DOCUMENT, STEIN_PATH } from "./constants";
import * as SteinStore from "stein-js-client";

const collections = new SteinStore(STEIN_PATH);

export async function addProductDataToList(payload) {
  collections
    .append(DOCUMENT.LIST, [payload])
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.warn(error);
    });
}

export async function getProductList(payload) {
  return collections
    .read(DOCUMENT.LIST, payload)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.warn(error);
    });
}

export async function getProductSize() {
  return collections
    .read(DOCUMENT.OPTION_SIZE)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.warn(error);
    });
}

export async function getProductArea() {
  return collections
    .read(DOCUMENT.OPTION_AREA)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.warn(error);
    });
}
