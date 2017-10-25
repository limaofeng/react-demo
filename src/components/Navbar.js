// import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Upload, Icon, message } from 'antd';

import LoginArea from './navbar/LoginArea';
import { lazy } from './../helpers/lazy';
// import { logout, resetpwd } from '../reducers/auth';

/* global themeprimary setCookiesForFixedSettings location */

class AccountItem extends Component {
  componentDidMount() {}

  render() {
    return (
      <li>
        <a>
          <div className="clearfix">
            <div className="notification-icon">
              <i className="fa fa-phone bg-themeprimary white" />
            </div>
            <div className="notification-body">
              <span className="title">{this.props.title}</span>
              <span className="description">{this.props.desc}</span>
            </div>
            <div className="notification-extra">
              <i className="fa fa-clock-o themeprimary" />
              <span className="description">{this.props.extra}</span>
            </div>
          </div>
        </a>
      </li>
    );
  }
}

AccountItem.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  extra: PropTypes.string.isRequired
};

const MessageItem = ({ sender, time, subject, body }) => (
  <li>
    <a>
      <img src={`${__PUBLIC_URL__}/assets/img/avatars/divyia.jpg`} className="message-avatar" alt="Divyia Austin" />
      <div className="message">
        <span className="message-sender">{sender}</span>
        <span className="message-time">{time}</span>
        <span className="message-subject">{subject}</span>
        <span className="message-body">{body}</span>
      </div>
    </a>
  </li>
);

MessageItem.propTypes = {
  sender: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired
};

const TaskItem = ({ title, percent }) => (
  <li>
    <a>
      <div className="clearfix">
        <span className="pull-left">{title}</span>
        <span className="pull-right">{percent}</span>
      </div>
      <div className="progress progress-xs">
        <div style={{ width: '65%' }} className="progress-bar" />
      </div>
    </a>
  </li>
);

TaskItem.propTypes = {
  title: PropTypes.string.isRequired,
  percent: PropTypes.string.isRequired
};

const NavbarBrand = () => (
  <div className="navbar-header pull-left">
    <a className="navbar-brand">
      <small>
        <img src={`${__PUBLIC_URL__}/assets/img/logo.png`} alt="" />
      </small>
    </a>
  </div>
);

class SideBar extends Component {
  handleClick = e => {
    let b = $('#sidebar').hasClass('menu-compact');
    if (!$('#sidebar').is(':visible')) {
      $('#sidebar').toggleClass('hide');
    }
    $('#sidebar').toggleClass('menu-compact');
    $('.sidebar-collapse').toggleClass('active');
    b = $('#sidebar').hasClass('menu-compact');

    if (
      $('.sidebar-menu')
        .closest('div')
        .hasClass('slimScrollDiv')
    ) {
      $('.sidebar-menu').slimScroll({ destroy: true });
      $('.sidebar-menu').attr('style', '');
    }
    if (b) {
      $('.open > .submenu').removeClass('open');
    } else if ($('.page-sidebar').hasClass('sidebar-fixed')) {
      $('.sidebar-menu').slimscroll({
        height: 'auto',
        position: 'left',
        size: '3px',
        color: themeprimary
      });
    }
    e.preventDefault();
    // TODO 从 cookie 读取比较合适
  };
  render() {
    return (
      <div className="sidebar-collapse" id="sidebar-collapse" onClick={this.handleClick} role="none">
        <i className="collapse-icon fa fa-bars" />
      </div>
    );
  }
}

