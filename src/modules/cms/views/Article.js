import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { graphql, withApollo } from 'react-apollo';
import { isEqual } from 'lodash';

import { message, Icon, Modal } from 'antd';

import { PageBody, TreeSidebar } from '../../../components';

import ArticleList from './../components/ArticleList';
import * as Format from '../../../helpers/Format';

import { CategorySubmitForm, CategoryUpdateForm } from '../components/CategoryForm';

// 查询分类
import CATEGORYS_QUERY from '../graphqls/articleCategorys.graphql';
// 删除分类
import CATEGORY_REMOVE from '../graphqls/article_category_remove.graphql';

const { Tree, TreeItem, TreeItemGroup } = TreeSidebar;
const { confirm } = Modal;

@withApollo
class MenuTreeAction extends PureComponent {
  static propTypes = {
    client: PropTypes.object.isRequired,
    getCategorys: PropTypes.func.isRequired,
    getCategoryTree: PropTypes.func.isRequired,
    getSelectedKey: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    const { client } = props;
    // 删除接口函数
    this.remove = id =>
      client.mutate({
        mutation: CATEGORY_REMOVE,
        variables: { id },
        refetchQueries: [
          {
            query: CATEGORYS_QUERY
          }
        ]
      });
    this.state = { visible: false };
  }
  handleCancel = () => {
    this.setState({ visible: false });
  };

  showModal = value => {
    this.setState({ visible: true, isnew: true, category: { parentId: value, type: 'article' } });
  };

  showSetModal = ({
    parent,
    createTime,
    creator,
    layer,
    modifier,
    modifyTime,
    uuid,
    __typename,
    sort,
    path,
    ...category
  }) => {
    this.setState({
      visible: true,
      isnew: false,
      category: { ...category, parentId: parent && parent.id }
    });
  };

  showCategoryNew = () => {
    const { getSelectedKey } = this.props;
    this.showModal(getSelectedKey());
  };

  showCategoryEdit = () => {
    const { getCategorys, getSelectedKey } = this.props;
    this.showSetModal(getCategorys().find(item => item.id === getSelectedKey()));
  };

  handleDeleteCategory = () => {
    const { getCategorys, getSelectedKey, onSuccess } = this.props;
    const category = getCategorys().find(item => item.id === getSelectedKey());
    const parentId = category.parent && category.parent.id;
    if (!parentId) {
      message.error('顶级分类不允许删除');
      return;
    }
    confirm({
      title: '是否删除分类?',
      content: '分类删除后不能恢复，请谨慎操作！',
      onOk: () => {
        this.remove(getSelectedKey())
          .then(() => {
            message.success('保存成功！');
            onSuccess(parentId);
          })
          .catch(error => {
            message.error('保存失败！', error);
          });
      }
    });
  };

  handleSuccess = id => {
    const { onSuccess } = this.props;
    this.setState({ visible: false });
    onSuccess(id);
  };

  render() {
    const { getCategoryTree, client } = this.props;
    const { visible, isnew, category } = this.state;
    return (
      <div className="action-icons">
        <Icon type="plus-circle-o" onClick={this.showCategoryNew} />
        <Icon type="edit" shape="circle" onClick={this.showCategoryEdit} />
        <Icon type="delete" shape="circle" onClick={this.handleDeleteCategory} />
        {visible &&
          (isnew ? (
            <CategorySubmitForm
              category={category}
              categoryTree={getCategoryTree()}
              visible={visible}
              client={client}
              onSuccess={this.handleSuccess}
              onCancel={this.handleCancel}
            />
          ) : (
            <CategoryUpdateForm
              category={category}
              client={client}
              onSuccess={this.handleSuccess}
              categoryTree={getCategoryTree()}
              visible={visible}
              onCancel={this.handleCancel}
            />
          ))}
      </div>
    );
  }
}

class Sider extends Component {
  static propTypes = {
    categorys: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    defaultSelectedKey: PropTypes.string
  };

  static defaultProps = {
    defaultSelectedKey: null
  };

  constructor(props) {
    super(props);
    const { defaultSelectedKey: selectedKey, categorys } = props;
    const categoryTree = Format.tree(categorys, {
      rootKey: item => !item.parent,
      sort: (a, b) => (a.sort > b.sort ? 1 : -1),
      idKey: 'id',
      pidKey: item => item.parent && item.parent.id,
      converter: item => ({ ...item, key: item.id, value: item.id, label: item.name })
    });
    this.state = {
      categoryTree,
      selectedKey
    };
  }

  componentWillReceiveProps({ categorys: nextCategorys }) {
    const { categorys: prevCategorys } = this.props;
    if (!isEqual(prevCategorys, nextCategorys)) {
      this.setState({
        categoryTree: Format.tree(nextCategorys, {
          rootKey: item => !item.parent,
          sort: (a, b) => (a.sort > b.sort ? 1 : -1),
          idKey: 'id',
          pidKey: item => item.parent && item.parent.id,
          converter: item => ({ ...item, key: item.id, value: item.id, label: item.name })
        })
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  handleClick = id => {
    const { onChange } = this.props;
    if (this.state.selectedKey !== id) {
      this.setState({ selectedKey: id });
      onChange(id);
    }
  };

  crateMenu = (newDate, layer = 1) => {
    const newDoms = newDate.map(item => {
      if (item.children) {
        return (
          <TreeItemGroup key={item.id} title={item.name} layer={layer}>
            {this.crateMenu(item.children, layer + 1)}
          </TreeItemGroup>
        );
      }
      return <TreeItem key={item.id} title={item.name} layer={layer} />;
    });
    return newDoms;
  };

  handleSuccess = id => {
    const { onChange } = this.props;
    this.setState({ selectedKey: id });
    onChange(id);
  };

  render() {
    const { categorys, defaultSelectedKey } = this.props;
    const { selectedKey, categoryTree } = this.state;
    return (
      <div className="menuTree">
        <MenuTreeAction
          getCategorys={() => categorys}
          getCategoryTree={() => categoryTree}
          getSelectedKey={() => selectedKey}
          onSuccess={this.handleSuccess}
        />
        <Tree
          defaultSelectedKey={selectedKey || defaultSelectedKey}
          defaultOpenKeys={categoryTree.map(({ id }) => id)}
          onSelect={this.handleClick}
        >
          {this.crateMenu(categoryTree)}
        </Tree>
      </div>
    );
  }
}

@graphql(CATEGORYS_QUERY)
class SiderWrapper extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    defaultSelectedKey: PropTypes.string
  };
  static defaultProps = {
    defaultSelectedKey: null
  };
  render() {
    const { data: { categorys = [], loading }, defaultSelectedKey, onChange } = this.props;
    if (loading) {
      return <div />;
    }
    return <Sider onChange={onChange} categorys={categorys} defaultSelectedKey={defaultSelectedKey} />;
  }
}

export default class Article extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };
  handleChange = id => {
    const { history } = this.props;
    history.push(`/articles?categoryid=${id}`);
  };

  render() {
    const { location: { query: { categoryid } }, location, history } = this.props;
    console.log(location);
    return (
      <PageBody fullscreen>
        <div className="frame-container">
          <div className="frame-sidebar">
            <div className="inside-scroll">
              <SiderWrapper defaultSelectedKey={categoryid} onChange={this.handleChange} />
            </div>
          </div>
          <div className="frame-body">
            <ArticleList location={location} history={history} />
          </div>
        </div>
      </PageBody>
    );
  }
}
