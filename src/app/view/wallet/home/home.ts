/**
 * wallet home page
 */
// ============================== 导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { GlobalWallet } from '../../../core/globalWallet';
import { openAndGetRandom } from '../../../net/pull';
import { dataCenter } from '../../../store/dataCenter';
import { find, register } from '../../../store/store';
import { defalutShowCurrencys } from '../../../utils/constants';
import {
    fetchBalanceOfCurrency, fetchTotalAssets, formatBalance, formatBalanceValue, getMnemonic, openBasePage
} from '../../../utils/tools';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Home extends Widget {
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }

    public init(): void {
        const wallet = find('curWallet');
        const gwlt = wallet ? GlobalWallet.fromJSON(wallet.gwlt) : null;
        const otherWallets = !!wallet;
        this.state = {
            wallet,
            gwlt,
            otherWallets,
            totalAssets: 0.00,
            currencyList: parseCurrencyList(wallet),
            floatBoxTip: '为了您的资产安全，请及时备份助记词',
            hiddenAssets: false
        };

        // 如果没有创建钱包提示创建钱包
        if (!find('walletList')) {
            this.state.floatBoxTip = '您还没有钱包，请先创建钱包';
        }

        this.registerAddrsFun();
        // 登录云端账号
        openAndGetRandom();
    }
    public clickCurrencyItemListener(e: Event, index: number) {
        const wallets = find('walletList');
        if (!wallets || wallets.length === 0) {
            this.createWalletClick();

            return;
        }
        if (!find('curWallet')) {
            popNew('app-view-wallet-switchWallet-switchWallet');

            return;
        }
        const currency = this.state.currencyList[index];
        popNew('app-view-wallet-transaction-currency_details', {
            currencyName: currency.currencyName, currencyBalance: `${currency.balance} ${currency.currencyName}`
            , currencyBalanceConversion: currency.balanceValue
        });
    }
    public clickAddCurrencyListener() {
        popNew('app-view-wallet-assets-add_asset');
    }
    public createWalletClick() {
        if (this.state.otherWallets) {
            popNew('app-view-wallet-switchWallet-switchWallet');

            return;
        }
        popNew('app-view-wallet-walletCreate-createWalletEnter');
    }
    public switchWalletClick() {
        popNew('app-view-wallet-switchWallet-switchWallet');
    }
    // 点击备份钱包
    public async backupWalletClick() {
        const wallet = find('curWallet');
        if (!wallet) {
            this.createWalletClick();

            return;
        }
        const walletId = wallet.walletId;
        const close = popNew('pi-components-loading-loading', { text: '导出中...' });
        try {

            let passwd;
            if (!dataCenter.getHash(wallet.walletId)) {
                passwd = await openBasePage('app-components-message-messageboxPrompt', {
                    title: '输入密码', content: '', inputType: 'password'
                });
            }
            const mnemonic = await getMnemonic(wallet, passwd);
            if (mnemonic) {
                popNew('app-view-wallet-backupWallet-backupMnemonicWord', { mnemonic, passwd, walletId: walletId });
            } else {
                popNew('app-components-message-message', { itype: 'error', content: '密码错误,请重新输入', center: true });
            }
        } catch (error) {
            console.log(error);
            popNew('app-components-message-message', { itype: 'error', content: '密码错误,请重新输入', center: true });
        }
        close.callback(close.widget);
    }

    public hiddenAssetsClick() {
        this.state.hiddenAssets = !this.state.hiddenAssets;
        this.paint();
    }
    public registerWalletsFun = () => {
        // 创建完钱包之后修改floatBoxTip提示信息
        const wallets = find('walletList');
        const wallet = find('curWallet');
        if (wallet) {
            this.state.floatBoxTip = '为了您的资产安全，请及时备份助记词';
        }

        this.state.gwlt = wallet ? GlobalWallet.fromJSON(wallet.gwlt) : null;
        this.state.otherWallets = wallets && wallets.length > 0;
        this.state.wallet = wallet;
        this.state.currencyList = parseCurrencyList(wallet);
        this.registerAddrsFun();
        this.paint();
    }

    /**
     * 余额更新
     */
    private registerAddrsFun = () => {
        console.log('余额更新');
        const wallet = find('curWallet');
        if (!wallet) return;

        wallet.currencyRecords.forEach(item => {
            const balance = fetchBalanceOfCurrency(item.addrs, item.currencyName);
            setCurrencyListBalance(this.state.currencyList, balance, item.currencyName);
        });
        this.state.totalAssets = formatBalanceValue(fetchTotalAssets());

        this.paint();
    }
}
// ============================== 本地
/**
 * 解析钱包货币
 * 
 * @param wallet 钱包
 */
const parseCurrencyList = (wallet) => {
    const list = [];
    // todo 测试代码  不处理没有的情况
    // if (!wallet.showCurrencys) return list;
    const showCurrencys = (wallet && wallet.showCurrencys) || defalutShowCurrencys;
    // todo  这里需要正确的处理钱包货币
    find('currencyList').forEach(v => {
        if (showCurrencys.indexOf(v.name) < 0) return;
        list.push({
            currencyName: v.name,
            currencyFullName: v.description,
            balance: 0,
            balanceValue: 0.00
        });
    });

    return list;
};

const setCurrencyListBalance = (currencyList: any[], balance: number, currencyName: string) => {
    return currencyList.map(item => {
        if (item.currencyName === currencyName) {
            const rate = dataCenter.getExchangeRate(currencyName);
            item.balance = formatBalance(balance);
            item.balanceValue = formatBalanceValue(+(balance * rate.CNY));
        }

        return item;
    });
};

register('curWallet', (resp) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.registerWalletsFun(resp);
    }
});

register('addrs', (resp) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.registerAddrsFun();
    }
});

register('curWallet', (curWallet) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        const wallet = curWallet;
        const gwlt = wallet ? GlobalWallet.fromJSON(wallet.gwlt) : null;
        w.state.wallet = wallet;
        w.state.gwlt = gwlt;
        w.paint();
    }
});
/**
 * 矿山增加项目进入创建钱包页面
 */
register('mineItemJump',(arg) => {
    if (arg === 'walletCreate') {
        popNew('app-view-wallet-walletCreate-createWalletEnter');
    }
});