/**
 * 分红领取记录，挖矿记录
 */
// ================================ 导入
import { Json } from '../../../../pi/lang/type';
import { register } from '../../../../pi/util/res_mgr';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { find } from '../../../store/store';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class Dividend extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public setProps(props:Json,oldProps:Json) {
        super.setProps(props,oldProps);
        this.state = {};
        this.initData();
    }
    
    /**
     * 获取更新数据
     */
    public async initData() {
        if (this.props === 2) { // 挖矿记录列表
            const data = find('miningHistory');            
            this.state.data = data;
        } else {  // 分红记录列表
            const data = find('dividHistory');
            this.state.data = data;
        }        
        this.paint();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 滚动加载更多列表数据
     * h1 滚动条高度+滚动模块的可见高度=当前屏幕最底端高度
     * h2 最低端元素的绝对高度
     */
    // public getMoreList() {
    //     const h1 = document.getElementById('historylist').scrollTop + document.getElementById('historylist').offsetHeight; 
    //     const h2 = document.getElementById('more').offsetTop; 
    //     if (h2 - h1 < 20 && this.state.refresh) {
    //         this.state.refresh = false;
    //         console.log('加载中，请稍后~~~');
    //         setTimeout(() => {
    //             this.state.data.push({
                    
    //                 num:0.02,
    //                 time:'04-27 14:32:00',
    //                 total:'2.2'
    //             },{
                    
    //                 num:'0.032',
    //                 time:'04-24 14:32:00',
    //                 total:'7.2'
    //             },{
                    
    //                 num:'0.052',
    //                 time:'04-21 14:32:00',
    //                 total:'1.2'
    //             });
    //             this.state.refresh = true;
    //             this.paint();
    //         }, 1000);
    //     } 
    // }
}
register('dividHistory', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
register('miningHistory', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});