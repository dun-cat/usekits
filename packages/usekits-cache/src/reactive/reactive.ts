import fs from 'fs';
import path from 'path';
import { merge } from 'webpack-merge';

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

function createReactive<T extends object>(obj: T, flush: (changedValue: any) => void): Reactive<T> {
  const isObject = (val: unknown) => val !== null && typeof val === 'object';

  const reactiveHandler: ProxyHandler<T> = {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver) as object;
      if (isObject(value)) {
        return createReactive(value, flush).$proxy;
      }
      return value;
    },
    set(target, key, value, receiver) {
      const oldValue = Reflect.get(target, key, receiver);
      const result = Reflect.set(target, key, value, receiver);

      if (oldValue !== value) {
        flush(value);
        // saveToFile(filePath, obj);
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

  try {
    // 检查目录是否存在，如果不存在则创建目录
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 检查JSON文件是否存在，如果不存在则创建文件
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '{}');
      return {};
    }
    const content = fs.readFileSync(filePath, { flag: 'a+' }).toString();

    return JSON.parse(content);
  } catch (e) {
    return {};
  }
}

interface ReactiveOptions {
  persist?: boolean; // 是否需要持久化，默认为 true
  path?: string; // 文件路径，默认为类名 + 属性名 + '.json'
}

function createReactiveDecorator(options?: ReactiveOptions) {
  return function Reactive<T extends { new(...args: any[]): {} }>(constructor: T) {
    const { persist = false, path } = options;
    return class extends constructor {
      $data: Reactive<InstanceType<T>>;

      constructor(...args: any[]) {
        super(...args);

        const data = persist ? loadFromFile(path) as InstanceType<T> : {};
        const mergedData: any = merge(this, data);

        function flush(changedValue?: any) {
          saveToFile(path, mergedData)
        }

        this.$data = createReactive(mergedData, flush);

        Object.assign(this, this.$data.$proxy);
      }
    };
  }
}

export { createReactiveDecorator };
