/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Upload, Modal, Icon } from 'antd';
import { picturePath, api } from '../helpers/urls';

class Uploader extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    multiple: PropTypes.bool,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    mode: PropTypes.string
  };

  static defaultProps = {
    onChange: () => {},
    multiple: false,
    defaultValue: null,
    value: null,
    mode: 'image'
  };

  constructor(props) {
    super(props);
    const { defaultValue, value } = props;
    this.setValue(defaultValue || value || []);
  }

  componentWillReceiveProps({ value = [] }) {
    if (value && (value.__typename === 'File' || value.__typename === 'Image')) {
      this.setValue(value.path);
    } else if (value && value.length) {
      this.setState(this.setValue(value || []));
    }
  }

  setValue(value) {
    const isarray = value instanceof Array;
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: isarray
        ? value.map(item => ({
            // uid为0删除时会全删
            uid: item,
            status: 'done',
            url: `${picturePath}${item}`,
            path: item,
            response: {
              path: item
            }
          }))
        : [{ uid: -1, status: 'done', url: `${picturePath}${value}`, path: value, response: { path: value } }]
    };
    return this.state;
  }

  // 上传logo后预览
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  handleCancelfile = e => {
    e.stopPropagation();
    const { onChange } = this.props;
    this.setState({ fileList: [] });
    onChange(null);
  };

  handleChange = ({ file, fileList }) => {
    const { multiple, onChange } = this.props;

    if (multiple) {
      this.setState({ fileList });
    } else {
      this.setState({ fileList: [file] });
    }

    if (file.status === 'done' || file.status === 'removed') {
      file.url = `${picturePath}${file.response.path}`;
      file.path = file.response.path;
      onChange(multiple ? fileList.map(item => item.path || item.response.path) : file.path);
    }

    // 单张照片删除
    if (file.status === 'removed') {
      if (!multiple) {
        onChange('');
        this.setState({ fileList: [] });
      }
    }
  };

  render() {
    const { multiple, mode } = this.props;
    const { previewImage, fileList, previewVisible } = this.state;
    const children = [];
    const showUploadList = mode === 'image' || mode === 'images';
    if (showUploadList) {
      if (multiple || !fileList.length) {
        children.push(
          <div key="multiple" className="upload-action">
            <Icon type="plus" />
            <div className="ant-upload-text">点击上传</div>
          </div>
        );
      }
    } else if (mode === 'avatar') {
      const imageUrl = fileList.length ? fileList[0].url : null;
      children.push(
        imageUrl ? (
          <div key="single">
            <img src={imageUrl} alt="" className="avatar" />
            <a onClick={this.handleCancelfile} className="image-cancel" role="none">
              <i title="Remove file" className="anticon anticon-delete" />
            </a>
          </div>
        ) : (
          <div key="single" className="upload-action">
            <div className="ant-upload-text">点击上传</div>
          </div>
        )
      );
    }
    return (
      <div className="uploader">
        <Upload
          multiple={multiple}
          action={`${api}/files?dir=team`}
          name="attach"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          showUploadList={showUploadList}
        >
          {children.length ? children : null}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default Uploader;
