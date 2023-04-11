type Primitive = string | number | boolean | symbol | undefined | null;

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

type PersistCallback = (key: string, value: Primitive) => void;


function getNestedKey(obj: any, prop: PropertyKey): string {
  const keys = [];
  while (obj !== null) {
    keys.push(prop.toString());
    prop = Reflect.getPrototypeOf(obj);
    obj = Reflect.getPrototypeOf(obj);
  }
  return keys.reverse().join(".");
}

function getHandler(callback: (nestedKey: string, value: any) => void) {
  return {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof value === "object" && value !== null) {
        return new Proxy(value, getHandler(callback));
      }
      return value;
    },
    set(target, prop, value, receiver) {
      const result = Reflect.set(target, prop, value, receiver);
      if (result) {
        const key = getNestedKey(receiver, prop);
        callback(key, value);
      }
      return result;
    },
  }
}

function createPersistedProxy<T extends object>(
  obj: T,
  persist: PersistCallback
): T {
  return new Proxy(obj, getHandler(persist));
}
