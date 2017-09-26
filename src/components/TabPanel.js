/* eslint-disable */
import React, { Component, PropTypes } from 'react';
import Handlebars from 'handlebars';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { assign } from 'lodash';

import { Modal, Button, Icon, Tabs, Checkbox } from 'antd';

import * as format from '../utils/Format';

const Tab = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;

const clone = value => {
    if (typeof value === 'object') {
        if (value.length != null) {
            return assign([], value);
        }
        return assign({}, value);
    }
    return value;
};

const lazyUpdate = (ovalue, { delay = 2000, isEqual = (lvalue, rvalue) => lvalue === rvalue }) => {
    let lvalue = clone(ovalue);
    let lazy;
    return value => new Promise(resolve => {
        clearTimeout(lazy);
        if (isEqual(lvalue, value)) {
            return;
        }
        lazy = setTimeout(() => {
            console.log(`执行更新 ${JSON.stringify(value)}`);
            resolve(value);
            lvalue = clone(value);
        }, delay);
    });
};

Handlebars.registerHelper('value', (data, col) => {
    if (col.render || col.exportRender) {
        return (col.exportRender || col.render)(data[col.dataIndex], data, true);
    }
    return data[col.dataIndex];
});

const downloadFile = data => () => {
    window.location.href = data;
};

const xmlToExcel = (xml, name) => {
    const uri = 'data:application/vnd.ms-excel;base64,';
    const template = `<?xml version="1.0" encoding="UTF-8"?>
                    <?mso-application progid="Excel.Sheet"?>
                    <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
                        {xml}
                    </Workbook>
                    `;
    const base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); };
    const formatExcel = function (s, c) {
        return s.replace(/{(\w+)}/g, (m, p) => c[p]);
    };
    if (!xml) {
        return false;
    }
    const ctx = { worksheet: name || 'sheet', xml };
    return downloadFile(uri + base64(formatExcel(template, ctx)));
};

const makeExcel = (columns, items) => {
    const source = `<Worksheet ss:Name="Sheet1">
                        <Table ss:ExpandedColumnCount="30">
                            <Row ss:AutoFitHeight="0">
                                {{#each columns}}
                                <Cell><Data ss:Type="String">{{title}}</Data></Cell>
                                {{/each}}
                            </Row>
                            {{#each items}}
                            <Row ss:AutoFitHeight="0">
                                {{#each ../columns}}
                                <Cell><Data ss:Type="String">{{value ../. .}}</Data></Cell>
                                {{/each}}
                            </Row>
                            {{/each}}
                        </Table>
                    </Worksheet>`;
    const template = Handlebars.compile(source);
    const result = template({ columns, items });
    return xmlToExcel(result, 'xxxx.xls');
};

const ORDERSCONNECTION_QUERY = gql`
query ($page: Int, $sort: Sort, $filters: [Filter]) {
    ordersConnection(page: $page, sort: $sort, filters: $filters) {
        page
        per_page
        count
        total
        items {
            id
            type
            status
            totalAmount
            createTime
        }
    }
}
`;

class Downlad extends Component {
    state = { status: 'download', cxt: null, width: 0, height: 0 }

    componentWillReceiveProps(props) {
        const { loading, percent } = props;
        console.log(props);
        if (percent === 100) {
            this.setState({ status: 'file' });
            return;
        }
        if (!loading) {
            this.setState({ status: 'download', cxt: null });
            return;
        }
        this.setState({ status: 'loading' });
        // draw(0.6);
        this.draw(percent / 100);
    }

