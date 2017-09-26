import React, { Component } from 'react';
import { getAreas } from '../reducers/home';

export default class Area extends Component {
    constructor(s) {
        super(s);
        this.state = { provinces: [], citys: [], areas: [], province: '', city: '', area: '', inited: false };
    }
    componentDidMount() {
        // 获取省
        getAreas({ per_page: 200, EQI_layer: 0 }).then((d) => {
            this.setState({ provinces: d.items });
        }).catch((e) => {
            console.error(e);
            $.alert.error('获取省错误');
        });
    }

    componentWillUpdate() {
        const { defaultVal } = this.props;
        const { inited } = this.state;
        if (defaultVal && !inited) {
            this.setState({ inited: true }, () => {
                this.changeProvince(defaultVal.split(',')[0]);
            });
        }
    }

    changeProvince = (e) => {
        const { defaultVal, changeProvince } = this.props;
        const { provinces } = this.state;
        let province = e;
        if (typeof e === 'string') {

        } else {
            e.preventDefault();
            province = $(e.target).val();
        }
        // 获取城市
        getAreas({ per_page: 200, 'EQS_parent.id': province }).then((d) => {
            this.setState({ citys: d.items, province, areas: [], area: '' }, () => {
                const pObj = provinces.find(a => a.id == province);
                changeProvince && typeof changeProvince === 'function' ? changeProvince(pObj) : '';
                if (defaultVal && typeof e === 'string') {
                    this.changeCity(defaultVal.split(',')[1]);
                }
            });
        }).catch((e) => {
            console.error(e);
            $.alert.error('获取省错误');
        });
    }

    changeCity = (e) => {
        const { defaultVal, changeValue, changeCity } = this.props;
        const { citys } = this.state;
        let city = e;
        if (typeof e === 'string') {

        } else {
            e.preventDefault();
            city = $(e.target).val();
        }
        // 获取城市
        getAreas({ per_page: 200, 'EQS_parent.id': city }).then((d) => {
            this.setState({ areas: d.items, city }, () => {
                const cityObj = citys.find(a => a.id == city);
                changeCity && props.changeCity == 'function' ? changeCity(cityObj) : '';
                if (cityObj.tags.find(a => a == 'region')) {
                    changeValue && typeof changeValue === 'function' ? changeValue(cityObj) : '';
                }
                if (defaultVal && typeof e === 'string') {
                    const arrs = defaultVal.split(',');
                    if (arrs.length === 3) {
                        this.changeArea(arrs[2]);
                    }
                }
            });
        }).catch((e) => {
            console.error(e);
            $.alert.error('获取省错误');
        });
    }
    changeArea = (e) => {
        const { areas } = this.state;
        let area = e;
        if (typeof e === 'string') {

        } else {
            e.preventDefault();
            area = $(e.target).val();
        }
        this.props.changeArea && typeof this.props.changeArea === 'function' ? this.props.changeArea(area) : '';
        this.props.changeValue && typeof this.props.changeValue === 'function' ? this.props.changeValue(areas.find(a => a.id == area)) : '';
        this.setState({ area });
    }

    render() {
        const { provinces, citys, areas, province, city, area } = this.state;
        return (
            <div className="col-md-12">
                {
                    provinces.length > 0 &&
                    <div className="col-md-4">
                        <div className="form-group">
                            <label>
                                {/* <span style="color: red;">*</span> */}
                            </label>
                            <span className="input-icon icon-right">
                                <select style={{ width: '100%' }} onChange={this.changeProvince} value={province}>
                                    <option value="">请选择省</option>
                                    {
                                        provinces.map((item, i) => (
                                            <option key={`province_${i}`} value={item.id}>{item.name}</option>
                                        ))
                                    }
                                </select>
                            </span>
                        </div>
                    </div>
                }
                {
                    citys.length > 0 &&
                    <div className="col-md-4">
                        <div className="form-group">
                            <label>
                                {/* <span style="color: red;">*</span> */}
                            </label>
                            <span className="input-icon icon-right">
                                <select style={{ width: '100%' }} onChange={this.changeCity} value={city}>
                                    <option value="">请选择</option>
                                    {
                                        citys.map((item, i) => (
                                            <option key={`city_${i}`} value={item.id}>{item.name}</option>
                                        ))
                                    }
                                </select>
                            </span>
                        </div>
                    </div>
                }
                {
                    areas.length > 0 &&
                    <div className="col-md-4">
                        <div className="form-group">
                            <label>
                                {/* <span style="color: red;">*</span> */}
                            </label>
                            <span className="input-icon icon-right">
                                <select style={{ width: '100%' }} value={area} onChange={this.changeArea}>
                                    <option value="">请选择</option>
                                    {
                                        areas.map((item, i) => (
                                            <option key={`area_${i}`} value={item.id}>{item.name}</option>
                                        ))
                                    }
                                </select>
                            </span>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
