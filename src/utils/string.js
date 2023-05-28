import moment from "moment";

// Mengubah string menjadi lowercase snake case
export function toLowerSnakeCase(str) {
  return str.toLowerCase().replace(/\s+/g, "_");
}

// Mengubah string menjadi title case
export function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// mengubah date dengan format
export function formatStringDate(str, format) {
  const date = moment(str);
  const formattedDate = date.format(format);
  return formattedDate;
}

export function formatObjectValueToDashCase(obj) {
  return toTitleCase(Object.values(obj).join(" - "));
}

// Mengubah string data menjadi IDR Currency
export function toIDRCurrency(str) {
  const number = parseInt(str.replace(/\D/g, ""));
  if (isNaN(number)) {
    return "NaN";
  }
  const currencyFormatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);

  return currencyFormatted;
}
