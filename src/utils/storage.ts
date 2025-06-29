// 统一的localstore方法
/**
 * @description 存储器类型
 * @enum {number}
 */
export enum StorageType {
    localStorage,
    sessionStorage
}

/**
 * @description 获取存储引擎的方法
 * @param {StorageType} [type]
 * @returns {Storage}
 */
function getEngine(type?: StorageType):Storage {
    if (type === StorageType.sessionStorage) {
        return window.sessionStorage;
    }
    return window.localStorage;
}

/**
 * @description localstore 设置数据
 * @param {string} key
 * @param {(object|string|number|boolean)} value
 * @param {StorageType} [type]
 */
function set(key:string, value:Record<string, unknown>|string|number|boolean, type?: StorageType, expires?: number):void {
    let _value:string;
    let data;
    if (expires) {
        data = {
            value,
            __expires: expires + new Date().getTime(),
        };
    } else {
        data = value;
    }
    if (~['object', 'number', 'boolean'].indexOf(typeof data)) {
        _value = JSON.stringify(data);
    } else {
        _value = <string>data;
    }
    getEngine(type).setItem(key, _value);
}


/*
 * @description 获取方法
 * @param {string} key
 * @returns {(object|string|number|boolean)}
 * @param {StorageType} [type]
 */
function get(key:string, type?: StorageType):any {
    let res = getEngine(type).getItem(key);
    if (res === null) {
        return res;
    }
    try {
        // JSON.parse 可以将 '1'转成1; 'false'转成false
        const data = JSON.parse(res);
        if (typeof data === 'object' && data.__expires) {
            if (new Date().getTime() > data.__expires) {
                // 缓存数据过期, 清空缓存
                removeItem(key);
                return null;
            }
            return data.value;
        }
        return data;
    } catch (e) {
        return res;
    }
}

async function getAsync(key:string, type?:StorageType, getDataFunc?: (params?: any)=> Promise<any>, expires?: number): Promise<any> {
    const res = get(key, type);
    if (res === null && getDataFunc) {
        let value = await getDataFunc();
        set(key, value, type, expires);
        return value;
    }
    return res;
}

/**
 * @description 删除某个key方法
 * @param {string} key
 * @param {Type} [type]
 * @param {StorageType} [type]
 */
function removeItem(key:string, type?: StorageType):void {
    getEngine(type).removeItem(key);
}

function clear(type?:StorageType) {
    getEngine(type).clear();
}

interface StorageAPI {
    set: (key: string, value:any, expires?: number) => void;
    get: (key: string) => any;
    getAsync: (key: string, getDataFunc? : () => Promise<any>, expires?: number) => any;
    remove: (key: string) => void;
    clear: ()=> void
}

const getStorage = (type:StorageType): StorageAPI => ({
    set: (key, value, expires) => set(key, value, type, expires),
    get: (key) => get(key, type),
    getAsync: (key, getDataFunc, expires) => getAsync(key, type, getDataFunc, expires),
    remove: (key) => removeItem(key, type),
    clear: () => clear(type),
});

const session: StorageAPI = getStorage(StorageType.sessionStorage);
const local: StorageAPI = getStorage(StorageType.localStorage);

export {
    set,
    get,
    clear,
    removeItem,
    session,
    local
};
