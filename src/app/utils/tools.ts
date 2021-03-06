/**
 * common tools
 */
import { ArgonHash } from '../../pi/browser/argonHash';
import { popNew } from '../../pi/ui/root';
import { Cipher } from '../core/crypto/cipher';
import { Addr } from '../store/interface';
import { find, updateStore } from '../store/store';
import { supportCurrencyList } from './constants';

export const depCopy = (v: any): any => {
    return JSON.parse(JSON.stringify(v));
};

export const sleep = (delay) => {
    const startTime = new Date().getTime();
    let loop = true;
    while (loop) {
        const endTime = new Date().getTime();
        if (endTime - startTime > delay) {
            loop = false;
        }
    }
};

/**
 * 获取指定id的钱包
 */
export const getWalletByWalletId = (wallets, walletId) => {
    if (!(wallets && wallets.length > 0)) return null;
    for (let i = 0; i < wallets.length; i++) {
        if (wallets[i].walletId === walletId) return wallets[i];
    }

    return null;
};

/**
 * 获取指定id钱包的index
 */
export const getWalletIndexByWalletId = (wallets, walletId) => {
    if (!(wallets && wallets.length > 0)) {
        return -1;
    }
    for (let i = 0; i < wallets.length; i++) {
        if (wallets[i].walletId === walletId) return i;
    }

    return -1;
};

/**
 * 获取当前钱包对应货币正在使用的地址信息
 * @param currencyName 货币类型
 */
export const getCurrentAddrInfo = (currencyName: string) => {
    const addrs = find('addrs');
    const wallet = find('curWallet');
    const currencyRecord = wallet.currencyRecords.filter(item => item.currencyName === currencyName)[0];
    // tslint:disable-next-line:no-unnecessary-local-variable
    const addrInfo = addrs.filter(item => item.addr === currencyRecord.currentAddr && item.currencyName === currencyName)[0];

    return addrInfo;
};
/**
 * 通过地址id获取地址信息
 * @param addrId  address id
 */
export const getAddrById = (addrId: string, currencyName: string): Addr => {
    const list: Addr[] = find('addrs') || [];

    return list.filter(v => v.addr === addrId && v.currencyName === currencyName)[0];
};

/**
 * 通过地址id重置地址
 * @param addrId address id
 * @param data  新地址
 * @param notified 是否通知数据发生改变 
 */
export const resetAddrById = (addrId: string, currencyName: string, data: Addr, notified?: boolean) => {
    let list: Addr[] = find('addrs') || [];
    list = list.map(v => {
        if (v.addr === addrId && v.currencyName === currencyName) return data;

        return v;
    });
    updateStore('addrs', list);
};

/**
 * 获取钱包下的所有地址
 * @param wallet wallet obj
 */
export const getAddrsAll = (wallet) => {
    const currencyRecords = wallet.currencyRecords;
    const retAddrs = [];
    currencyRecords.forEach((item) => {
        retAddrs.push(...item.addrs);
    });

    // 去除数组中重复的地址
    return [...new Set(retAddrs)];
};

/**
 * 获取钱包下指定货币类型的所有地址
 * @param wallet wallet obj
 */
export const getAddrsByCurrencyName = (wallet: any, currencyName: string) => {
    const currencyRecords = wallet.currencyRecords;
    const retAddrs = [];
    const len = currencyRecords.length;
    for (let i = 0; i < len; i++) {
        if (currencyRecords[i].currencyName === currencyName) {
            retAddrs.push(...currencyRecords[i].addrs);
            break;
        }
    }

    return retAddrs;
};
// 随机生成RGB颜色
export const randomRgbColor = () => { 
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return `rgb(${r},${g},${b})`; // 返回rgb(r,g,b)格式颜色
};

/**
 * 解析显示的账号信息
 * @param str 需要解析的字符串
 */
export const parseAccount = (str: string) => {
    if (str.length <= 29) return str;

    return `${str.slice(0, 8)}...${str.slice(str.length - 8, str.length)}`;
};

export const getDefaultAddr = (addr: number | string) => {
    const addrStr = addr.toString();

    return `${addrStr.slice(0, 3)}...${addrStr.slice(-3)}`;
};

/**
 * 转化显示时间
 * @param t date
 */
export const parseDate = (t: Date) => {
    // tslint:disable-next-line:max-line-length
    return `${t.getUTCFullYear()}-${addPerZero(t.getUTCMonth() + 1, 2)}-${addPerZero(t.getUTCDate(), 2)} ${addPerZero(t.getHours(), 2)}:${addPerZero(t.getMinutes(), 2)}`;
};

/**
 * 转化显示时间格式为‘04-30 14:32:00’
 */
