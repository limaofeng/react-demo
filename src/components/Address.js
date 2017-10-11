import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
import { Cascader, Input } from 'antd';

import * as Format from '../helpers/Format';
import AREAS_QUERY from './graphqls/areas.gql';

@connect(({ apollo: { data } }) => ({ data }))
class Address extends Component {
  static propTypes = {
    client: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func
  };

  static defaultProps = {
    onChange: () => {},
    value: {}
  };

  constructor(props) {
    super(props);
    const { data, data: { ROOT_QUERY: { areasID } }, client, value = {} } = props;
    this.state = {
      district: value.district ? value.district : '',
      path: value.path ? value.path : [],
      street: value.addr ? value.addr : ''
    };
    if (!areasID) {
      client
        .query({
          query: AREAS_QUERY,
          variables: { limit: 4000 }
        })
        .then(({ data: { areas } }) => this.tree(areas));
    } else {
      const newAreas = areasID.map(item => data[item.id]);
      this.tree(newAreas);
    }
  }

  tree = area => {
    this.setState({
      tree: Format.tree(area, {
        pidKey: 'parentId',
        converter: item => ({ value: item.id, label: item.name, ...item }),
        rootKey: item => item.layer === 0
      })
    });
  };

  handleDistrict = (values, objects) => {
    const area = objects[objects.length - 1];
    try {
      if (!values.length) {
        this.setState({ district: null, path: [] });
        return;
      }
      this.setState({ district: area.id, path: area.path.split(',') });
    } finally {
      const { onChange } = this.props;
      onChange({ area: area.id, addr: this.state.street });
    }
  };

  handleStreet = e => {
    this.setState({ street: e.target.value });
    const { onChange } = this.props;
    onChange({ area: this.state.district, addr: e.target.value });
  };

  render() {
    const { path, street, tree } = this.state;
    return (
      <div>
        <Cascader options={tree} defaultValue={path} placeholder="请选择地区" onChange={this.handleDistrict} />
        <br />
        <Input placeholder="请输入具体的地址信息" defaultValue={street} onBlur={this.handleStreet} />
      </div>
    );
  }
}
export default withApollo(Address);
