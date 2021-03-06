/**
 * 钱包列表页面展示所有钱包
 */
// ======================================================导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { GlobalWallet } from '../../../core/globalWallet';
import { find, register } from '../../../store/store';
import { getWalletByWalletId, popPswBox } from '../../../utils/tools';
import { getMnemonic } from '../../../utils/walletTools';
// ==========================================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class WalletList extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        register('walletList', registerWalletsFun);
        this.init();
    }

    public init() {
        // 获取钱包显示头像
        const walletList = find('walletList');
        const fromJSON = GlobalWallet.fromJSON;

        const curWallet = find('curWallet');
        this.state = {
            walletList,
            fromJSON,
            curWalletId: curWallet && curWallet.walletId
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public listItemClicked(walletId: string) {
        popNew('app-view-mine-walletManagement-walletManagement', { walletId });
    }

    public async backupClicked(walletId: string) {
        
        const walletList = find('walletList');
        const wallet = getWalletByWalletId(walletList, walletId);
        let passwd;
        if (!find('hashMap',wallet.walletId)) {
            passwd = await popPswBox();
            if (!passwd) return;
        }
        const close = popNew('app-components_level_1-loading-loading', { text: '导出中...' });
        try {
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

}
// ===========================================================本地
const registerWalletsFun = () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
};