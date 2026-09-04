import { parseDate } from "@internationalized/date";

import { PROPERTIES } from "../pages/detailEmployee/constant";

export function formatDataDetail(detail, data) {
  return PROPERTIES[detail].map((i) => {
    const value = data[i.properties]?.nama || data[i.properties] || "-";

    const newData = { ...i, value };

    if (i.form === "checkbox") newData.value = data[i.properties] || false;

    return newData;
  });
}

export const formatDateIndonesia = (dateString) => {
  if (!dateString) return "-";

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "-";

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);

    return "-";
  }
};

export function capitalizeWords(str = "") {
  return str
    .toLowerCase()
    .replace(/(^|[\s\-'])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase());
}

export const buildInitialValue = (data) =>
  (Array.isArray(data) ? data : []).reduce((acc, item) => {
    const rawValue = item.value;

    if (item.form === "checkbox") {
      acc[item.properties] = Boolean(rawValue);

      return acc;
    }

    if (rawValue === "-" || rawValue === null || rawValue === undefined) {
      acc[item.properties] = "";

      return acc;
    }

    acc[item.properties] = rawValue;

    return acc;
  }, {});

export const toCalendarDate = (value) => {
  if (!value || typeof value !== "string") return null;

  try {
    return parseDate(value);
  } catch {
    return null;
  }
};

/**
 * Format NPWP number to XX.XXX.XXX.X-XXX.XXX format
 * @param {string} value - Input value
 * @returns {string} - Formatted NPWP
 */
export const formatNPWP = (value) => {
  if (!value) return "";

  const digits = value.replace(/\D/g, "");

  const limited = digits.slice(0, 15);

  let formatted = "";

  for (let i = 0; i < limited.length; i++) {
    if (i === 2 || i === 5 || i === 8) {
      formatted += ".";
    } else if (i === 9) {
      formatted += "-";
    }
    formatted += limited[i];
  }

  return formatted;
};

/**
 * Remove NPWP formatting (get raw digits only)
 * @param {string} value - Formatted NPWP
 * @returns {string} - Raw digits
 */
export const unformatNPWP = (value) => {
  if (!value) return "";

  return value.replace(/\D/g, "");
};

/**
 * Validate NPWP format
 * @param {string} value - NPWP value
 * @returns {boolean} - Is valid
 */
export const isValidNPWP = (value) => {
  const digits = value.replace(/\D/g, "");

  return digits.length === 15;
};
