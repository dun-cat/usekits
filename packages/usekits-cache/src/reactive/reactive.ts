import fs from 'fs';
import path from 'path';
import 'reflect-metadata';

export const MK_PERSIST_CACHE_PATH = Symbol('persist-cache-path');

type Primitive = string | number | boolean | undefined | null;
type Value = Primitive | Value[] | { [key: string]: Value };

type ReactiveObject<T> = {
  [P in keyof T]: T[P] extends Value ? T[P] : ReactiveObject<T[P]>;
};

type Reactive<T> = ReactiveObject<T> & {
  $isReactive: boolean;
  $proxy: T;
  $raw: T;
};

function createReactive<T extends object>(obj: T, persist = false, filePath: string): Reactive<T> {
  const isObject = (val: unknown) => val !== null && typeof val === 'object';

  const reactiveHandler: ProxyHandler<T> = {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver) as object;
      if (isObject(value)) {
        return createReactive(value, persist, filePath).$proxy;
      }
      return value;
    },
    set(target, key, value, receiver) {
      const oldValue = Reflect.get(target, key, receiver);
      const result = Reflect.set(target, key, value, receiver);
      if (oldValue !== value && persist) {
        saveToFile(filePath, obj);
      }
      return result;
    },
  };

  const proxy = new Proxy(obj, reactiveHandler);
  const reactiveObj: Reactive<T> = {
    ...proxy,
    $isReactive: true,
    $proxy: proxy,
    $raw: obj,
  };
  return reactiveObj;
}

function saveToFile(filePath: string, data: object) {
  const content = JSON.stringify(data);
  fs.writeFileSync(filePath, content, { flag: 'w' });
}

function loadFromFile(filePath: string): object {
  const content = fs.readFileSync(filePath, { flag: 'a+' }).toString();
  try {
    return JSON.parse(content);
  } catch (e) {
    return {};
  }
}

interface PersistOptions {
  persist?: boolean; // 是否需要持久化，默认为 true
  path?: string; // 文件路径，默认为类名 + 属性名 + '.json'
}

function createReactiveDecorator(options?: PersistOptions) {
  return function Reactive<T extends { new(...args: any[]): {} }>(constructor: T) {
    const { persist = false, path } = options;

    Reflect.defineMetadata(MK_PERSIST_CACHE_PATH, "persistCacheFile", constructor);
    return class extends constructor {
      filePath: string;
      $data: Reactive<InstanceType<T>>;

      constructor(...args: any[]) {
        super(...args);
        const persistCacheFile = Reflect.getMetadata(MK_PERSIST_CACHE_PATH, constructor.prototype);
        if (persist) {
          if (!path) {
            console.log('请提供 path');
            return;
          }
          this.filePath = path;
          const data = loadFromFile(path) as InstanceType<T>;
          this.$data = createReactive(data, persist, this.filePath);
          Object.assign(this, this.$data.$proxy);
        }
      }
    };
  }
}



export { createReactiveDecorator };
