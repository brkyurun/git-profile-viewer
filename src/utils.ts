interface IQueryCache<K = string, V = unknown> {
  getValue(key: K): V | undefined;
  setValue(key: K, data: V): void;
  saveToLocalStorage(): void;
}

class QueryCache<K extends string, V> implements IQueryCache<K, V> {
  private cache: Map<K, V>;

  constructor() {
    const localData = localStorage.getItem("userCache") ?? null;
    this.cache = new Map<K, V>();

    if (localData === null) return;

    const dataJSON = JSON.parse(localData);
    const dataObject = Object.entries(dataJSON);
    for (const data of dataObject) {
      this.cache.set(data[0] as K, data[1] as V);
    }
  }

  private updateLocalStorage(): void {
    const jsonCache = JSON.stringify(Object.fromEntries(this.cache));
    localStorage.setItem("userCache", jsonCache);
  }

  getValue(key: K): V | undefined {
    return this.cache.get(key);
  }

  setValue(key: K, data: V): void {
    this.cache.set(key, data);
    this.updateLocalStorage();
  }

  saveToLocalStorage(): void {
    this.updateLocalStorage();
  }
}

export { QueryCache };
