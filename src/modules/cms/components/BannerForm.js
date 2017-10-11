import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { graphql, withApollo } from 'react-apollo';

import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, message } from 'antd';

import * as utils from '../../helpers/Format';
import { picturePath } from '../../config/urls';
import { PageBody, TabPanel, Widget, FormGroup } from '../../components';

import BannerItems from './BannerItems';

import BANNERS_QUERY from './gql/banners.graphql';
import BANNER_QUERY from './gql/banner.graphql';
import BANNER_SUBMIT from './gql/banner_submit.graphql';
import BANNER_UPDATE from './gql/banner_update.graphql';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

@withApollo
@connect()
@Form.create()
class BannerForm extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    submit: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    isedit: PropTypes.bool.isRequired,
    banner: PropTypes.object
  };

  componentDidMount() {
    const { form: { setFieldsValue }, banner } = this.props;
    if (banner) {
      // TODO 可以通过工具类实现 深度 clone 并 去除 __typename 字段
      const { __typename: t1, ...cloneBanner } = banner;
      cloneBanner.items = cloneBanner.items.map(({ __typename, picture, ...item }) => ({
        ...item,
        picture: picture && picture.path
      }));
      setFieldsValue(cloneBanner);
    }
  }

  // submit提交事件
  handleSubmit = e => {
    e.preventDefault();
    const { form, submit } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        submit(values)
          .then(data => {
            message.success('保存成功！');
            window.history.back();
          })
          .catch(error => {
            console.error(error);
            message.error('保存失败！');
          });
      }
    });
  };

  render() {
    const { form: { getFieldDecorator }, client, isedit } = this.props;

    return (
      <Form onSubmit={this.handleSubmit} className="ant-full-form">
        <Row>
          <Col span={12}>
            <FormItem label="编码">
              {getFieldDecorator('id', {
                rules: isedit
                  ? []
                  : [
                      {
                        validator: (rule, value, callback) => {
                          if (!/^[\da-zA-Z_]+$/g.test(value)) {
                            callback('编码只能包含数字、字母、下划线!');
                            return;
                          }
                          client
                            .query({
                              query: BANNER_QUERY,
                              variables: { id: value }
                            })
                            .then(({ data: { banner } }) => (banner ? callback('编号重复') : callback()));
                        }
                      },
                      {
                        required: true,
                        message: '编码不能为空!'
                      }
                    ]
              })(<Input disabled={isedit} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '名称不能为空!'
                  }
                ]
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <FormItem label="描述">
            {getFieldDecorator('description')(
              <TextArea placeholder="输入 Banner 描述" autosize={{ minRows: 2, maxRows: 6 }} />
            )}
          </FormItem>
        </Row>
        <Row>
          <FormItem label="图片">{getFieldDecorator('items')(<BannerItems />)}</FormItem>
        </Row>
        <Row>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Row>
      </Form>
    );
  }
}

export const BannerSubmitForm = graphql(BANNER_SUBMIT, {
  props: props => ({
    ...props,
    isedit: false,
    submit: data =>
      props.mutate({
        variables: data,
        refetchQueries: [
          {
            query: BANNERS_QUERY
          }
        ]
      })
  })
})(BannerForm);

export const BannerUpdateForm = graphql(BANNER_UPDATE, {
  props: props => ({
    ...props,
    isedit: true,
    submit: data =>
      props.mutate({
        variables: data,
        refetchQueries: [
          {
            query: BANNERS_QUERY
          }
        ]
      })
  })
})(BannerForm);

export default { BannerSubmitForm, BannerUpdateForm };
