import * as moment from "moment";

export const getEndOfDay = (date: string): Date => {
  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  return endOfDay;
};

export const getStartOfDay = (date: string): Date => {
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);

  return startOfDay;
};

export const isValidDate = (date: string, format: string = "YYYY-MM-DD"): boolean => {
  return moment(date, format, false).isValid();
}