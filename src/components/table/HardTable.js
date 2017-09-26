import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// 操作按钮
import DropDownButton from '../../components/button/DropDownButton';
// 分页
import Pagnation from '../../components/Pagnation';
import * as utils from '../../utils/Format';
import Handlebars from 'handlebars';

export default class SimpleTable extends Component {
    static propTypes = {
    }

    constructor(p) {
        super(p);
        this.sortClass = this.sortClass.bind(this);
        this.state = {
            sortData: { current: '', cls: 'sorting' },
            operate: { others: { show: false } },
            page: { current: 1 },
            search: {}
        };
    }

    componentDidMount() {
        const { operate } = this.props;
        Handlebars.registerHelper(utils);
        // if(operate.search){
        //     $('#dataTable').InitiateEditableDataTable();
        // }
    }
    sortClass(code) {
        const { operate } = this.props;
        const { sortData } = this.state;
        let cls = '';
        if (operate.sorts && operate.sorts.length > 0) {
            const x = operate.sorts.find(a => a.code === code);
            if (sortData.current === code) {
                cls = sortData.cls;
            } else if (x) {
                cls = 'sorting';
            }
        }
        return cls;
    }
    sort = (e) => {
        const { operate, freshTbody, data, view } = this.props;
        const { sortData } = this.state;
        const sort = operate.sorts.find(a => a.code === $(e.target).data('code'));
        if (!sort) {
            return false;
        }
        const _data = utils.param($(this.refs.searchForm).serialize());
        _data.order = 'asc';
        if (sortData.current === sort.code) {
            if (sortData.cls === 'sorting_asc') {
                _data.order = 'desc';
            }
        }
        _data.sort = sort.code.replace(/_([a-z])/g, (d, f) => f.toUpperCase());
        freshTbody(data, view.with.footer, _data, (d) => {
            this.setState({ sortData: { cls: `sorting_${_data.order}`, current: sort.code } });
        });
    }

    remove(id) {
        const { operate: { toperates }, freshTbody, data, view } = this.props;
        const template = Handlebars.compile(toperates.find(a => a.code === 'delete').opt);
        const url = template({ id });
        const zhis = this;
        bootbox.confirm({
            buttons: {
                confirm: {
                    label: '确认',
                    className: 'btn-blue'
                },
                cancel: {
                    label: '取消',
                    className: 'btn-danger'
                }
            },
            message: '确认删除？',
            callback: (result) => {
                if (result) {
                    $.ajax({
                        url,
                        method: 'delete',
                        complete(e) {
                            if (e.status < 300) {
                                freshTbody(data, view.with.footer, {}, (d) => {
                                    zhis.setState({ sortData: { cls: 'sorting', current: '' } });
                                });
                            } else {
                                $.alert.error('删除失败');
                            }
                        }
                    });
                }
            }
        });
    }

    formatHbs(str, obj) {
        if (!str || typeof str !== 'string' || !obj || typeof obj !== 'object') {
            console.error(`formatHbs exception! str:${str}; obj:${obj}`);
            return '';
        }
        const template = Handlebars.compile(str);
        return template(obj);
    }

    handClickOthers = () => {
        this.setState({ operate: { others: { show: !this.state.operate.others.show } } });
    }
    handClickOther() {
        this.setState({ operate: { others: { show: false } } });
    }
    blurSearch = (e) => {
        const { freshTbody, data, view } = this.props;
        const { search } = this.state;
        const $e = $(e.target);
        const searchVal = search[$e.attr('name')];
        if (searchVal === $e.val()) {
            return false;
        }
        const _data = utils.param($(this.refs.searchForm).serialize());
        const zhis = this;
        freshTbody(data, view.with.footer, _data, (d) => {
            const x = { sortData: { cls: 'sorting', current: '' }, search };
            x.search[$e.attr('name')] = $e.val();
            zhis.setState(x);
        });
    }
    keyupSearch = (e) => {
        if (e.keyCode === 13) {
            this.blurSearch(e);
        }
    }
    page = (opts) => {
        const { data, view, freshTbody } = this.props;
        const { page: { current } } = this.state;
        const _data = utils.param($(this.refs.searchForm).serialize());
        if (opts.page && opts.page != current) {
            _data.page = opts.page;

            freshTbody(data, view.with.footer, _data, () => {
                this.setState({ page: { current: opts.page }, sortData: { cls: 'sorting', current: '' } });
            });
        }
    }

