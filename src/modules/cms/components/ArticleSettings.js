import React, { Component, PropTypes } from 'react';
import { Icon, Form, Input, DatePicker, Select, Button } from 'antd';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';

import moment from 'moment';

import { Settings, Uploader, FormGroup } from './../../components';

import ARITCLE_QUERY from './gql/article.gql';
import ARTICLETAGS_QUERY from './gql/article_tags.gql';
import ARTICLEPUSH_SUBMIT from './gql/addPushArticle.gql';
import ARTICLEPUSH_UPDATE from './gql/editPushArticle.gql';
import { openNotificationWithIcon } from './../../components/Modal/Pubfun';

import { lazyUpdate, diff } from './../../utils';

const ExtraSettings = Settings.ExtraSettings;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

class MetaData extends Component {
  render() {
    return (
      <div>
        <dl>
          <dt style={{ marginBottom: '5px' }}><b style={{ fontSize: '17px', color: '#000' }}>标题</b></dt>
          <dd style={{ marginBottom: '30px' }}>
            <Input style={{ width: '100%', height: '40px', borderRadius: '4px', border: 'none', outline: 'none', fontSize: '20px', }} maxLength="70" />
            <p>
              <span style={{ color: 'rgb(192,192,192)' }}>建议: <b>70</b>个字符.</span>
              <span style={{ float: 'right' }}>你已经使用<b style={{ color: 'rgb(158,184,90)', fontSize: '16px' }} /></span>
            </p>
          </dd>
          <dt style={{ marginBottom: '5px' }}><b style={{ fontSize: '17px', color: '#000' }}>描述</b></dt>
          <dd style={{ marginBottom: '5px' }}>
            <TextArea style={{ width: '100%', maxWidth: '100%', height: '150px', maxHeight: '200px', borderRadius: '4px' }} maxLength="156" />
            <p>
              <span style={{ color: 'rgb(192,192,192)' }}>建议: <b>156</b>个字符.</span>
              <span style={{ float: 'right' }}>你已经使用<b style={{ color: 'rgb(158,184,90)', fontSize: '16px' }} >1</b></span>
            </p>
          </dd>
        </dl>
        <div style={{ width: '100%', height: '20%', display: 'none' }} />
      </div>
    );
  }
}

@Form.create()
class PushForm extends Component {
    static propTypes = {
      push: PropTypes.object.isRequired,
      form: PropTypes.object.isRequired,
      submit: PropTypes.func.isRequired,
      isedit: PropTypes.bool.isRequired
    }

    componentDidMount() {
      const { form: { setFieldsValue }, push, isedit } = this.props;
      if (isedit) {
        const { pushDate, minAge, maxAge, ...newpush } = push;
        newpush.age = `${minAge}-${maxAge}`;
        newpush.pushDate = moment(pushDate, 'YYYY-MM-DD');
        setFieldsValue(newpush);
      }
    }

    handleSubmit = e => {
      e.preventDefault();
      const { form: { validateFields }, submit } = this.props;
      validateFields((err, { pushDate, age, ...values }) => {
        if (!err) {
          values.pushDate = pushDate.format('YYYY-MM-DD');
          values.minAge = age.split('-')[0];
          values.maxAge = age.split('-')[1];
          console.log('Received values of form: ', values);
          submit(values);
        }
      });
    }

