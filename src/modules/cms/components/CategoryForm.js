import React, { PropTypes, Component } from 'react';
import { graphql } from 'react-apollo';
import { isEqual } from 'lodash';
import { Modal, Form, Input, TreeSelect, Radio, Icon, message } from 'antd';

import { Uploader } from '../../../components';

import CATEGORYS_QUERY from '../graphqls/articleCategorys.gql';
import CATEGORY_QUERY from '../graphqls/articleCategory.gql';
import CATEGORY_SUBMIT from '../graphqls/addCategories.gql';
import CATEGORY_UPDATE from '../graphqls/article_category_update.gql';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { TextArea } = Input;

// 增加的模态框
@Form.create()
class CategoryForm extends Component {
  static propTypes = {
    submit: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    category: PropTypes.object.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    categoryTree: PropTypes.array.isRequired,
    isedit: PropTypes.bool.isRequired,
    visible: PropTypes.bool.isRequired
  };
  componentDidMount() {
    const { form: { setFieldsValue }, category: { layer, path, sort, ...newCategory } } = this.props;
    setFieldsValue(newCategory);
  }

  componentWillUpdate(nextProps) {
    const { category: oldCategory = {} } = this.props;
    const { category: nextCategory = {} } = nextProps;
    if (!isEqual(oldCategory, nextCategory)) {
      const { form: { setFieldsValue }, category: { layer, path, sort, ...newCategory } } = nextProps;
      setFieldsValue(newCategory);
    }
  }

  // submit提交事件
  handleSubmit = e => {
    e.preventDefault();
    const { form, submit, onSuccess } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        submit(values)
          .then(({ data: { category: { id } } }) => {
            message.success('保存成功！');
            onSuccess(id);
          })
          .catch(error => {
            console.error(error);
            message.error('保存失败！');
          });
      }
    });
  };

  render() {
    const {
      visible,
      onCancel,
      form: { getFieldDecorator },
      categoryTree,
      client,
      isedit,
      category: { parentId = false }
    } = this.props;
    return (
      <Modal
        visible={visible}
        title={isedit ? '编辑分类' : '新建分类'}
        okText="保存"
        onCancel={onCancel}
        onOk={this.handleSubmit}
      >
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          <FormItem label="父栏目">
            {getFieldDecorator('parentId')(
              <TreeSelect
                style={{ width: 300 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={categoryTree}
                placeholder="Please select"
                treeDefaultExpandAll
                disabled={!parentId}
              />
            )}
          </FormItem>
          <FormItem label="栏目编码">
            {getFieldDecorator('id', {
              rules: isedit
                ? []
                : [
                    {
                      validator: (rule, value, callback) => {
                        client
                          .query({
                            query: CATEGORY_QUERY,
                            variables: { id: value },
                            fetchPolicy: 'network-only'
                          })
                          .then(({ data: { category } }) => (category ? callback('编号重复') : callback()));
                      }
                    },
                    {
                      required: true,
                      message: '编码不能为空!'
                    }
                  ]
            })(<Input disabled={isedit} prefix={<Icon type="book" style={{ fontSize: 13 }} />} placeholder="栏目编码" />)}
          </FormItem>
          <FormItem label="栏目类型">
            {getFieldDecorator('type')(
              <RadioGroup>
                <RadioButton value="article">普通栏目</RadioButton>
                <RadioButton value="circle">圈子</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="栏目名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入栏目名称' }]
            })(<Input prefix={<Icon type="book" style={{ fontSize: 13 }} />} placeholder="栏目名称" />)}
          </FormItem>

          {/* 图片上传 */}
          <FormItem label="文章封面">{getFieldDecorator('cover')(<Uploader />)}</FormItem>

          {/* 文章描述 */}
          <FormItem label="文章描述">
            {getFieldDecorator('description')(<TextArea autosize={{ minRows: 2, maxRows: 6 }} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export const CategorySubmitForm = graphql(CATEGORY_SUBMIT, {
  props: props => ({
    ...props,
    isedit: false,
    submit: data =>
      props.mutate({
        variables: { entity: data },
        refetchQueries: [
          {
            query: CATEGORYS_QUERY
          }
        ]
      })
  })
})(CategoryForm);

export const CategoryUpdateForm = graphql(CATEGORY_UPDATE, {
  props: props => ({
    ...props,
    isedit: true,
    submit: data =>
      props.mutate({
        variables: { entity: data },
        refetchQueries: [
          {
            query: CATEGORYS_QUERY
          }
        ]
      })
  })
})(CategoryForm);

export default { CategorySubmitForm, CategoryUpdateForm };
