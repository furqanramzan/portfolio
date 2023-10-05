type OrderData = {
  data: {
    order: number;
  };
}[];
export function sortByOrder<T extends OrderData>(data: T) {
  return data.sort((a, b) => (a.data.order > b.data.order ? 1 : -1));
}

type DateData = {
  data: {
    date: Date;
  };
}[];
export function sortByDate<T extends DateData>(data: T) {
  return data.sort((a, b) =>
    a.data.date.getTime() > b.data.date.getTime() ? 1 : -1,
  );
}
