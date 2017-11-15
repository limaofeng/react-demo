import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { graphql, withApollo } from 'react-apollo';
import { isEqual } from 'lodash';

import { Popconfirm, message, Select, Menu, Input, Table, Icon, Dropdown, Row } from 'antd';

import { ActionButton } from '../../../components';

// 查询文章某一类文章
import ARTICLES_QUERY from '../graphqls/ArticlesConnection.graphql';
import ARTICLE_REMOVE from '../graphqls/article_remove.graphql';
import ARTICLE_SUBMIT from '../graphqls/article_submit.graphql';

const { Search } = Input;
const { Option } = Select;

const NewArticle = graphql(ARTICLE_SUBMIT, {
  props: ({ ownProps: { categoryId }, ...props }) => ({
    ...props,
    submit: ({ title, content }) =>
      props.mutate({
        variables: { entity: { categoryId, title, content } },
        refetchQueries: [
          {
            query: ARTICLES_QUERY,
            variables: {
              categoryId
            },
            fetchPolicy: 'network-only'
          }
        ]
      })
  })
})(ActionButton.Add);

@graphql(ARTICLE_REMOVE, {
  props: ({ ownProps: { id, onDelete }, ...props }) => ({
    ...props,
    remove: () =>
      props
        .mutate({
          variables: { id }
        })
        .then(() => {
          message.info('删除成功');
          onDelete();
        })
  })
})
class ArticleDelete extends Component {
  static propTypes = {
    remove: PropTypes.func.isRequired
  };

  render() {
    const { remove } = this.props;
    return (
      <Popconfirm placement="left" title="是否确认删除文章 ?" onConfirm={remove} okText="删除" cancelText="取消">
        <a>删除文章</a>
      </Popconfirm>
    );
  }
}

// 文章操作组件
@withApollo
class ArticleAction extends Component {
  static propTypes = {
    article: PropTypes.object.isRequired,
    refresh: PropTypes.func
  };

  static defaultProps = {
    refresh: () => {}
  };

  render() {
    const { article: item, refresh } = this.props;
    const menu = (
      <Menu>
        <Menu.Item>
          <Link to={`/${item.id}/share`}>推荐到文章</Link>
        </Menu.Item>
      </Menu>
    );

    return (
      <span>
        <Link to={`/articles/${item.id}`}>编辑文章</Link>
        <span className="ant-divider" />
        <ArticleDelete id={item.id} onDelete={refresh} />
        <span className="ant-divider" />
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link">
            操作<Icon type="down" />
          </a>
        </Dropdown>
      </span>
    );
  }
}

class ArticleSearch extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    search: PropTypes.func.isRequired
  };
  static defaultProps = {
    type: 'title',
    value: ''
  };

  constructor(props) {
    super(props);
    const { type, value } = props;
    this.state = { type, value };
    this.handleTypeChange = this.handleChange('type');
    this.handleValueChange = (handleChange => e => handleChange(e.target.value))(this.handleChange('value'));
  }

  componentWillReceiveProps(nextProps) {
    if (isEqual(this.props, nextProps)) {
      return;
    }
    const { type, value } = nextProps;
    this.state = { type, value };
  }

  search = value => {
    const { search } = this.props;
    search(this.state.type, value);
  };

  handleChange = key => value => {
    const prop = {};
    prop[key] = value;
    this.setState(prop);
  };

  render() {
    const { type, value } = this.state;
    const selectBefore = (
      <Select onChange={this.handleTypeChange} value={type} style={{ width: 80 }}>
        <Option value="title">标题</Option>
        <Option value="tags">标签</Option>
      </Select>
    );
    return (
      <Row className="article_search">
        <Search
          addonBefore={selectBefore}
          placeholder="请输入文章标题"
          style={{ width: 400 }}
          onSearch={this.search}
          onChange={this.handleValueChange}
          value={value}
        />
      </Row>
    );
  }
}

class ArticleList extends Component {
  static propTypes = {
    refresh: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    onSubmitNewArticle: PropTypes.func.isRequired,
    categoryId: PropTypes.string
  };
  static defaultProps = {
    categoryId: null
  };

  state = {
    columns: [
      {
        title: '标题',
        dataIndex: 'title',
        show: true,
        disabled: true,
        key: 'title',
        render: (text, { id }) => <Link to={`/articles/${id}`}>{text}</Link>
      },
      {
        title: '是否发布',
        dataIndex: 'status',
        show: true,
        disabled: true,
        width: 100,
        key: 'status',
        render: text => (text === null ? '否' : '是')
      },
      {
        title: '发布日期',
        dataIndex: 'publishDate',
        show: true,
        disabled: true,
        width: 100,
        key: 'publishDate'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        show: true,
        disabled: true,
        width: 250,
        key: 'operation',
        render: (text, record) => <ArticleAction article={record} refresh={this.props.refresh} />
      }
    ]
  };

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  search = (type, value) => {
    const { search } = this.props;
    const filters = {};
    filters[type] = value;
    search({ current: 1 }, filters, {});
  };

  render() {
    const { data: { loading, pager, variables: { filters } }, search, categoryId, onSubmitNewArticle } = this.props;
    const { columns } = this.state;
    const searchValue = filters.find(item => item.field === 'title' || item.field === 'tags');
    return (
      <div>
        {categoryId ? <NewArticle categoryId={categoryId} onClick={onSubmitNewArticle} /> : []}
        <ArticleSearch
          type={searchValue ? searchValue.field : undefined}
          value={searchValue ? searchValue.value : undefined}
          search={this.search}
        />
        <Table
          className="article_table"
          rowKey="id"
          onChange={search}
          dataSource={(pager && pager.items) || []}
          pagination={pager || false}
          columns={columns}
          loading={loading}
        />
      </div>
    );
  }
}

@graphql(ARTICLES_QUERY, {
  options: ({ location: { query: { categoryid: categoryId }, state: variables = { page: 1, filters: [] } } }) => ({
    variables: { ...variables, categoryId },
    fetchPolicy: 'network-only'
  }),
  props: props => ({
    ...props,
    search: (pagination, filters) => {
      const { ownProps: { history, location: { pathname, search } }, data: { variables: oldVariables } } = props;
      const variables = { ...oldVariables }; // 必须 clone 新的对象
      variables.page = pagination.current;
      variables.filters = Object.keys(filters).map(key => {
        let matchType;
        switch (key) {
          case 'title':
            matchType = 'like';
            break;
          case 'tags':
            matchType = 'in';
            break;
          default:
        }
        return { field: key, matchType, value: filters[key] };
      });
      history.push(`${pathname}${search}`, variables);
    },
    refresh: () => {
      const { data: { refetch } } = props;
      return refetch();
    }
  })
})
export default class ArticleListWrapper extends Component {
  static propTypes = {
    refresh: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  handleNewArticle = ({ submit }) => {
    const { history: { push } } = this.props;
    submit({ title: '未命名标题', content: '默认内容' }).then(({ data: { article: { id } } }) =>
      push(`/articles/${id}`)
    );
  };

  render() {
    const {
      data: { loading, pager, variables, error },
      search,
      refresh,
      location: { query: { categoryid } }
    } = this.props;
    return (
      <ArticleList
        categoryId={categoryid}
        data={{ loading, pager, variables, error }}
        search={search}
        refresh={refresh}
        onSubmitNewArticle={this.handleNewArticle}
      />
    );
  }
}
