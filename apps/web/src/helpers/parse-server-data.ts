export function parseServerData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
