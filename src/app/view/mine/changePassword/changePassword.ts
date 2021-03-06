/**
 * change password
 */
interface Props {
    passwd: string;
}
// ==============================================导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { GlobalWallet } from '../../../core/globalWallet';
import { find, updateStore } from '../../../store/store';
import { getWalletPswStrength, pswEqualed, walletPswAvailable } from '../../../utils/account';
import { getWalletByWalletId } from '../../../utils/tools';
// ==============================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class ChangePassword extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.init();
    }

    public init() {
        this.state = {
            style: 'backgroundColor: #FFF;fontSize: 24px;color: #8E96AB;lineHeight: 33px;borderBottom: 1px solid #c0c4cc;',
            newPassword: '',
            rePassword: '',
            strength: getWalletPswStrength('')
        };

    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public newPasswordChange(e: any) {
        this.state.newPassword = e.value;
        this.state.strength = getWalletPswStrength(this.state.newPassword);
        this.paint();
    }
    public rePasswordChange(e: any) {
        this.state.rePassword = e.value;
    }

    public async btnClicked() {
        const newPassword = this.state.newPassword;
        const rePassword = this.state.rePassword;
        const walletList = find('walletList');
        const wallet = getWalletByWalletId(walletList, this.props.walletId);
        if (!newPassword || !rePassword) {
            return;
        }
        // 判断两次输入的密码是否相同
        if (!pswEqualed(newPassword, rePassword)) {
            popNew('app-components-message-messagebox', { itype: 'alert', title: '提示！', content: '两次输入的密码不一致！' });

            return;
        }
        if (!walletPswAvailable(newPassword)) {
            popNew('app-components-message-messagebox', { itype: 'alert', title: '提示！', content: '密码不符合规则！密码至少8位字符，可包含英文、数字、特殊字符！' });

            return;
        }
        // 验证全部通过，开始设置新密码
        const loading = popNew('app-components_level_1-loading-loading', { text: '修改中...' });
        const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
        await gwlt.passwordChange(this.props.passwd, newPassword, this.props.walletId);
        wallet.gwlt = gwlt.toJSON();
        updateStore('walletList', walletList);
        loading.callback(loading.widget);
        this.backPrePage();
    }

}
