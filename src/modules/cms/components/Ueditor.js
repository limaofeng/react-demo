/* global UE */
import React, { PureComponent, PropTypes } from 'react';
import * as urls from '../../../helpers/urls';

class Ueditor extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    defaultValue: PropTypes.string
  };

  static defaultProps = {
    defaultValue: null,
    onChange: () => {}
  };

  componentDidMount() {
    this.initEditor();
  }

  componentWillUnmount() {
    UE.delEditor(this.props.id);
  }

  initEditor() {
    const { id, defaultValue, onChange } = this.props;
    this.editor = UE.getEditor(id, { serverUrl: `${urls.napi}/n/file/upload` });
    this.editor.ready(ueditor => {
      if (!ueditor) {
        UE.delEditor(id);
        this.initEditor();
        console.warn(`id = ${id} \t ready = ${ueditor} \t defaultValue = ${defaultValue} reinitEditor`);
        return;
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
    return <script id={id} name="file" type="text/plain" />;
  }
}
export default Ueditor;