export const transDate = (t: Date) => {
    // tslint:disable-next-line:max-line-length
    return `${addPerZero(t.getUTCMonth() + 1, 2)}-${addPerZero(t.getUTCDate(), 2)} ${addPerZero(t.getHours(), 2)}:${addPerZero(t.getMinutes(), 2)}:${addPerZero(t.getSeconds(), 2)}`;
};

/**
 * 数字前边加0
 */
const addPerZero = (num: number, len: number) => {
    const numStr = num.toString();
    const perLen = len - numStr.length;
    if (perLen <= 0) return numStr;
    const list = [];
    list.length = perLen;

    return list.fill('0').join('') + numStr;
};

// 数组乱序
export const shuffle = (arr: any[]): any[] => {
    const length = arr.length;
    const shuffled = Array(length);
    for (let index = 0, rand; index < length; index++) {
        rand = ~~(Math.random() * (index + 1));
        if (rand !== index) {
            shuffled[index] = shuffled[rand];
        }
        shuffled[rand] = arr[index];
    }

    return shuffled;
};

/**
 * 获取字符串有效长度
 * @param str 字符串
 * 
 * 中文字符算2个字符
 */
export const getStrLen = (str): number => {
    if (str === null) return 0;
    if (typeof str !== 'string') {
        str += '';
    }

    return str.replace(/[^\x00-\xff]/g, '01').length;
};

/**
 * 截取字符串
 * @param str 字符串
 * @param start 开始位置
 * @param len 截取长度
 */
export const sliceStr = (str, start, len): string => {
    if (str === null) return '';
    if (typeof str !== 'string') str += '';
    let r = '';
    for (let i = start; i < str.length; i++) {
        len--;
        if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
            len--;
        }

        if (len < 0) break;
        r += str[i];
    }

    return r;
};

// 函数防抖
export const debounce = (fn, wait = 1000) => {
    let timer = null;

    return (...rest) => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(() => {
            fn(...rest);
        }, wait);
    };
};

/**
 * 解析url中指定key的值
 * @param url url地址
 * @param key 键
 */
export const urlParams = (url: string, key: string) => {
    const ret = url.match(new RegExp(`(\\?|&)${key}=(.*?)(&|$)`));

    return ret && decodeURIComponent(ret[2]);
};

/**
 * 金额格式化
 * @param banlance 金额
 */
export const formatBalance = (banlance: number) => {
    if (!banlance) return 0;

    return Number(banlance.toFixed(6));
};

/**
 * 字符串转u8Arr
 * 
 * @param str 输入字符串
 */
export const str2arr = (str) => {
    const len = str.length;
    const arr = [];
    let arr32;
    let i;
    let offset = 0;
    if (len >= 32) {
        for (i = 0; i < 8; i++) {
            arr[i] = ((str.charCodeAt(i * 4) & 0xff) << 24)
                | ((str.charCodeAt(i * 4 + 1) & 0xff) << 16)
                | ((str.charCodeAt(i * 4 + 2) & 0xff) << 8)
                | (str.charCodeAt(i * 4 + 3) & 0xff);
        }
    }
    arr32 = new Uint32Array(new ArrayBuffer(32));
    for (i = 0; i < 8; i++) {
        arr32[i] = arr[offset++];
    }

    return new Uint8Array(arr32.buffer, 0, 32);
};
/**
 * u16Arr转字符串
 * 
 * @param buf 输入buff
 */
export const ab2str = (buf) => {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
};

/**
 * 字符串转u16Arr
 * 
 * @param str 输入字符串
 */
export const str2ab = (str) => {
    const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    const bufView = new Uint16Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }

    return buf;
};

/**
 * 字节数组转十六进制字符串
 * @param arr 传入数组
 */
export const bytes2Str = (arr) => {
    let str = '';
    for (let i = 0; i < arr.length; i++) {
        let tmp = arr[i].toString(16);
        if (tmp.length === 1) {
            tmp = `0${tmp}`;
        }
        str += tmp;
    }

    return str;
};

/**
 * 十六进制字符串转字节数组
 * @param str 传入字符串
 */
export const str2Bytes = (str) => {
    let pos = 0;
    let len = str.length;
    if (len % 2 !== 0) return null;

    len /= 2;
    const hexA = [];
    for (let i = 0; i < len; i++) {
        const s = str.substr(pos, 2);
        const v = parseInt(s, 16);
        hexA.push(v);
        pos += 2;
    }

    return hexA;
};

/**
 * 十六进制字符串转u8数组
 * 
 * @param str 输入字符串
 */
export const hexstrToU8Array = (str: string) => {
    if (str.length % 2 > 0) str = `0${str}`;

    const r = new Uint8Array(str.length / 2);
    for (let i = 0; i < str.length; i += 2) {
        const high = parseInt(str.charAt(i), 16);
        const low = parseInt(str.charAt(i + 1), 16);
        r[i / 2] = (high * 16 + low);
    }

    return r;
};

