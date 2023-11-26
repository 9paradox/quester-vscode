export function CloneObject<T>(source: T): T {
  return JSON.parse(JSON.stringify(source));
}
