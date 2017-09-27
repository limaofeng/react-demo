import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import * as UIActions from '../../redux/modules/ui/index';
import * as utils from '../../utils/Format';
// 操作按钮
import { PageBody, TabPanel, ActionButton } from '../../components';
import { Popconfirm, Spin, Form, Switch, Radio, Input, Table, Icon, Button, Menu, Dropdown, Card, Affix, Modal, AutoComplete } from 'antd';
import DropDownButton from '../../components/button/DropDownButton';
// 分页
import Pagnation from '../../components/Pagnation';
import BANNERS_QUERY from './gql/banners.gql';
import REMOVE_BANNER from './gql/removeBeanner.gql';

// 删除
@graphql(REMOVE_BANNER, {
  props: ({ ownProps: { id }, ...props }) => ({
    ...props,
    remove: () => props.mutate({
      variables: { id },
      refetchQueries: [{
        query: BANNERS_QUERY
      }]
    })
  })
})
class RemoveBanner extends Component {
  render() {
    const { remove } = this.props;
    return (<Popconfirm placement="left" title="是否确认删除 Banner ?" onConfirm={remove} okText="删除" cancelText="取消"><a>删除</a></Popconfirm>);
  }
}

@graphql(BANNERS_QUERY, {
  fetchPolicy: 'network-only'
})
@connect()
export default class Banner extends Component {
    static propTypes = {
      data: PropTypes.object.isRequired
    }

    state = {
      columns: [
        {
          title: '编码',
          dataIndex: 'id',
          key: 'id',
          width: 150
        }, {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          width: 250,
        }, {
          title: '描述',
          dataIndex: 'description',
          key: 'description'
        }, {
          title: '操作',
          key: 'operation',
          width: 150,
          render: (text, { id }) => (
            <span>
              <Link to={`/cms/banners/${id}/edit`}>编辑</Link>
              <span className="ant-divider" />
              <RemoveBanner id={id} />
            </span>
          ),
        }
      ]
    }

    render() {
      const { data: { loading, banners } } = this.props;
      const { columns } = this.state;
      return (
        <PageBody>
          <div className="table-box">
            <ActionButton.Add to={{ path: '/cms/banners/add' }} />
            <Table
              rowKey="id"
              loading={loading}
              columns={columns}
              dataSource={banners}
            />
          </div>
        </PageBody>
      );
    }
}
