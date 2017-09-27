import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import classnames from 'classnames';

import * as ModalActions from '../../reducers/ui/Modals';

class Alert extends Component {
  render() {
    const {} = this.props;

    return (<div id="modal-success" className="modal modal-message modal-success fade" style={{ display: 'none' }} aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <i className="glyphicon glyphicon-check" />
          </div>
          <div className="modal-title">Success</div>

          <div className="modal-body">You have done great!</div>
          <div className="modal-footer">
            <button type="button" className="btn btn-success" data-dismiss="modal">OK</button>
          </div>
        </div>
      </div>
    </div>);
  }
}

class AModals extends Component {
  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    const { actions, modals } = this.props;

    switch (modals.type) {
      case 'close':
        break;
      default:
        $('#modal-message').on('hidden.bs.modal', e => {
          actions.close();
        }).modal('show');
    }
  }

  getSettings() {
    const { modals } = this.props;

    const settings = { ...modals, buttonText: '确定' };

    switch (modals.type) {
      case 'Success':
        settings.modalClass = 'modal-success';
        settings.headerClass = 'glyphicon glyphicon-check';
        settings.buttonClass = 'btn-success';
        break;
      case 'Info':
        settings.modalClass = 'modal-info';
        settings.headerClass = 'fa fa-envelope';
        settings.buttonClass = 'btn-info';
        break;
      case 'Danger':
        settings.modalClass = 'modal-danger';
        settings.headerClass = 'glyphicon glyphicon-fire';
        settings.buttonClass = 'btn-danger';
        break;
      case 'Warning':
        settings.modalClass = 'modal-warning';
        settings.headerClass = 'fa fa-warning';
        settings.buttonClass = 'btn-warning';
        break;
      default:
        settings.type = null;
    }
    return settings;
  }

  render() {
    const settings = this.getSettings();

    return !settings.type ? <div /> : (
      <div>
        <div id="modal-message" className={classnames('modal modal-message fade', settings.modalClass)} style={{ display: 'none' }} aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <i className={settings.headerClass} />
              </div>
              <div className="modal-title">{settings.title}</div>

              <div className="modal-body">{settings.body}</div>
              <div className="modal-footer">
                <button type="button" className={classnames('btn', settings.buttonClass)} data-dismiss="modal">{settings.buttonText}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Alert;

export const Modals = connect(state => ({
  modals: state.ui.modals
}), dispatch => ({
  actions: bindActionCreators(ModalActions, dispatch)
}))(AModals);

/*
 <div id="myModal" style={{"display":"none"}}>
 <div className="row">
 <div className="col-md-12">
 <div className="form-group">
 <input type="text" className="form-control" placeholder="To" required=""/>
 </div>
 <div className="form-group">
 <input type="text" className="form-control" placeholder="Subject" required=""/>
 </div>
 <div className="form-group">
 <textarea className="form-control" placeholder="Content" rows="5" required=""/>
 </div>
 </div>
 </div>
 </div>
*/
