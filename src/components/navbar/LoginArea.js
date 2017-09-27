import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';
import { Upload, message } from 'antd';
import { connect } from 'react-redux';

import { logout } from '../../reducers/auth';

/* eslint jsx-a11y/anchor-has-content: 0 */
/* global createCookie bootbox */

/*
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
} */

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}

class Avatar extends Component {
    state = {};

    handleChange = info => {
      if (info.file.status === 'done') {
        console.log('upload done');
      }
    }

    render() {
      // const imageUrl = this.state.imageUrl;
      return (
        <div className="avatar-area">
          <Upload
              className="avatar-uploader"
            name="avatar"
              style={{ width: 128, height: 128 }}
              showUploadList={false}
              action="//jsonplaceholder.typicode.com/posts/"
              beforeUpload={beforeUpload}
              onChange={this.handleChange}
          >
            <div>
              <img alt="" src="assets/img/avatars/adam-jansen.jpg" className="avatar" />
              <span className="caption">修改照片</span>
            </div>
          </Upload>
        </div>
      );
    }
}

@connect(({ auth: user }) => ({ user }))
class LoginArea extends Component {
    static propTypes = {
      user: PropTypes.object.isRequired,
      dispatch: PropTypes.func.isRequired,
    };
    componentDidMount() {
      this.initiateSettings();
    }
    changePwd = e => {
      e.preventDefault();
      const { user: { id, username } } = this.props;
      const dialog = bootbox.dialog({
        message: $('#editPasswordDiv').html(),
        title: `修改密码【${username}】`,
        className: 'modal-darkorange',
        buttons: {
          保存: {
            className: 'btn-blue',
            callback() {
              const oldpwd = $('form input[name="oldpwd"]', dialog).val();
              const newpwd = $('form input[name="newpwd"]', dialog).val();
              const repwd = $('form input[name="repwd"]', dialog).val();
              if (!newpwd || newpwd.length < 6 || newpwd.length > 20) {
                $.alert.error('请输入6~20位新密码');
                return false;
              }
              if (repwd !== newpwd) {
                $.alert.error('新密码两次输入不一致');
                return false;
              }
              console.log(id, oldpwd)
              /*
                        dispatch(resetpwd(_id, { new_password: newpwd, old_password: oldpwd })).then(result => {
                            console.log(result);
                            $.alert.success('修改成功');
                            bootbox.hideAll();
                        }).catch(err => {
                            console.log(err);
                            $.alert.error('修改失败');
                        }); */
              return false;
            }
          },
          取消: {
            className: 'btn-danger',
            callback() {
            }
          }
        }
      });
      this.hidden();
    }
    logout = e => {
      e.preventDefault();
      const { dispatch } = this.props;
      dispatch(logout()).then(() => {
        dispatch(push('/login'));
      });
      this.hidden();
    }
    skin = skinRel => {
      const a = document.createElement('link');
      a.href = skinRel;
      a.rel = 'stylesheet';
      document.getElementsByTagName('head')[0].appendChild(a);
      this.hidden();
    }
    hidden = () => {

    }
    initiateSettings = e => {// eslint-disable-line
      // Handle RTL SUpport for Changer CheckBox
      $('#skin-changer li a').click(e => {
        e.preventDefault();
        createCookie('current-skin', $(e.target).attr('rel'), 10);
        this.skin($(e.target).attr('rel'));
      });
      let skip = false;
      $('.dropdown-login-area > li').click(e => {
        skip = true;
        if ($(e.target).is(':hidden')) {
          return;
        }
        e.preventDefault();
      });
      $('.login-area').parent().on('hide.bs.dropdown', e => {
        if (skip) {
          e.preventDefault();
          skip = false;
        }
      });
    }

    render() {
      const { user } = this.props;
      return (
        <li>
          <a className="login-area" data-toggle="dropdown" role="none">
            <div title="View your public profile">
              <div className="avatar" title="View your public profile">
                <img src="assets/img/avatars/adam-jansen.jpg" alt="" />
              </div>
              <section>
                <h2><span className="profile"><span>{user.nickName || 'David Stevenson'}</span></span></h2>
              </section>
            </div>
          </a>
          <ul className="pull-right dropdown-menu dropdown-arrow dropdown-login-area">
            <li className="username"><a>{user.nickName}</a></li>
            <li className="email"><a>{(user.details && user.details.email) || 'David.Stevenson@live.com'}</a></li>
            <li>
              <Avatar />
            </li>
            <li className="edit">
              <a href="profile.html" className="pull-left">Profile</a>
              <a className="pull-right">设置</a>
            </li>
            <li className="theme-area">
              <ul className="colorpicker" id="skin-changer">
                <li>
                  <a
                    className="colorpick-btn"
                      style={{ backgroundColor: '#108ee9' }}
                      rel="assets/css/skins/blue.min.css"
                      role="none"
                  />
                </li>
                <li>
                  <a
                      className="colorpick-btn"
                      style={{ backgroundColor: '#2dc3e8' }}
                      rel="assets/css/skins/azure.min.css"
                  />
                </li>
                <li>
                  <a
                      className="colorpick-btn"
                      style={{ backgroundColor: '#03B3B2' }}
                      rel="assets/css/skins/teal.min.css"
                  />
                </li>
                <li>
                  <a
                      className="colorpick-btn"
                      style={{ backgroundColor: '#53a93f' }}
                      rel="assets/css/skins/green.min.css"
                  />
                </li>
                <li>
                  <a
                      className="colorpick-btn"
                    style={{ backgroundColor: '#FF8F32' }}
                    rel="assets/css/skins/orange.min.css"
                  />
                </li>
                <li>
                  <a
                      className="colorpick-btn"
                      style={{ backgroundColor: '#cc324b' }}
                    rel="assets/css/skins/pink.min.css"
                  />
                </li>
                <li>
                  <a
                      className="colorpick-btn"
                      style={{ backgroundColor: '#AC193D' }}
                      rel="assets/css/skins/darkred.min.css"
                  />
                </li>
                <li>
                  <a
                      className="colorpick-btn"
                    style={{ backgroundColor: '#8C0095' }}
                      rel="assets/css/skins/purple.min.css"
                  />
                </li>
                <li>
                  <a
                      className="colorpick-btn"
                    style={{ backgroundColor: '#0072C6' }}
                      rel="assets/css/skins/darkblue.min.css"
                  />
                </li>
                <li>
                  <a
                    className="colorpick-btn"
                    style={{ backgroundColor: '#585858' }}
                      rel="assets/css/skins/gray.min.css"
                  />
                </li>
                <li>
                  <a
                      className="colorpick-btn"
                      style={{ backgroundColor: '#474544' }}
                      rel="assets/css/skins/black.min.css"
                  />
                </li>
                <li>
                  <a
                    className="colorpick-btn"
                    style={{ backgroundColor: '#001940' }}
                    rel="assets/css/skins/deepblue.min.css"
                  />
                </li>
              </ul>
            </li>
            <li className="dropdown-footer edit">
              <a className="pull-left" onClick={this.changePwd} role="none">修 改 密 码</a>
              <a className="pull-right logout" onClick={this.logout} role="none">登 出</a>
            </li>
          </ul>

        </li>
      );
    }
}

export default LoginArea;
