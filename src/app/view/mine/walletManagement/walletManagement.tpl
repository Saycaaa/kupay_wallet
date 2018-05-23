<div class="ga-new-page" ev-back-click="backPrePage" >
    <div w-class="ga-top-banner">
        <app-components-topBar-topBar>{title:""}</app-components-topBar-topBar>
        <div w-class="ga-card">
            <div w-class="ga-wallet-name-container">
                <span w-class="ga-wallet-name-dot" ></span>
                <input 
                    id="autoInput"
                    w-class="ga-input" 
                    value="{{it1.gwlt.nickName}}" 
                    on-blur="inputBlur"
                    on-focus="inputFocus"
                    style="border:{{it1.showInputBorder ? '1px solid #ccc' : 'none'}};margin-left:{{it1.showInputBorder ? '8px' : '0'}};"/>
            </div>
            <span w-class="ga-assets">≈$0.00</span>
        </div>
    </div>
    <div w-class="ga-bottom-container">
        <div w-class="ga-item" on-tap="">
            <span w-class="ga-item-text">修改密码</span>
            <span w-class="ga-item-arrow"></span>
        </div>
        {{if it1.pswTips.length > 0}}
        <div w-class="ga-item">
            <span w-class="ga-item-text">{{it1.showPswTips ? it1.pswTips : '********'}}</span>
            <div w-class="ga-psw-tips-container" on-tap="pswTipsClick">
                <span>密码提示</span>
                <img src="../../../res/image/u250.png" w-class="ga-img"/>
            </div>
        </div>
        {{end}}
        <div w-class="ga-item" on-tap="exportPrivateKeyClick">
            <span w-class="ga-item-text">导出私钥</span>
            <span w-class="ga-item-arrow"></span>
        </div>
        <div w-class="ga-item" on-tap="">
            <span w-class="ga-item-text">退出登录</span>
            <span w-class="ga-item-arrow"></span>
        </div>
    </div>
    {{if it1.mnemonicExisted}}
    <div w-class="ga-wallet-backup-btn" on-tap="backupMnemonic">备份助记词</div>
    {{end}}
    <div w-class="ga-delete-wallet">删除钱包</div>
</div>