@connect(({ modules }) => ({ user: modules.get('currentUser').toObject() }))
class NavbarHeaderRight extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.lazy = lazy($(window).height(), { delay: 500 });
  }
  componentDidMount() {
    this.initiateSettings();
  }
  componentWillUnmount() {
    $(window).off('resize', this.initiateScroll);
  }
  settingsClick = e => {
    $('.navbar-account').toggleClass('setting-open');
    e.preventDefault();
  };
  chatClick = e => {
    $('.page-chatbar').toggleClass('open');
    $('#chat-link').toggleClass('open');
    e.preventDefault();
  };
  initiateScroll = () => {
    this.lazy($(window).height()).then(() => {
      $('.sidebar-menu').slimscroll({
        height: $(window).height() - 90,
        position: 'left',
        size: '3px',
        color: themeprimary
      });
    });
  };

  initiateSettings = () => {
    // if (readCookie('navbar-fixed-top') != null) {
    //    if (readCookie('navbar-fixed-top') === 'true') {
    $('#checkbox_fixednavbar').prop('checked', true);
    $('.navbar').addClass('navbar-fixed-top');
    //    }
    // }

    // if (readCookie('sidebar-fixed') != null) {
    //     if (readCookie('sidebar-fixed') === 'true') {
    $('#checkbox_fixedsidebar').prop('checked', true);
    $('.page-sidebar').addClass('sidebar-fixed');

    if (!$('.page-sidebar').hasClass('menu-compact')) {
      this.initiateScroll();
      $(window).on('resize', this.initiateScroll);
    }
    //    }
    // }

    // if (readCookie('breadcrumbs-fixed') != null) {
    //    if (readCookie('breadcrumbs-fixed') === 'true') {
    $('#checkbox_fixedbreadcrumbs').prop('checked', true);
    $('.page-breadcrumbs').addClass('breadcrumbs-fixed');
    //    }
    // }

    // if (readCookie('page-header-fixed') != null) {
    //    if (readCookie('page-header-fixed') === 'true') {
    $('#checkbox_fixedheader').prop('checked', true);
    $('.page-header').addClass('page-header-fixed');
    //    }
    // }
    $('#checkbox_fixednavbar').change(function() {
      $('.navbar').toggleClass('navbar-fixed-top');
      if ($('#checkbox_fixedsidebar').is(':checked')) {
        $('#checkbox_fixedsidebar').prop('checked', false);
        $('.page-sidebar').toggleClass('sidebar-fixed');
      }

      if ($('#checkbox_fixedbreadcrumbs').is(':checked') && !$(this).is(':checked')) {
        $('#checkbox_fixedbreadcrumbs').prop('checked', false);
        $('.page-breadcrumbs').toggleClass('breadcrumbs-fixed');
      }

      if ($('#checkbox_fixedheader').is(':checked') && !$(this).is(':checked')) {
        $('#checkbox_fixedheader').prop('checked', false);
        $('.page-header').toggleClass('page-header-fixed');
      }
      setCookiesForFixedSettings();
    });

    $('#checkbox_fixedsidebar').change(function() {
      $('.page-sidebar').toggleClass('sidebar-fixed');
      if (!$('#checkbox_fixednavbar').is(':checked')) {
        $('#checkbox_fixednavbar').prop('checked', true);
        $('.navbar').toggleClass('navbar-fixed-top');
      }
      if ($('#checkbox_fixedbreadcrumbs').is(':checked') && !$(this).is(':checked')) {
        $('#checkbox_fixedbreadcrumbs').prop('checked', false);
        $('.page-breadcrumbs').toggleClass('breadcrumbs-fixed');
      }
      if ($('#checkbox_fixedheader').is(':checked') && !$(this).is(':checked')) {
        $('#checkbox_fixedheader').prop('checked', false);
        $('.page-header').toggleClass('page-header-fixed');
      }
      setCookiesForFixedSettings();
    });
    $('#checkbox_fixedbreadcrumbs').change(function() {
      $('.page-breadcrumbs').toggleClass('breadcrumbs-fixed');
      if (!$('#checkbox_fixedsidebar').is(':checked')) {
        $('#checkbox_fixedsidebar').prop('checked', true);
        $('.page-sidebar').toggleClass('sidebar-fixed');
      }
      if (!$('#checkbox_fixednavbar').is(':checked')) {
        $('#checkbox_fixednavbar').prop('checked', true);
        $('.navbar').toggleClass('navbar-fixed-top');
      }
      if ($('#checkbox_fixedheader').is(':checked') && !$(this).is(':checked')) {
        $('#checkbox_fixedheader').prop('checked', false);
        $('.page-header').toggleClass('page-header-fixed');
      }
      setCookiesForFixedSettings();
    });
    $('#checkbox_fixedheader').change(() => {
      $('.page-header').toggleClass('page-header-fixed');
      if (!$('#checkbox_fixedbreadcrumbs').is(':checked')) {
        $('#checkbox_fixedbreadcrumbs').prop('checked', true);
        $('.page-breadcrumbs').toggleClass('breadcrumbs-fixed');
      }
      if (!$('#checkbox_fixedsidebar').is(':checked')) {
        $('#checkbox_fixedsidebar').prop('checked', true);
        $('.page-sidebar').toggleClass('sidebar-fixed');
      }
      if (!$('#checkbox_fixednavbar').is(':checked')) {
        $('#checkbox_fixednavbar').prop('checked', true);
        $('.navbar').toggleClass('navbar-fixed-top');
      }
      setCookiesForFixedSettings();
    });
  };
  render() {
    const { user } = this.props;
    console.log(user.nickName);
    return (
      <div className="navbar-header pull-right">
        <div id="editPasswordDiv" style={{ display: 'none' }}>
          <form method="post" action="">
            <div className="row">
              <div className="col-md-12">
                <small className="error-message topTip" />
                <div className="form-group">
                  <input type="password" className="form-control" name="oldpwd" placeholder="请输入您的密码" />
                  <small className="error-message" />
                </div>
                <div className="form-group">
                  <input type="password" className="form-control" name="newpwd" placeholder="新密码" />
                  <small className="error-message" />
                </div>
                <div className="form-group">
                  <input type="password" className="form-control" name="repwd" placeholder="确认新密码" />
                  <small className="error-message" />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="navbar-account">
          <ul className="account-area">
            <li>
              <a className=" dropdown-toggle" data-toggle="dropdown" title="Notifications">
                <i className="icon fa fa-warning" />
              </a>
              <ul className="pull-right dropdown-menu dropdown-arrow dropdown-notifications">
                <AccountItem title="Skype meeting with Patty" desc="01:00 pm" extra="office" />
                <AccountItem title="Uncharted break" desc="03:30 pm - 05:15 pm" extra="" />
                <AccountItem title="Kate birthday party" desc="08:30 pm" extra="at home" />
                <AccountItem title="Dinner with friends" desc="10:30 pm" extra="" />
                <li className="dropdown-footer ">
                  <span>Today, March 28</span>
                  <span className="pull-right">
                    10°c
                    <i className="wi wi-cloudy" />
                  </span>
                </li>
              </ul>
            </li>
            <li>
              <a className="dropdown-toggle" data-toggle="dropdown" title="Mails">
                <i className="icon fa fa-envelope" />
                <span className="badge">3</span>
              </a>
              <ul className="pull-right dropdown-menu dropdown-arrow dropdown-messages">
                <MessageItem
                  sender="Divyia Austin"
                  time="2 minutes ago"
                  subject="Here's the recipe for apple pie"
                  body="to identify the sending application when the senders image is shown for the main icon"
                />
                <MessageItem
                  sender="Bing.com"
                  time="Yesterday"
                  subject="Bing Newsletter: The January Issue‏"
                  body="Discover new music just in time for the Grammy® Awards."
                />
                <MessageItem
                  sender="Nicolas"
                  time="Friday, September 22"
                  subject="New 4K Cameras"
                  body="The 4K revolution has come over the horizon and is reaching the general populous"
                />
              </ul>
            </li>
            <li>
              <a className="dropdown-toggle" data-toggle="dropdown" title="Tasks" role="none">
                <i className="icon fa fa-tasks" />
                <span className="badge">4</span>
              </a>
              <ul className="pull-right dropdown-menu dropdown-tasks dropdown-arrow ">
                <li className="dropdown-header bordered-darkorange">
                  <i className="fa fa-tasks" />
                  4 Tasks In Progress
                </li>
                <TaskItem title="Account Creation" percent="65%" />
                <TaskItem title="Profile Data" percent="35%" />
                <TaskItem title="Updating Resume" percent="75%" />
                <TaskItem title="Adding Contacts" percent="10%" />
                <li className="dropdown-footer">
                  <a>See All Tasks</a>
                  <button className="btn btn-xs btn-default shiny darkorange icon-only pull-right">
                    <i className="fa fa-check" />
                  </button>
                </li>
              </ul>
            </li>
            <li>
              <a className="wave in" id="chat-link" title="Chat" onClick={this.chatClick} role="none">
                <i className="icon glyphicon glyphicon-comment" />
              </a>
            </li>
            <LoginArea />
          </ul>
          <div className="setting" style={{ display: 'none' }}>
            <a id="btn-setting" title="Setting" onClick={this.settingsClick} role="none">
              <i className="icon glyphicon glyphicon-cog" />
            </a>
          </div>
          <div className="setting-container" style={{ width: '420px', display: 'none' }}>
            <label htmlFor="checkbox_fixednavbar">
              <input type="checkbox" id="checkbox_fixednavbar" />
              <span className="text">固定导航栏</span>
            </label>
            <label htmlFor="checkbox_fixedsidebar">
              <input type="checkbox" id="checkbox_fixedsidebar" />
              <span className="text">固定侧栏</span>
            </label>
            <label htmlFor="checkbox_fixedbreadcrumbs">
              <input type="checkbox" id="checkbox_fixedbreadcrumbs" />
              <span className="text">固定导航栏</span>
            </label>
            <label htmlFor="checkbox_fixedheader">
              <input type="checkbox" id="checkbox_fixedheader" />
              <span className="text">固定标题栏</span>
            </label>
          </div>
        </div>
      </div>
    );
  }
}

class Navbar extends Component {
  componentDidMount() {}

  render() {
    return (
      <div className="navbar">
        <div className="navbar-inner">
          <div className="navbar-container">
            <NavbarBrand />
            <SideBar />
            <NavbarHeaderRight />
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;
