import React, { Component, PropTypes } from 'react';
import { graphql, withApollo } from 'react-apollo';

import moment from 'moment';
import { Icon, Form, Input, DatePicker, Select } from 'antd';

import { Settings, Uploader, FormGroup } from './../../../components';

import ARITCLE_QUERY from '../graphqls/ArticleQuery.gql';
import ARTICLETAGS_QUERY from '../graphqls/article_tags.gql';

import { lazy as lazyUpdate } from './../../../helpers/lazy';

const ExtraSettings = Settings.ExtraSettings;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

class MetaData extends Component {
  render() {
    return (
      <div>
        <dl>
          <dt style={{ marginBottom: '5px' }}>
            <b style={{ fontSize: '17px', color: '#000' }}>标题</b>
          </dt>
          <dd style={{ marginBottom: '30px' }}>
            <Input
              style={{
                width: '100%',
                height: '40px',
                borderRadius: '4px',
                border: 'none',
                outline: 'none',
                fontSize: '20px'
              }}
              maxLength="70"
            />
            <p>
              <span style={{ color: 'rgb(192,192,192)' }}>
                建议: <b>70</b>个字符.
              </span>
              <span style={{ float: 'right' }}>
                你已经使用<b style={{ color: 'rgb(158,184,90)', fontSize: '16px' }} />
              </span>
            </p>
          </dd>
          <dt style={{ marginBottom: '5px' }}>
            <b style={{ fontSize: '17px', color: '#000' }}>描述</b>
          </dt>
          <dd style={{ marginBottom: '5px' }}>
            <TextArea
              style={{ width: '100%', maxWidth: '100%', height: '150px', maxHeight: '200px', borderRadius: '4px' }}
              maxLength="156"
            />
            <p>
              <span style={{ color: 'rgb(192,192,192)' }}>
                建议: <b>156</b>个字符.
              </span>
              <span style={{ float: 'right' }}>
                你已经使用<b style={{ color: 'rgb(158,184,90)', fontSize: '16px' }}>1</b>
              </span>
            </p>
          </dd>
        </dl>
        <div style={{ width: '100%', height: '20%', display: 'none' }} />
      </div>
    );
  }
}

@graphql(ARTICLETAGS_QUERY)
@withApollo
export default class ArticleSettings extends Component {
  static propTypes = {
    client: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    article: PropTypes.object.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    const { handleSave, article: { sn } } = props;
    this.handleSavePublishDate = (autoSave => (date, dateString) => {
      autoSave(dateString);
    })(handleSave('publishDate'));
    this.state = {
      url: {
        validateStatus: null,
        help: null
      }
    };
    this.handleSaveUrl = handleSave('sn');
    this.lazyUrl = lazyUpdate(sn, { delay: 500 });
  }

  handleUrl = e => {
    const { client, article } = this.props;
    const value = e.target.value;
    this.lazyUrl(value).then(() => {
      if (!value.trim()) {
        this.setState({ url: { validateStatus: null, help: null } });
        this.handleSaveUrl(value);
        return;
      }
      this.setState({ url: { validateStatus: 'validating', help: null } });
      client
        .query({
          query: ARITCLE_QUERY,
          variables: { id: value, type: 'sn' },
          fetchPolicy: 'network-only'
        })
        .then(({ data: { article: check } }) => {
          if (check && check.id !== article.id) {
            this.setState({ url: { validateStatus: 'error', help: '链接已存在!' } });
          } else {
            this.setState({ url: { validateStatus: null, help: null } });
            this.handleSaveUrl(value);
          }
        });
    });
  };

  render() {
    const {
      handleClose,
      handleSave,
      article: { cover, sn, tags: defaultTags = [], author, publishDate },
      data: { tags = [] }
    } = this.props;
    const { url: { validateStatus, help } } = this.state;
    // 普通设置
    const content = (
      <div>
        <Uploader mode="avatar" onChange={handleSave('cover')} defaultValue={cover && cover.path} />
        <FormGroup label="链接">
          <FormItem validateStatus={validateStatus} hasFeedback help={help}>
            <Input onChange={this.handleUrl} prefix={<Icon type="link" />} type="url" defaultValue={sn} />
          </FormItem>
        </FormGroup>
        <FormGroup label="发布日期">
          <DatePicker
            style={{ width: '100%' }}
            showTime
            onChange={this.handleSavePublishDate}
            format="YYYY-MM-DD HH:mm:ss"
            defaultValue={publishDate && moment(publishDate, 'YYYY-MM-DD HH:mm:ss')}
          />
        </FormGroup>
        <FormGroup label="标签">
          <Select
            mode="tags"
            style={{ width: '100%' }}
            tokenSeparators={[',']}
            defaultValue={defaultTags}
            onChange={handleSave('tags')}
          >
            {tags.map(({ name }) => <Option key={name}>{name}</Option>)}
          </Select>
        </FormGroup>
        <FormGroup label="作者">
          <Input
            onChange={handleSave('author')}
            className="Author"
            prefix={<Icon type="user" />}
            defaultValue={author}
          />
        </FormGroup>
      </div>
    );

    // SEO 设置
    const extras = [
      <ExtraSettings title="SEO 优化设置" summary="设置 SEO 优化相关内容">
        <MetaData />
      </ExtraSettings>
    ];

    return (
      <Settings title="文章设置" handleClose={handleClose} extras={extras}>
        {content}
      </Settings>
    );
  }
}
