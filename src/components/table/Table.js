import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import SimpleTable from '../../components/table/SimpleTable';
import HardTable from '../../components/table/HardTable';
import * as utils from '../../utils/Format';

/**
 * data:{static:{}, source:'', search:''}
 * data数据层
 * static=>静态数据
 * source=>数据初始化url
 * search=>搜索数据url
 * view:{class:'', }
 * view界面层
 * class表格样式, 默认Hover，简单表格样式（Hover, Condensed, Bordered, Stripped）
 * isSimple: true简单表格, false复杂表格
 * operate操作层
 */
export default class Table extends Component {
// source: React.PropTypes.string,
//         search: React.PropTypes.string,
//         data: React.PropTypes.object,
    static propTypes = {
        data: React.PropTypes.object.isRequired,
        view: React.PropTypes.object.isRequired,
        operate: React.PropTypes.object
    }

    // static defaultProps = {
    //     view: {
    //         class: 'Hover',
    //         isSimple: true
    //     },
    //     class:{
    //         Hover: 'table table-hover',
    //         Condensed: 'table table-hover table-striped table-bordered table-condensed',
    //         Bordered: 'table table-bordered table-hover',
    //         Stripped: 'table table-hover table-striped table-bordered'
    //     }
    // };
    constructor(p) {
        super(p);
        const { view } = this.props;
        const stateDate = {
            view: {
                class: 'Hover',
                isSimple: false,
                with: {}
            },
            class: {
                Hover: 'table table-hover',
                Condensed: 'table table-hover table-striped table-bordered table-condensed',
                Bordered: 'table table-bordered table-hover',
                Stripped: 'table table-hover table-striped table-bordered',
                Editable: 'table table-striped table-hover table-bordered dataTable'
            },
            tdata: [],
            thead: [],
            tbody: {},
            operate: {
                sorts: [],
                searchs: [],
                checks: [],
                adds: [],
                toperates: [],
                others: []
            }
        };
        $.extend(true, stateDate, this.props);
        this.state = stateDate;
    }
    componentDidMount() {
        const { data, view } = this.state;
        const zhis = this;
        let footer = view.with.footer;
        if (data && typeof data === 'object') {
            if (data.static) {
                console.log('加载静态数据');
                console.log(data);
                let thead = [];
                if (data.thead) {
                    thead = data.thead;
                } else {
                    Object.keys(data.static).map((v, i) => {
                        if (i < 3) {
                            const x = { code: v };
                            x[v] = v;
                            thead.push(x);
                        }
                    });
                }
                if (!footer && typeof data.static === 'object' && data.static.items && data.static.count) {
                    footer = { pager: data.static };
                }
                this.setState({ tdata: data.static, thead, footer });
            } else if (data.source && typeof data.source === 'string') {
                console.log('加载ajax数据');
                this.setTableData(data, footer);
            } else {
                console.error('没有可初始化的数据来源');
            }
        } else {
            console.error('没有可初始化的数据来源');
        }
    }
    setTableData = (pd, footer, params, callback) => {
        utils.ajax({ url: pd.search || pd.source, data: params || {} }, (d) => {
            const thead = pd.thead;
            let tdata = [];
            if ($.isArray(d)) {
                tdata = d;
            } else if (pd.tbody && pd.tbody.source) {
                try {
                    tdata = eval(`d.${pd.tbody.source}`);
                } catch (e) {
                    console.error(e);
                    $.alert.error('获取数据失败');
                }
            } else if (d.items) {
                tdata = d.items;
            }

            if (!footer && typeof d === 'object' && d.items && d.count) {
                footer = { pager: d };
            }
            this.setState({ tdata, thead, footer }, callback);
        });
    }

    render() {
        const { view, tdata, thead, footer, operate, data } = this.state;
        const tclass = this.state.class[view.class] ? this.state.class[view.class] : view.class;

        return (<div>
            {
                view.isSimple ?
                    <SimpleTable location={this.props.location} class={tclass} header={view.with.header} footer={footer} pager={view.pager} width={view.width} tdata={tdata} thead={thead} page={this.page} />
                    :
                    <HardTable view={view} data={data} location={this.props.location} class={tclass} header={view.with.header} footer={footer} pager={view.pager} width={view.width} tdata={tdata} thead={thead} operate={operate} freshTbody={this.setTableData} />
            }
        </div>);
    }
}
