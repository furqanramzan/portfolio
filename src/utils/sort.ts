type Data = {
  data: {
    order: number;
  };
}[];

export function sortByOrder<T extends Data>(data: T) {
  return data.sort((a, b) => (a.data.order > b.data.order ? 1 : -1));
}
