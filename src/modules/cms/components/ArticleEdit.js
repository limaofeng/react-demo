import React, { PropTypes, Component, PureComponent } from 'react';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { isEqual } from 'lodash';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import { Menu, Dropdown, Button, Row, Col, Icon, message, Radio, Form, Input, Checkbox, DatePicker, TimePicker, Upload, Modal, Tag, Select, Spin } from 'antd';

import classnames from 'classnames';
import Ueditor from '../Ueditor/Ueditor';
import { openNotificationWithIcon } from './../../components/Modal/Pubfun';
import * as config from '../../config/urls';

import { PageBody } from './../../components';
import { lazyUpdate, diff } from './../../utils';

import ArticleSettings from './ArticleSettings';

import './ArticleForm.less';

import ARITCLE_QUERY from './gql/article.gql';
import ARTICLE_UPDATE from './gql/article_update.gql';
import ARTICLE_REMOVE from './gql/article_remove.gql';

const FormItem = Form.Item;
const Option = Select.Option;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
const confirm = Modal.confirm;

@withRouter
@graphql(ARTICLE_REMOVE, {
  props: ({ ownProps: { history: { goBack }, article: { id } }, ...props }) => ({
    ...props,
    remove: () => props.mutate({
      variables: { id }
    }).then(data => {
      message.info('删除成功');
      goBack();
    })
  })
})
class ArticleDelete extends Component {
    static propTypes = {
      article: PropTypes.object.isRequired,
      remove: PropTypes.func.isRequired
    }

    static defaultProps = {
      onDelete: () => {}
    }

    handleDelete = e => {
      e.preventDefault();
      const { article: { title }, remove } = this.props;
      confirm({
        title: '你确定要删除这篇文章吗?',
        content: <div>你要删除的文章为 {title} <br /> 系统不提供备份与撤销功能，文章将永久删除文章。确认继续吗？</div>,
        onOk() {
          remove();
        }
      });
    }

    render() {
      return <a onClick={this.handleDelete} role="none">删除文章</a>;
    }
}

class ArticleActions extends PureComponent {
    static propTypes = {
      submitting: PropTypes.bool.isRequired,
      draft: PropTypes.bool.isRequired
    }

    constructor(props) {
      super(props);
      const { draft } = props;
      this.state = {
        action: draft ? 'draft' : 'update',
        title: draft ? '保存草稿' : '更新文章',
        style: 'blue'
      };
    }

    componentWillReceiveProps({ draft }) {
      this.setState({
        action: draft ? 'draft' : 'update',
        title: draft ? '保存草稿' : '更新文章',
        style: 'blue'
      });
    }

    handleClick = e => {
      e.preventDefault();
      const { submitting, handleSave } = this.props;
      const { action } = this.state;
      if (submitting) {
        return;
      }
      handleSave(action);
    }

    handleSwitch = (action, style, title) => e => {
      e.preventDefault();
      this.setState({ action, style, title });
    }

    handleMove = e => {
      e.preventDefault();
      message.warning('该功能正在开发中，请稍等...');
    }

    render() {
      const { submitting, draft, article } = this.props;
      const { style, action, title } = this.state;

      const menus = [];
      if (draft) {
        menus.push(<li key="draft"><a onClick={this.handleSwitch('draft', 'blue', '保存草稿')} role="none">保存草稿</a></li>);
        menus.push(<li key="publish"><a onClick={this.handleSwitch('publish', 'danger', '立即发布')} role="none">立即发布</a></li>);
      } else {
        menus.push(<li key="update"><a onClick={this.handleSwitch('update', 'blue', '更新文章')} role="none">更新文章</a></li>);
        menus.push(<li key="unpublish"><a onClick={this.handleSwitch('unpublish', 'danger', '取消发布')} role="none">取消发布</a></li>);
      }

      // 通用功能
      menus.push(<li key="divider" className="divider" />);
      menus.push(<li key="move"><a onClick={this.handleMove} role="none">移动栏目</a></li>);
      menus.push(<li key="delete"><ArticleDelete article={article} /></li>);

      return (<div className="btn-group">
        <a
          className={classnames(`btn btn-${style} action-title`, { submitting })}
          onClick={this.handleClick}
          role="none"
        >{ submitting ? <i className="fa fa-circle-o-notch fa-spin" /> : title }</a>
        <a className={`btn btn-${style} dropdown-toggle`} data-toggle="dropdown">
          <i className="fa fa-angle-down" />
        </a>
        <ul className={`dropdown-menu dropdown-${style}`}>
          {menus}
        </ul>
      </div>);
    }
}

