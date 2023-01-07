import { Table } from "./types";

export function arrayToTable<T extends { id: string }>(
  data: T[],
  itemUpdater?: (item: T, acc: Table<T>) => T
) {
  return data.reduce(
    (acc: Table<T>, item) => {
      acc.ids.push(item.id);

      if (itemUpdater) {
        item = itemUpdater(item, acc);
      }

      acc.items[item.id] = item;

      return acc;
    },
    {
      ids: [],
      items: {},
    }
  );
}
