import React, { PropTypes, Component } from 'react';
import { Input, Icon, Button } from 'antd';
import { isEqual } from 'lodash';

import { Uploader } from './../../components';
import * as urls from '../../config/urls';

class BannerItem extends Component {
  constructor(props) {
    super(props);
    const { value: data = {} } = props;
    this.state = { data };
  }

  componentWillReceiveProps({ value: data }) {
    this.setState({ data });
  }

  handleChange = (name, value) => {
    const { data } = this.state;
    const { onChange } = this.props;
    data[name] = value;
    this.setState({ data });
    onChange && onChange({ ...data });
  };

  render() {
    const { index, onRemove, onMoveDown, onMoveUp } = this.props;
    const { data } = this.state;
    console.log(index, data);
    return (
      <div className="banner-item">
        <div className="img">
          <Uploader defaultValue={data.picture} onChange={value => this.handleChange('picture', value)} />
        </div>
        <div className="description">
          <Input
            placeholder="标题"
            defaultValue={data.title}
            onChange={e => this.handleChange('title', e.target.value)}
          />
          <Input
            placeholder="描述"
            defaultValue={data.summary}
            onChange={e => this.handleChange('summary', e.target.value)}
          />
          <Input placeholder="URL" defaultValue={data.url} onChange={e => this.handleChange('url', e.target.value)} />
        </div>
        <div className="action">
          {/* disabled */}
          <Icon className="dynamic-delete-button" type="close" onClick={onRemove} />
          <Icon className="dynamic-delete-button" type="up" onClick={onMoveUp} />
          <Icon className="dynamic-delete-button" type="down" onClick={onMoveDown} />
        </div>
      </div>
    );
  }
}

class BannerItems extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.array
  };

  static defaultValue = {
    onChange: () => {}
  };

  constructor(props) {
    super(props);
    const { value = [] } = props;
    this.state = { items: value, idIndex: -1 };
  }

  componentWillReceiveProps({ value = [] }) {
    const { items } = this.state;
    if (!isEqual(value, items.map(({ id, ...ndata }) => ndata))) {
      this.setState({ items: value });
    }
  }

  move = (index, type) => {
    const { onChange } = this.props;
    const { items } = this.state;
    if (type === 'up') {
      if (index === 0) {
        return;
      }
      items[index] = items.splice(index - 1, 1, items[index])[0];
    } else {
      if (index === items.length) {
        return;
      }
      items[index] = items.splice(index + 1, 1, items[index])[0];
    }
    // this.setState({ items });
    onChange(items.map(({ id, ...ndata }) => ndata));
  };

  remove = index => {
    const { onChange } = this.props;
    const { items: oldItems } = this.state;
    const items = oldItems.filter((item, i) => i !== index);
    this.setState({ items });
    onChange(items.map(({ id, ...ndata }) => ndata));
  };

  add = () => {
    const { onChange } = this.props;
    const { items, idIndex } = this.state;
    items.push({ id: idIndex - 1 });
    this.setState({ items, idIndex: idIndex - 1 });
    onChange(items.map(({ id, ...ndata }) => ndata));
  };

  handleChange = (index, data) => {
    const { onChange } = this.props;
    const { items } = this.state;
    items[index] = data;
    this.setState({ items });
    onChange(items.map(({ id, ...ndata }) => ndata));
  };

  render() {
    const { items } = this.state;
    const inputs = items.map((item, index) => (
      <div key={item.id}>
        <BannerItem
          index={index}
          value={item}
          onRemove={() => this.remove(index)}
          onMoveUp={() => this.move(index, 'up')}
          onMoveDown={() => this.move(index, 'down')}
          onChange={data => this.handleChange(index, data)}
        />
      </div>
    ));
    return (
      <div className="banner-items">
        {inputs}
        <div className="banner-items-add">
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" />新增图片
          </Button>
        </div>
      </div>
    );
  }
}

export default BannerItems;
