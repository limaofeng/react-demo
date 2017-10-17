import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class PageContent extends Component {
  static propTypes = {
    breadcrumbs: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired
  };
  componentDidMount() {}
  componentWillUnmount() {}
  fullScreenClick = e => {
    e.preventDefault();
    const element = document.documentElement;
    if (!$('body').hasClass('full-screen')) {
      $('body').addClass('full-screen');
      $('#fullscreen-toggler').addClass('active');
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    } else {
      $('body').removeClass('full-screen');
      $('#fullscreen-toggler').removeClass('active');
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };
  sideBarClick = e => {
    e.preventDefault();
    $('#sidebar').toggleClass('hide');
    $('.sidebar-toggler').toggleClass('active');
    return false;
  };
  render() {
    const { breadcrumbs, title, children } = this.props;
    return (
      <div className="page-content">
        <div className="page-breadcrumbs">
          <ul className="breadcrumb">
            <li>
              <i className="fa fa-home" />
              <Link to="/">Home</Link>
            </li>
            {breadcrumbs}
          </ul>
        </div>
        <div className="page-header position-relative" style={{ display: 'none' }}>
          <div className="header-title">
            <h1>
              {title}
              <small>
                <i className="fa fa-angle-right" />
              </small>
            </h1>
          </div>
        </div>
        {children}
      </div>
    );
  }
}

/*
                <div className={classnames('page-body', this.props.noPadding ? 'no-padding' : '')}>

                </div>
<div className="header-buttons">
    <a className="sidebar-toggler" onClick={this.sideBarClick}>
        <i className="fa fa-arrows-h" />
    </a>
    <a className="refresh" id="refresh-toggler">
        <i className="glyphicon glyphicon-refresh" />
    </a>
    <a className="fullscreen" id="fullscreen-toggler" onClick={this.fullScreenClick}>
        <i className="glyphicon glyphicon-fullscreen" />
    </a>
</div>
*/

export default PageContent;
