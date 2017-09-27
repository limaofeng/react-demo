import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Cascader, Input, Icon, message } from 'antd';
import { getAreas } from '../reducers/home';

export default class CitySelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      city: [],
      options: [{
        value: '',
        label: '请选择',
        isLeaf: false
      }]
    };
  }

  componentDidMount() {
    // 获取省
    getAreas({ per_page: 200, EQI_layer: 0 }).then(d => {
      const items = d.items.map((v, i) => ({
        value: v.id,
        label: v.display_name,
        isLeaf: false
      }));
      this.setState({ options: items });
    }).catch(e => {
      console.error(e);
      message.error('获取省错误');
    });
  }

    onChange = (value, selectedOptions) => {
      this.setState({ city: value });
      this.props.onChange && this.props.onChange(value, this.state.address);
    }

    changeHandle = e => {
      this.setState({ address: e.target.value });
      this.props.onChange && this.props.onChange(this.state.city, e.target.value);
    }

    emitEmpty = e => {
      this.input.focus();
      this.setState({ address: '' });
    }

    loadData = selectedOptions => {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;

      getAreas({ per_page: 200, 'EQS_parent.id': targetOption.value }).then(d => {
        targetOption.loading = false;

        const items = d.items.map((v, i) => ({
          value: v.id,
          label: v.name,
          isLeaf: v.layer > 1
        }));

        targetOption.children = items;

        this.setState({
          options: [...this.state.options],
        });
      }).catch(e => {
        console.error(e);
        message.error('获取省错误');
      });
    }

    render() {
      const { isAddress, width, padding, selectPlaceholder, inputPlaceholder } = this.props;
      const _width = width || '100%';
      const _padding = padding || '10px 0';
      const _selectPlaceholder = selectPlaceholder || '请选择';
      const _inputPlaceholder = inputPlaceholder || '请输入';
      const { address } = this.state;
      const suffix = address ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;

      return (<div style={{ width: _width }}>
        <div style={{ padding: _padding }}>
          <Cascader
              options={this.state.options}
              loadData={this.loadData}
              onChange={this.onChange}
            changeOnSelect
            style={{ width: '100%' }}
              placeholder={_selectPlaceholder}
          />
        </div>
        {isAddress &&
          <div style={{ padding: _padding }}>
            <Input
              suffix={suffix}
              onChange={this.changeHandle}
              value={address}
              style={{ width: '100%' }}
              placeholder={_inputPlaceholder}
              ref={node => this.input = node}
            />
          </div>
        }
      </div>);
    }
}

CitySelect.propTypes = {
  width: PropTypes.string,
  padding: PropTypes.string,
  selectPlaceholder: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  isAddress: PropTypes.bool,
  onChange: PropTypes.func
};