/**
 * u8数组转十六进制字符串
 * 
 * @param u8Array 输入数组
 */
export const u8ArrayToHexstr = (u8Array: Uint8Array) => {
    let str = '';
    for (let i = 0; i < u8Array.length; i++) {
        str += Math.floor(u8Array[i] / 16).toString(16);
        str += (u8Array[i] % 16).toString(16);
        // str += u8Array[i].toString(16);
    }
    if (str[0] === '0') str = str.slice(1);

    return str;
};

/**
 * 简化加密助记词
 * 
 * @param cipherMnemonic 加密助记词
 */
export const simplifyCipherMnemonic = (cipherMnemonic: string) => {
    const r = JSON.parse(cipherMnemonic);
    const newJson = { iv: r.iv, ct: r.ct, salt: r.salt };

    return JSON.stringify(newJson);
};

/**
 * 还原加密助记词
 * 
 * @param cipherMnemonic 加密助记词
 */
export const reductionCipherMnemonic = (cipherMnemonic: string) => {
    const r = JSON.parse(cipherMnemonic);
    const newJson = {
        iv: r.iv, ct: r.ct, salt: r.salt, v: 1, iter: 10000, ks: 128, ts: 64
        , mode: 'ccm', adata: '', cipher: 'aes', keySize: 128, tagSize: 64
    };

    return JSON.stringify(newJson);
};

/**
 * 余额格式化
 */
export const formatBalanceValue = (value: number) => {
    return value.toFixed(2);
};

/**
 * 获取指定货币下余额总数
 * @param addrs 指定货币下的地址
 * @param currencyName 货币名称
 */
export const fetchBalanceOfCurrency = (addrs: string[], currencyName: string) => {
    const localAddrs = find('addrs');
    let balance = 0;
    localAddrs.forEach(item => {
        if (addrs.indexOf(item.addr) >= 0 && item.currencyName === currencyName) {
            balance += item.balance;
        }
    });

    return balance;
};

/**
 * 获取总资产
 */
export const fetchTotalAssets = () => {
    const wallet = find('curWallet');
    if (!wallet) return;
    let totalAssets = 0;
    wallet.currencyRecords.forEach(item => {
        if (wallet.showCurrencys.indexOf(item.currencyName) >= 0) {
            const balance = fetchBalanceOfCurrency(item.addrs, item.currencyName);
            totalAssets += balance * find('exchangeRateJson',item.currencyName).CNY;
        }
        
    });

    return totalAssets;
};
/**
 * 获取异或值
 * @param first 前段
 * @param second 后段
 */

export const getXOR = (first, second) => {
    if (first.length !== second.length) return '';

    const arr = [];
    for (let i = 0; i < first.length; i++) {
        const m = parseInt(first.substr(i, 1), 16);
        const k = parseInt(second.substr(i, 1), 16);
        arr.push((m ^ k).toString(16));
    }

    return arr.join('');
};

// 复制到剪切板
export const copyToClipboard = (copyText) => {
    const input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', copyText);
    input.setAttribute('style', 'position:absolute;top:-9999px;');
    document.body.appendChild(input);
    input.setSelectionRange(0, 9999);
    input.select();
    if (document.execCommand('copy')) {
        document.execCommand('copy');
    }
    document.body.removeChild(input);
};

/**
 * 获取memery hash
 */
export const calcHashValuePromise = async (pwd, salt, walletId, useCache: boolean = true) => {
    let hash;
    if (useCache && walletId) {
        hash = find('hashMap',walletId);
        if (hash) return hash;
    }

    const argonHash = new ArgonHash();
    argonHash.init();
    // tslint:disable-next-line:no-unnecessary-local-variable
    hash = await argonHash.calcHashValuePromise({ pwd, salt });

    return hash;
};

/**
 * 基础打开弹窗界面封装
 */
export const openBasePage = (foreletName: string, foreletParams: any = {}): Promise<string> => {

    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {
        popNew(foreletName, foreletParams, (ok: string) => {
            // this.windowSet.delete(foreletName);
            resolve(ok);
        }, (cancel: string) => {
            // this.windowSet.delete(foreletName);
            reject(cancel);
        });

    });
};

export const popPswBox = async () => {
    try {
        // tslint:disable-next-line:no-unnecessary-local-variable
        const psw = await openMessageboxPsw();

        return psw;
    } catch (error) {
        return;
    }
};

/**
 * 打开密码输入框
 */
const openMessageboxPsw = (): Promise<string> => {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {
        popNew('app-components-message-messageboxPrompt', { title: '输入密码', content: '', inputType: 'password' }, (ok: string) => {
            // this.windowSet.delete(foreletName);
            resolve(ok);
        }, (cancel: string) => {
            // this.windowSet.delete(foreletName);
            reject(cancel);
        });

    });
};

