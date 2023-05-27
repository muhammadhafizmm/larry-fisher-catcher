import { DOCUMENT, STEIN_PATH } from "./constants";
import * as SteinStore from "stein-js-client"

const collections = new SteinStore(STEIN_PATH);

export function getList() {
  collections
    .read(DOCUMENT.LIST)
    .catch((error) => {
      console.warn(error);
    });
}
