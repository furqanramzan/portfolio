export function removeUndefined<T>(name?: T) {
  if (!name) {
    throw new Error('404');
  }
  return name;
}