    getContext() {
        if (this.state.cxt != null) {
            return this.state;
        }
        const circ = Math.PI * 2;
        const quart = Math.PI / 2;

        const bg = document.getElementById('downloading');
        if (bg == null) {
            return this.state;
        }
        const width = bg.width;
        const height = bg.height;

        const cxt = bg.getContext('2d'); // 创建context对象
        if (window.devicePixelRatio) {
            bg.style.width = `${width}px`;
            bg.style.height = `${height}px`;
            bg.height = height * window.devicePixelRatio;
            bg.width = width * window.devicePixelRatio;
            cxt.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        this.state = { cxt, width, height };
        return this.state;
    }

    draw = current => {
        const { cxt, width, height } = this.getContext();

        if (cxt == null) {
            return;
        }

        cxt.clearRect(0, 0, width, height);

        cxt.fillStyle = '#BDBDBD'; // 设置或返回用于填充绘画的颜色、渐变或模式 染成红色
        cxt.strokeStyle = '#BDBDBD'; // 设置或返回用于笔触的颜色、渐变或模式
        // cxt.lineCap = 'square'; //设置或返回线条的结束端点样式
        cxt.beginPath(); // 起始一条路径，或重置当前路径
        cxt.moveTo(66, 66); // 把路径移动到画布中的指定点，不创建线条

        // cxt.lineTo(100,0); //添加一个新点，然后在画布中创建从该点到最后指定点的线条
        cxt.arc(66, 66, 66, -0.5 * Math.PI, current * (2 * Math.PI) - Math.PI / 2, true); // 绘制一个中心点为（100,100），半径为100，起始点为1.5*Math.PI,终点为2*Math.PI,顺时针的1/4圆
        cxt.closePath(); // 创建从当前点回到起始点的路径
        cxt.fill();// 填充当前绘图（路径）
        // cxt.lineWidth = 10.0; //设置或返回当前的线条宽度
        cxt.stroke(); // 绘制已定义的路径
    }

    render() {
        const { onDownload, onDownloadFile } = this.props;
        const { status } = this.state;
        const icons = [];
        let loading = false;
        switch (status) {
        case 'download':
            icons.push(<Icon key="cloud-download" type="cloud-download" onClick={onDownload} />);
            break;
        case 'loading':
            loading = true;
            icons.push(<Icon key="cloud-download" type="cloud-download" />);
            icons.push(<div key="downloading" className="downloading"><canvas id="downloading" width="132" height="132" /></div>);
            break;
        case 'file':
            icons.push(<Icon key="file" type="file-excel" onClick={onDownloadFile} />);
            break;
        default:
        }
        return (<div className={`export-download ${loading ? '' : 'active'}`}>{icons}</div>);
    }
}

class Export extends Component {
    state = {
        loading: false,
        visible: false,
        download: false,
        percent: 1,
        downloadFile: () => {}
    }
    showModal = () => {
        this.setState({
            loading: false,
            visible: true,
            download: false,
            percent: 1,
        });
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    progress = percent => {
        if (percent < 100) {
            this.setState({ loading: true, percent });
        }
    }
    handleExport = () => {
        const { columns, client, onExport, pageType } = this.props;
        const downloadedColumns = columns.filter(item => !item.excluded);
        pageType == 'familyPackage' ? columns.shift() : '';
        onExport(client, this.progress).then(data => {
            this.setState({ loading: true, percent: 100, download: true, downloadFile: makeExcel(downloadedColumns, data) });
        });
    }
    render() {
        const { loading, percent, download, downloadFile } = this.state;
        const { onExport } = this.props;
        return (
            <div>
                {
                    onExport && <Button icon="export" size={'small'} onClick={this.showModal}>导出 Excel</Button>
                }

                <Modal
                    className="export-settings"
                    visible={this.state.visible}
                    title=" 导出 Excel "
                    onCancel={this.handleCancel}
                    footer={false}
                >
                    <Downlad loading={loading} download={download} percent={percent} onDownloadFile={downloadFile} onDownload={this.handleExport} />
                </Modal>
            </div>
        );
    }
}

const ExportWithApollo = withApollo(Export);


class TabPanel extends Component {
    state = { activeKey: '1' };

    constructor(props) {
        super(props);
        const resize = this.resize($(window).height());
        this.resize = () => resize($(window).height());
    }