// 计算字符串长度包含中文 中文长度加2 英文加1
export const getByteLen = (val) => {
    let len = 0;
    for (let i = 0; i < val.length; i++) {
        const a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) !== null) {
            len += 2;
        } else {
            len += 1;
        }
    }

    return len;
};

// 计算支持的币币兑换的币种
export const currencyExchangeAvailable = () => {
    const shapeshiftCoins = find('shapeShiftCoins');
    const currencyArr = [];
    for (let i = 0; i < supportCurrencyList.length; i++) {
        currencyArr.push(supportCurrencyList[i].name);
    }

    return shapeshiftCoins.filter(item => {
        return item.status === 'available' && currencyArr.indexOf(item.symbol) >= 0;
    });
};

// 根据货币名获取当前正在使用的地址
export const getCurrentAddrByCurrencyName = (currencyName: string) => {
    const wallet = find('curWallet');
    const currencyRecords = wallet.currencyRecords;
    let curAddr = '';

    for (let i = 0; i < currencyRecords.length; i++) {
        if (currencyRecords[i].currencyName === currencyName) {
            curAddr = currencyRecords[i].currentAddr;
            break;
        }
    }

    return curAddr;
};

// 根据货币名获取当前正在使用的地址的余额
export const getCurrentAddrBalanceByCurrencyName = (currencyName: string) => {
    const curAddr = getCurrentAddrByCurrencyName(currencyName);
    console.log('curAddr',curAddr);
    const addrs = find('addrs');
    for (let i = 0; i < addrs.length; i++) {
        if ((addrs[i].currencyName === currencyName) && (addrs[i].addr === curAddr)) {
            return addrs[i].balance;
        }
    }
};
// 时间戳格式化 毫秒为单位
export const timestampFormat = (timestamp: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`;
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
    const hour = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
    const minutes = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
    const seconds = date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;

    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
};

// 获取当前钱包第一个ETH地址
export const getFirstEthAddr = () => {
    const wallet = find('curWallet');
    if (!wallet) return;
    const currencyRecords = wallet.currencyRecords;
    for (let i = 0; i < currencyRecords.length; i++) {
        if (currencyRecords[i].currencyName === 'ETH') {
            return currencyRecords[i].addrs[0];
        }
    }
};

// unicode数组转字符串
export const unicodeArray2Str = (arr) => {
    let str = '';
    for (let i = 0; i < arr.length; i++) {
        str += String.fromCharCode(arr[i]);
    }

    return str;
};

/**
 * 添加交易记录到本地
 */
export const addRecord = (currencyName, currentAddr, record) => {
    const addr = getAddrById(currentAddr, currencyName);
    if (!addr) return;
    addr.record.push(record);

    resetAddrById(currentAddr, currencyName, addr, true);
};

/**
 * 计算日期间隔
 */
export const GetDateDiff = (startDate,endDate) => {
    let Y =   `${startDate.getFullYear()}-`;
    let M =   `${(startDate.getMonth() + 1 < 10 ? `0${(startDate.getMonth() + 1)}` : startDate.getMonth() + 1)}-`;
    let D = `${startDate.getDate()}`;
    startDate = new Date(`${Y}${M}${D}`); 
    const startTime = startDate.getTime();  
    Y =   `${endDate.getFullYear()}-`;
    M =   `${(endDate.getMonth() + 1 < 10 ? `0${(endDate.getMonth() + 1)}` : endDate.getMonth() + 1)}-`;
    D = `${endDate.getDate()}`;
    endDate = new Date(`${Y}${M}${D}`); 
    const endTime = endDate.getTime();

    return  Math.floor(Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24));    
};

// 时间戳格式化 毫秒为单位
export const timestampFormatToDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`;
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
    
    return `${year}-${month}-${day}`;
};
// 加密盐值
const salt = 'KuPay';
/**
 * 密码加密
 * @param plainText 需要加密的文本
 */
export const encrypt = (plainText: string) => {
    const cipher = new Cipher();

    return cipher.encrypt(salt, plainText);
};

/**
 * 密码解密
 * @param cipherText 需要解密的文本
 */
export const decrypt = (cipherText: string) => {
    const cipher = new Cipher();

    return cipher.decrypt(salt, cipherText);
};

// hash256;
export const sha256 = (data: string) => {
    const cipher = new Cipher();

    return cipher.sha256(data);
};

// 锁屏密码验证
export const lockScreenVerify = (psw) => {
    const hash256 = sha256(psw + find('salt'));
    const localHash256 = find('lockScreen').psw;

    return hash256 === localHash256;
};
// 锁屏密码hash算法
export const lockScreenHash = (psw) => {
    return sha256(psw + find('salt'));
};
