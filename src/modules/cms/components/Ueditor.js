import React, { Component, PropTypes } from 'react';
import * as urls from '../../../utils/urls';

/* global UE */
class Ueditor extends Component {
    static propTypes = {
      id: PropTypes.string.isRequired,
      onChange: PropTypes.func,
      defaultValue: PropTypes.string
    }

    static defaultProps = {
      defaultValue: null,
      onChange: () => {}
    }

    constructor(props) {
      super(props);
      this.state = {};
    }

    componentDidMount() {
      this.initEditor();
    }
    componentWillUnmount() {
      // 组件卸载后，清除放入库的id
      /*
      try {
        UE.delEditor(this.props.id);
      } catch (e) {
        console.error(e);
      } */
    }

    initEditor() {
      const { id, defaultValue, onChange } = this.props;
      this.editor = UE.getEditor(id, { serverUrl: `${urls.napi}/n/file/upload` });
      this.editor.ready(ueditor => {
        if (!ueditor) {
          UE.delEditor(id);
          this.initEditor();
        }
        if (defaultValue) {
          this.editor.setContent(defaultValue);
        }
        this.editor.addListener('contentChange', () => {
          onChange(this.editor.getContent());
        });
      });
    }
    render() {
      const { id } = this.props;
      return (
        <script id={id} name="file" type="text/plain" />
      );
    }
}
export default Ueditor;