@graphql(ARTICLE_UPDATE, {
  props: ({ ownProps: { article: { id } }, ...props }) => ({
    ...props,
    update: entity => props.mutate({
      variables: { id, entity }
    })
  }),
})
class ArticleForm extends PureComponent {
    static propTypes = {
      update: PropTypes.func.isRequired,
      article: PropTypes.object.isRequired
    }

    constructor(props) {
      super(props);
      const { article: { title, content, status } } = props;
      this.state = {
        openSettings: false,
        article: { title, content, status },
        submitting: false
      };
      this.lazy = lazyUpdate({ title, content, status }, { onlyDiff: true });
    }

    handleOpenSettings = e => {
      e.preventDefault();
      this.setState({ openSettings: true });
    }

    handleCloseSettings = e => {
      e.preventDefault();
      const { openSettings } = this.state;
      if (openSettings) {
        this.setState({ openSettings: false });
      }
    }

    // 操作保存方法
    handleSave = action => {
      const { update } = this.props;
      const { article } = this.state;
      switch (action) {
        case 'publish':
          this.save({ status: 'published' });
          message.info('发布成功');
          break;
        case 'unpublish':
          this.save({ status: 'draft' });
          message.info('取消成功');
          break;
        default:
          if (action === 'update') {
            message.info('更新成功');
          } else if (action === 'draft') {
            message.info('保存成功');
          }
          console.log('手动保存文章内容', article);
          this.save(article);
      }
    }

    // 提供保存时的 submitting 状态
    save = value => {
      const { update } = this.props;
      this.setState({ submitting: true });
      const start = Date.now();
      // 保存小于 1 秒时, 故意延时
      update(value).then(() => setTimeout(() => this.setState({ submitting: false }), 1000 - (Date.now() - start)));
    }

    // 修改后自动保存到 state 中， 如果为草稿状态，自动保存
    handleChange = field => {
      const { article } = this.state;
      return e => {
        const { status } = this.state;
        if (status === 'published') {
          return;
        }
        article[field] = e ? ((e.target && e.target.value) || e) : null;
        this.lazy(article).then(value => {
          this.save(value);
        });
      };
    }

    render() {
      const { article: { status, ...article } } = this.props;
      const { openSettings, submitting, url } = this.state;
      return (<div className={classnames({ 'settings-menu-expanded': openSettings })}>
        <section className="article-view" onClick={this.handleCloseSettings} role="none">
          <header className="view-header">
            <h2 className="view-title">
              <Input onChange={this.handleChange('title')} defaultValue={article.title} />
            </h2>
            <section className="view-actions">
              <button type="button" className="article-settings" onClick={this.handleOpenSettings} >
                <Icon type="setting" />
              </button>
              <ArticleActions draft={status !== 'published'} submitting={submitting} article={article} handleSave={this.handleSave} />
            </section>
          </header>
          <section className="view-editor">
            <Ueditor id="editor" onChange={this.handleChange('content')} defaultValue={article.content} />
          </section>
        </section>
        <ArticleSettings article={article} handleRUL={this.handleRUL} handleClose={this.handleCloseSettings} handleSave={this.handleChange} />
      </div>);
    }
}

@graphql(ARITCLE_QUERY, {
  options: ({ match: { params: { id } } }) => ({ variables: { id } })
})
@withApollo
export default class EditArticle extends Component {
    static propTypes = {
      data: PropTypes.object.isRequired
    }

    render() {
      const { data: { loading, article = {} } } = this.props;
      if (loading) {
        return <div>loading</div>;
      }
      return (<PageBody fullscreen >
        <ArticleForm article={article} />
      </PageBody>);
    }
}