    render() {
        const { header, footer, width, thead, tdata, location, operate } = this.props;
        const { operate: { others } } = this.state;
        return (<div className="row">
            <div className={`col-xs-12 ${width || 'col-md-12'}`}>
                <div className={`well ${header ? ' with-header' : ''}${footer ? ' with-footer' : ''}`}>
                    {
                        header &&
                        <div className={`header ${header && header.background ? header.background : ''}`}>
                            {header.txt}
                        </div>
                    }
                    <div className="table-toolbar">
                        {
                            operate.adds && operate.adds.length > 0 &&
                            operate.adds.map((item, i) => {
                                if (item.link) {
                                    return <Link key={`opt_add_${i}`} to={this.formatHbs(item.link, item)} className={item.cls}><i className={item.icls} />{item.txt}</Link>;
                                }
                                return (<a key={`opt_add_${i}`} href="javascript:void(0);" className={item.cls}>
                                    {item.txt}
                                </a>);
                            })
                        }
                        {
                            operate.others && operate.others.length > 0 &&
                            <div className="DTTT btn-group" style={{ right: '40px', top: 'auto' }}>
                                <a onClick={this.handClickOthers} className="btn btn-default DTTT_button_collection" id="ToolTables_editabledatatable_2" tabIndex="0" aria-controls="editabledatatable">
                                    <span>其他 <i className="fa fa-angle-down" /></span>
                                </a>
                                <ul className={`DTTT_dropdown dropdown-menu${others.show ? '' : ' hide'}`} style={{ display: 'block', minWidth: '62px', left: '-16px' }}>
                                    {
                                        operate.others.map((item, i) => (
                                            <li key={`opt_other_${i}`} onClick={this.handClickOther} className="DTTT_button_csv" id="ToolTables_editabledatatable_3" tabIndex="0" aria-controls="editabledatatable">
                                                <a>{item.txt}</a>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        }
                    </div>
                    {
                        operate.searchs && operate.searchs.length > 0 &&
                        <form id="searchForm" ref="searchForm">
                            {
                                operate.searchs.map((item, i) => {
                                    if (!item.type || item.type === 'input') {
                                        return (<div key={`search_${i}`} className="dataTables_filter" style={{ display: 'inline-block', clear: 'both', marginRight: '30px' }}>
                                            <span style={{ marginRight: '8px', float: 'left', position: 'relative', top: '8px' }}>{item.label}</span>
                                            <label>
                                                <input type="search" onBlur={this.blurSearch} onKeyUp={this.keyupSearch} name={item.code} className="form-control input-sm" placeholder={item.placeholder} />
                                            </label>
                                        </div>);
                                    }
                                })
                            }
                        </form>
                    }
                    <table className={this.props.class} id="dataTable">
                        <thead className={this.props.class === 'Hover' || this.props.class === 'Stripped' ? 'bordered-darkorange ' : ''}>
                            <tr>
                                {
                                    thead && thead.map((v, i) => (
                                        <th data-code={v.code} key={`thead_${i}`} className={this.sortClass(v.code)} onClick={this.sort}>
                                            {v.txt}
                                        </th>
                                    ))
                                }
                                {
                                    operate.toperates && operate.toperates.length > 0 &&
                                    <th>
                                        操作
                                    </th>
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tdata && tdata.length > 0 ?
                                    tdata.map((item, i) => (<tr key={`tdata_tr_${i}`}>
                                        {
                                            thead && thead.map((t, i2) => (
                                                <td key={`tdata_td_${i}_${i2}`}>
                                                    {
                                                        t.format && this.formatHbs(t.format, item) || item[t.code]
                                                    }
                                                </td>
                                            ))
                                        }
                                        <td>
                                            {
                                                operate.toperates && operate.toperates.length > 0 &&
                                                    <DropDownButton name="操作">
                                                        {
                                                            operate.toperates.map((topt, i3) => {
                                                                if (topt.link) {
                                                                    return (<li key={`operate_${i}_${i3}`}>
                                                                        <Link to={this.formatHbs(topt.link, item)}><i className={topt.cls} />{topt.txt}</Link>
                                                                    </li>);
                                                                }
                                                                if (topt.code === 'delete') {
                                                                    return (<li key={`operate_${i}_${i3}`}>
                                                                        <a href="javascript:;" onClick={this.remove.bind(this, item.id || item.code)}><i className={topt.cls} />{topt.txt}</a>
                                                                    </li>);
                                                                }
                                                                return (<li key={`operate_${i}_${i3}`}>
                                                                    <a href="javascript:;"><i className={topt.cls} />{topt.txt}</a>
                                                                </li>);
                                                            }
                                                            )
                                                        }
                                                    </DropDownButton>
                                            }
                                        </td>
                                    </tr>))
                                    :
                                    <tr>
                                        <td style={{ textAlign: 'center', background: 'white', lineHeight: '50px', fontSize: '18px' }} colSpan={thead.length + (operate.toperates && operate.toperates.length > 0 ? 1 : 0)}>暂无数据</td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                    {
                        footer &&
                        <div className="footer">
                            {
                                footer.txt ?
                                    <code>{footer.txt}</code>
                                    :
                                    footer.pager ?
                                        <div>
                                            <div className="col-sm-6">
                                                当前页：{footer.pager.page}&nbsp;&nbsp;共&nbsp;{footer.pager.total}&nbsp;页&nbsp;&nbsp;共&nbsp;{footer.pager.count}&nbsp;条数据
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="dataTables_paginate paging_bootstrap">
                                                    <Pagnation pager={footer.pager} url={location.pathname} click={this.page} />
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        ''
                            }
                        </div>
                    }
                </div>

            </div>
        </div>);
    }
}

