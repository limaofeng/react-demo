import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import FormMessages, { generateValidation } from 'redux-form-validation';

import { PageBody, Widget } from '../../components';

import BannerItems from './BannerItems';

import { BannerSubmitForm } from './BannerForm';

export default class BannerAdd extends Component {
  render() {
    return (
      <PageBody>
        <Widget title=" 新增 Banner ">
          <BannerSubmitForm />
        </Widget>
      </PageBody>
    );
  }
}
