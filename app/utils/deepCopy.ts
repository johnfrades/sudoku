export const deepCopy = <T>(data: Object | Array<T>): T =>
  JSON.parse(JSON.stringify(data));
