export const deepCopy = <T>(data: T): T => JSON.parse(JSON.stringify(data));
