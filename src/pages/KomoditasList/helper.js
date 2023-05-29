import { toTitleCase } from "../../utils/string";

export function addHistoryDataToStorage(str) {
  const data = toTitleCase(str);
  let historyData = localStorage.getItem("history-data");
  if (historyData) {
    historyData = JSON.parse(historyData);
    if (Array.isArray(historyData) && !historyData.includes(data)) {
      if (historyData.length === 10) {
        historyData.shift();
      }
      historyData.push(data);
    }
  } else {
    historyData = [data];
  }
  localStorage.setItem("history-data", JSON.stringify(historyData));
}

export function constructSearchQuery(
  komoditas,
  area_provinsi,
  area_kota,
  size
) {
  return `?${komoditas ? `komoditas=${komoditas}&` : ""}${
    area_provinsi && area_kota
      ? `province=${area_provinsi}&city=${area_kota}&`
      : ""
  }${size ? `size=${size}` : ""}`;
}
