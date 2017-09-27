import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as UIActions from '../../redux/modules/ui/index';
import * as utils from '../../utils/Format';
import FormMessages, { generateValidation } from 'redux-form-validation';


import { setHeaderTitle } from '../../redux/modules/ui/index';
import { add, fetchPager } from '../../redux/modules/medicine';
import { reduxForm, initialize } from 'redux-form';
import Field, { verify } from './../../components/Field';
import { push } from 'react-router-redux';

const validations = {
  name: {
    required: false
  },
  type: {
    required: false
  },
  unit: {
    required: false
  },
  weight: {
    required: false
  },
  market_price: {
    required: false
  },
  alias: {
    required: false
  },
  note: {
    required: false
  }
};
@connect(state => ({ pager: state.medicines.pager }), dispatch => ({
  uiactions: bindActionCreators(UIActions, dispatch),
  dispatch
}))
@reduxForm({
  form: 'medicineForm',
  ...generateValidation(validations)
})
class AddCategory extends Component {
    static propTypes = {
      dispatch: PropTypes.func.isRequired,
      history: PropTypes.object.isRequired,
    }

    constructor(props) {
      super(props);
      this.submit = this.submit.bind(this);
    }

    componentDidMount() {
      const { uiactions } = this.props;
      uiactions.setHeaderTitle('药品管理');
    }

    // 返回上一页
    goBack() { window.history.back(); }

    // 添加
    submit(values, dispatch) {
      const { history } = this.props;
      values.category_id = 1;
      values.alias = values.alias.split('；');
      console.log(values);
      return dispatch(add(values)).then(data => {
        $.alert.success('添加成功');
        fetchPager();
        dispatch(push('/medicines/index'));
      }).catch(error => {
        $.alert.error('添加失败');
      });
    }

    render() {
      const { areas, fields: { name, type, unit, weight, market_price, alias, note }, handleSubmit, submitting, addresses } = this.props;

      return (<div className="row">
        <div className="col-lg-12 col-sm-12 col-xs-12">
          <div className="widget flat radius-bordered">
            <div className="widget-header bg-blue">
              <span className="widget-caption">药品添加</span>

            </div>
            <div className="widget-body">
              <div id="registration-form">
                <form id="medicineForm" role="form" onSubmit={handleSubmit(this.submit)}>
                  <div className="form-title">
                    <span>药品添加</span>
                    <span className="pull-right" onClick={this.goBack} style={{ cursor: 'pointer' }}>
                      <i className="fa fa-mail-reply" />
                    </span>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail2">药品名称<span style={{ color: 'red' }}>*</span></label>
                        <span className="input-icon icon-right">
                            <input type="text" className="form-control" {...name} />
                            <i className="fa fa-envelope blue" />
                          </span>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label htmlFor="exampleInputName2">药品类型<span style={{ color: 'red' }}>*</span></label>
                        <span className="input-icon icon-right">
                            <select className="form-control" {...type}>
                            <option>请选择药品类型</option>
                            <option value="decoctionPieces">饮片</option>
                            <option value="granules">颗粒</option>
                            <option value="thickPaste">膏方</option>
                          </select>
                          </span>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail2">计量单位<span style={{ color: 'red' }}>*</span></label>
                        <span className="input-icon icon-right">
                            <input type="text" className="form-control" {...unit} />
                            <i className="fa fa-envelope blue" />
                          </span>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label htmlFor="exampleInputName2">单位重量<span style={{ color: 'red' }}>*</span></label>
                        <span className="input-icon icon-right">
                            <input type="text" className="form-control" {...weight} />
                            <i className="glyphicon glyphicon-user palegreen" />
                          </span>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail2">市场价<span style={{ color: 'red' }}>*</span></label>
                        <span className="input-icon icon-right">
                            <input type="text" className="form-control" {...market_price} />
                            <i className="fa fa-envelope blue" />
                          </span>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label htmlFor="exampleInputName2">别名                                <small style={{ color: '#999' }}>（多个用；号分割）</small></label>
                        <span className="input-icon icon-right">
                            <input type="text" className="form-control" {...alias} />
                            <i className="glyphicon glyphicon-user palegreen" />
                          </span>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail2">备注<span style={{ color: 'red' }}>*</span></label>
                        <span className="input-icon icon-right">
                            <textarea className="form-control" rows="10" {...note} />
                            <i className="glyphicon glyphicon-briefcase darkorange" />
                          </span>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-1 col-lg-offset-5">
                      <button type="submit" disabled={submitting} className="btn btn-success btn-block" style={{ 'font-family': '微软雅黑', 'font-size': '1.2em', 'letter-spacing': '0.3em' }}>
                        {submitting ? <i className="fa fa-circle-o-notch fa-spin" /> : '保存'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div >);
    }
}
export default AddCategory;
