import { Timestamp } from "firebase/firestore";

export default function toJavaScriptDate(value) {
  if (!value) {
    return value;
  }
  if (value.toDate && typeof value.toDate === 'function') {
    return value.toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'object' && value.seconds !== undefined) {
    return new Timestamp(value.seconds, value.nanoseconds || 0).toDate();
  }

  return new Date(value);
}