    componentDidMount() {
        $(window).bind('resize', this.resize);
        $('.shu_xian').click((tabpanel => function () {
            if ($(this).parent('.xian_lsit').hasClass('list_no') || $(this).siblings('.xian_lsit').hasClass('list_no')) {
                const $list = $(this).parent('.xian_lsit').addClass('moveout');
                setTimeout(() => {
                    $list.removeClass('list_no');
                }, 499);
            } else {
                $(this).parent('.xian_lsit').removeClass('moveout').addClass('list_no');
                tabpanel.forceResize($(window).height());
            }
        })(this));
    }

    componentWillUnmount() {
        $(window).unbind('resize', this.resize);
    }

    onCheckAllChange = e => {
        const { columns, onChange } = this.props;
        onChange(e.target.checked ? columns.map(col => col.key) : columns.filter(col => col.disabled).map(col => col.key));
    }

    handleChange = value => {
        this.state = { activeKey: value };
        setTimeout(() => this.forceResize($(window).height()), 200);
    }

    forceResize = height => {
        const { activeKey } = this.state;
        // $('.xian_lsit').css({ height: height - 124 });
        if (activeKey === '1') {
            $('.label_div', '.column-settings').css({ height: $('.xian_lsit').height() - 112 });
        } else if (activeKey === '2') {
            $('.label_div', '.search-settings').css({ height: $('.xian_lsit').height() - 80 });
        }
    }

    resize = height => {
        const lazy = lazyUpdate(height, { delay: 500 });
        return newheight => lazy(newheight).then(() => this.forceResize(newheight));
    }

    render() {
        const { columns, onChange, onExport, search, pageType, sendEmail, setMeal } = this.props;
        const checkedList = columns.filter(item => item.show);
        const checkAll = columns.length === checkedList.length;
        const indeterminate = !!checkedList.length && (checkedList.length < columns.length);
        const operations = <ExportWithApollo columns={checkedList} onExport={onExport} pageType={pageType} />;

        return (<div className="right_fix">
            <div className="shu_xian">
                <i className="material-icons">keyboard_arrow_left</i>
                <span className="span1">便捷操作区</span>
            </div>
            <div className="xian_lsit">
                <div className="shu_xian">
                    <i className="material-icons">keyboard_arrow_left</i>
                    <span className="span2">便捷操作区</span>
                </div>
                <div className="biao_div">
                    <Tabs defaultActiveKey="1" size="small" onChange={this.handleChange} tabBarExtraContent={operations}>
                        <Tab tab={<span>返回列表值</span>} key="1">
                            <div className="column-settings">
                                <div className="clearfix label_tops">
                                    <Checkbox indeterminate={indeterminate} onChange={this.onCheckAllChange} checked={checkAll}>列名称</Checkbox>
                                </div>
                                <div className="label_div">
                                    <CheckboxGroup options={columns.map(col => ({ label: col.title, value: col.key, disabled: col.disabled }))} value={checkedList.map(col => col.key)} onChange={onChange} />
                                </div>
                            </div>
                        </Tab>
                        {
                            pageType == 'doctorCashList' ? '' :
                                <Tab tab={<span>筛选</span>} key="2">
                                <div className="search-settings">
                                        <div className="label_div label_div2">
                                        {search}
                                    </div>
                                        <div className="btm_but" />
                                    </div>
                            </Tab>
                        }

                        {
                            pageType == 'morders' ?
                                <Tab tab={<span>发送邮件</span>} key="3">
                                    <div className="search-settings">
                                        {sendEmail}
                                    </div>
                                </Tab>
                                : ''
                        }
                        {
                            pageType == 'familyPackage' ?
                                <Tab tab={<span>生成套餐</span>} key="3">
                                    <div className="search-settings">
                                        <div className="label_div label_div2">
                                            {setMeal}
                                        </div>
                                    </div>
                                </Tab>
                                : ''
                        }
                    </Tabs>
                </div>
            </div>
        </div>);
    }
}

TabPanel.propTypes = {
    columns: PropTypes.array.isRequired
};

export default TabPanel;