    render() {
      const { push, form: { getFieldDecorator } } = this.props;
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 },
        },
      };
        // 节气，标签选择
      const medical = ['平和质', '气虚质', '阳虚质', '阴虚质', '痰湿质', '湿热质', '血瘀质', '气郁质', '特秉质'];
      const health = ['糖尿病', '高血脂', '高血压', '脑卒中', '冠心病', '健康'];
      return (
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          {/* 文章类型 */}
          <FormItem
            {...formItemLayout}
            label="文章类型"
          >
            <Input type="text" placeholder="二十四节气" readOnly="readonly" />
          </FormItem>
          {/* 文章标签 */}
          <p style={{ margin: '0 0 10px 3px', fontWeight: 'bold' }}>文章标签</p>
          <FormItem
            {...formItemLayout}
            label="性别"
          >
            {getFieldDecorator('sex', {
              rules: [{ required: true, message: '请选择性别' }],
              // initialValue: `${article.push ? article.push.sex : ''}`
            })(
              <Select placeholder="性别" >
                <Option value="male">男</Option>
                <Option value="female">女</Option>
                <Option value="unknown">普适</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="年龄段"
          >
            {getFieldDecorator('age', {
              rules: [{ required: true, message: '请选择年龄' }],
              // initialValue: `${article.push ? article.push.minAge : ''}-${article.push ? article.push.maxAge : ''}`
            })(
              <Select placeholder="年龄段">
                <Option value="0-200" >普适</Option>
                <Option value="0-18" >0-18岁</Option>
                <Option value="18-40">18-40岁</Option>
                <Option value="40-60">40-60岁</Option>
                <Option value="0-60" >0-60岁</Option>
                <Option value="60-200">60以上</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="中医体质"
          >
            {getFieldDecorator('acquiredTypes', {
              rules: [{ required: true, message: '请选择中医体质' }],
            })(
              <Select mode="multiple" placeholder="中医体质" >
                {medical.map((text, i) => <Option key={i} value={`${i}`}>{text}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="慢性疾病"
          >
            {getFieldDecorator('chronicTypes', {
              rules: [{ required: true, message: '请选择慢性疾病' }],
            })(
              <Select mode="multiple" placeholder="慢性疾病" >
                {health.map((text, i) => <Option key={i} value={text}>{text}</Option>)}
              </Select>
            )}
          </FormItem>
          {/* 推送时间 */}
          <FormItem
            {...formItemLayout}
            label="推送日期"
          >
            {getFieldDecorator('pushDate', {
              rules: [{ required: true, message: '请选择推送日期' }],
              // initialValue: moment(article.push ? article.push.pushDate : '', format)
            })(
              <DatePicker
                format="YYYY-MM-DD"
                placeholder="请选择时间"
              />
            )}
          </FormItem>
          {/* 消息内容 */}
          <FormItem label="消息内容">
            {getFieldDecorator('msgTitle',
              { rules: [{ required: true, message: '请输入消息内容' }, {
                validator: (rule, value, callback) => {
                  const re = /^.{1,140}$/;
                  if (re.test(value)) {
                    callback();
                  } else {
                    callback('消息内容由字母或者数字组成且长度不超过140位');
                  }
                }
              }],
                // initialValue: article.push ? article.push.msgTitle : ''
              }
            )(<TextArea rows={5} style={{ resize: 'none' }} />)}
          </FormItem>
          <FormItem wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 },
          }}
          >
            <Button type="primary" htmlType="submit">修改</Button>
          </FormItem>
        </Form>);
    }
}

const PushNew = graphql(ARTICLEPUSH_SUBMIT, {
  props: ({ ownProps: { push }, ...props }) => ({
    ...props,
    isedit: false,
    submit: entity => props.mutate({
      variables: { entity: { ...push, ...entity, msgType: 0 } },
      refetchQueries: [{
        query: ARITCLE_QUERY,
        variables: {
          id: push.msgId
        },
        fetchPolicy: 'network-only'
      }]
    })
  }),
})(PushForm);

const PushEdit = graphql(ARTICLEPUSH_UPDATE, {
  props: ({ ownProps: { push: { id, ...push } }, ...props }) => ({
    ...props,
    isedit: true,
    submit: entity => props.mutate({
      variables: { id, entity: { ...push, ...entity, msgType: 0 } }
    })
  }),
})(PushForm);

class Push extends Component {
    static propTypes = {
      article: PropTypes.object.isRequired
    }
    render() {
      const { article: { id, push } } = this.props;
      if (!push) {
        return <PushNew push={{ ...push, msgId: id }} />;
      }
      const { __typename, ...newpush } = push;
      return <PushEdit push={{ ...newpush, msgId: id }} />;
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
    }

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
        client.query({
          query: ARITCLE_QUERY,
          variables: { id: value, type: 'sn' },
          fetchPolicy: 'network-only'
        }).then(({ data: { article: check } }) => {
          if (check && check.id !== article.id) {
            this.setState({ url: { validateStatus: 'error', help: '链接已存在!' } });
          } else {
            this.setState({ url: { validateStatus: null, help: null } });
            this.handleSaveUrl(value);
          }
        });
      });
    }

    render() {
      const { handleClose, handleSave, article: { cover, sn, tags: defaultTags = [], author, publishDate, ...article }, data: { tags = [] } } = this.props;
      const { url: { validateStatus, help } } = this.state;
      // 普通设置
      const content = (<div>
        <Uploader mode="avatar" onChange={handleSave('cover')} defaultValue={cover && cover.path} />
        <FormGroup label="链接">
          <FormItem
            validateStatus={validateStatus}
            hasFeedback
            help={help}
          >
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
          <Input onChange={handleSave('author')} className="Author" prefix={<Icon type="user" />} defaultValue={author} />
        </FormGroup>
      </div>);

        // 二十四节气设置 + SEO 设置
      const extras = [<ExtraSettings title="二十四节气推送" summary="节气数据推送设置">
        <Push article={article} />
      </ExtraSettings>, <ExtraSettings title="SEO 优化设置" summary="设置 SEO 优化相关内容">
        <MetaData />
      </ExtraSettings>];

      return (
        <Settings title="文章设置" handleClose={handleClose} content={content} extras={extras} />
      );
    }
}
