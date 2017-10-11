import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { graphql } from 'react-apollo';

import { PageBody, Widget } from '../../components';

import BannerItems from './BannerItems';

import { BannerUpdateForm } from './BannerForm';

import BANNER_QUERY from './gql/banner.graphql';

@graphql(BANNER_QUERY, {
  options: ({ match: { params: { id } } }) => ({
    variables: {
      id
    },
    fetchPolicy: 'network-only'
  })
})
class BannerEdit extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  };

  render() {
    const { data: { loading, banner } } = this.props;
    return (
      <PageBody>
        <Widget title=" 编辑 Banner ">{loading ? '数据加载中...' : <BannerUpdateForm banner={banner} />}</Widget>
      </PageBody>
    );
  }
}

export default BannerEdit;
