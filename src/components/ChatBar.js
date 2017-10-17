/* global readCookie themeprimary location */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { lazy } from './../helpers/lazy';

class Contact extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    last: PropTypes.string.isRequired
  };
  handleClick = e => {
    e.preventDefault();
    $('.page-chatbar .chatbar-contacts').hide();
    $('.page-chatbar .chatbar-messages').show();
  };
  render() {
    const { name, status, last } = this.props;
    return (
      <li className="contact" onClick={this.handleClick} role="none">
        <div className="contact-avatar">
          <img alt="" src="/assets/img/avatars/John-Smith.jpg" />
        </div>
        <div className="contact-info">
          <div className="contact-name">{name}</div>
          <div className="contact-status">
            <div className="online" />
            <div className="status">{status}</div>
          </div>
          <div className="last-chat-time">{last}</div>
        </div>
      </li>
    );
  }
}

class ContactList extends Component {
  constructor(props) {
    super(props);
    this.lazy = lazy($(window).height(), { delay: 500 });
  }
  componentDidMount() {
    this.initiateScroll();
    $(window).on('resize', this.initiateScroll);
  }
  componentWillUnmount() {
    $(window).off('resize', this.initiateScroll);
  }
  initiateScroll = () => {
    this.lazy($(window).height()).then(() => {
      let additionalHeight = 0;
      if ($(window).width() < 531) {
        additionalHeight = 45;
      }
      const position =
        readCookie('rtl-support') ||
        // eslint-disable-next-line
        location.pathname === '/index-rtl-fa.html' ||
        // eslint-disable-next-line
        location.pathname === '/index-rtl-ar.html'
          ? 'right'
          : 'left';
      $('.chatbar-contacts .contacts-list').slimscroll({
        position,
        size: '4px',
        color: themeprimary,
        height: $(window).height() - (86 + additionalHeight)
      });
    });
  };

  render() {
    return (
      <ul className="contacts-list">
        <Contact name="Divyia Philips" status="online" last="last week" />
        <Contact name="Adam Johnson" status="left 4 mins ago" last="today" />
        <Contact name="John Smith" status="online" last="1:57 am" />
        <Contact name="Osvaldus Valutis" status="online" last="today" />
        <Contact name="Javi Jimenez" status="online" last="today" />
        <Contact name="Stephanie Walter" status="online" last="yesterday" />
        <Contact name="Sergey Azovskiy" status="offline since oct 24" last="22 oct" />
        <Contact name="Lee Munroe" status="online" last="today" />
        <Contact name="Divyia Philips" status="online" last="last week" />
      </ul>
    );
  }
}

class ContactSearch extends Component {
  render() {
    return (
      <div className="contacts-search">
        <input type="text" className="searchinput" placeholder="Search Contacts" />
        <i className="searchicon fa fa-search" />
        <div className="searchhelper">Search Your Contacts and Chat History</div>
      </div>
    );
  }
}

class ChatContact extends Component {
  render() {
    return (
      <div className="chatbar-contacts">
        <ContactSearch />
        <ContactList />
      </div>
    );
  }
}

class ChatMessage extends Component {
  static propTypes = {
    sender: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  };
  render() {
    return (
      <li className="message">
        <div className="message-info">
          <div className="bullet" />
          <div className="contact-name">{this.props.sender}</div>
          <div className="message-time">{this.props.time}</div>
        </div>
        <div className="message-body">{this.props.text}</div>
      </li>
    );
  }
}

class ChatReply extends Component {
  static propTypes = {
    sender: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  };
  render() {
    return (
      <li className="message reply">
        <div className="message-info">
          <div className="bullet" />
          <div className="contact-name">{this.props.sender}</div>
          <div className="message-time">{this.props.time}</div>
        </div>
        <div className="message-body">{this.props.text}</div>
      </li>
    );
  }
}

class ChatList extends Component {
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
  initiateSettings = () => {
    this.initiateScroll();
    $(window).on('resize', this.initiateScroll);
  };
  initiateScroll = () => {
    this.lazy($(window).height()).then(() => {
      const position =
        readCookie('rtl-support') ||
        // eslint-disable-next-line
        location.pathname === '/index-rtl-fa.html' ||
        // eslint-disable-next-line
        location.pathname === '/index-rtl-ar.html'
          ? 'right'
          : 'left';
      let additionalHeight = 0;
      if ($(window).width() < 531) {
        additionalHeight = 45;
      }
      $('.chatbar-messages .messages-list').slimscroll({
        position,
        size: '4px',
        color: themeprimary,
        height: $(window).height() - (250 + additionalHeight)
      });
    });
  };
  render() {
    return (
      <ul className="messages-list">
        <ChatMessage sender="Me" time="10:14 AM, Today" text="Hi, Hope all is good. Are we meeting today?" />
        <ChatReply sender="Divyia" time="10:15 AM, Today" text="Hi, Hope all is good. Are we meeting today?" />
        <ChatMessage sender="Me" time="10:14 AM, Today" text="Hi, Hope all is good. Are we meeting today?" />
        <ChatReply sender="Divyia" time="10:15 AM, Today" text="Hi, Hope all is good. Are we meeting today?" />
        <ChatMessage sender="Me" time="10:14 AM, Today" text="Hi, Hope all is good. Are we meeting today?" />
        <ChatReply sender="Divyia" time="10:15 AM, Today" text="Hi, Hope all is good. Are we meeting today?" />
      </ul>
    );
  }
}

class ChatSend extends Component {
  render() {
    return (
      <div className="send-message">
        <span className="input-icon icon-right">
          <textarea rows="4" className="form-control" placeholder="Type your message" />
          <i className="fa fa-camera themeprimary" />
        </span>
      </div>
    );
  }
}

class ChatBarContact extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired
  };
  handleClick = () => {
    $('.page-chatbar .chatbar-contacts').show();
    $('.page-chatbar .chatbar-messages').hide();
  };
  render() {
    const { name, status, time } = this.props;
    return (
      <div className="messages-contact">
        <div className="contact-avatar">
          <img src="/assets/img/avatars/divyia.jpg" alt="avatar" />
        </div>
        <div className="contact-info">
          <div className="contact-name">{name}</div>
          <div className="contact-status">
            <div className="online" />
            <div className="status">{status}</div>
          </div>
          <div className="last-chat-time">{time}</div>
          <div className="back" onClick={this.handleClick} role="none">
            <i className="fa fa-arrow-circle-left" />
          </div>
        </div>
      </div>
    );
  }
}

class ChatBarMessage extends Component {
  render() {
    return (
      <div className="chatbar-messages" style={{ display: 'none' }}>
        <ChatBarContact name="Divyia Philips" status="online" time="a moment ago" />
        <ChatList />
        <ChatSend />
      </div>
    );
  }
}

class ChatBar extends Component {
  render() {
    return (
      <div id="chatbar" className="page-chatbar">
        <ChatContact />
        <ChatBarMessage />
      </div>
    );
  }
}

export default ChatBar;
