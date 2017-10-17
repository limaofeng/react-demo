import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { isEqual } from 'lodash';

export class Tree extends PureComponent {
  static propTypes = {
    children: PropTypes.any.isRequired,
    onSelect: PropTypes.func,
    defaultOpenKeys: PropTypes.array,
    defaultSelectedKey: PropTypes.string,
    onOpenChange: PropTypes.func
  };

  static defaultProps = {
    onSelect: () => {},
    onOpenChange: () => {},
    defaultOpenKeys: [],
    defaultSelectedKey: null
  };

  constructor(props) {
    super(props);
    const { defaultOpenKeys: openKeys = [], defaultSelectedKey: selectedKey } = this.props;
    this.state = {
      selectedKey,
      openKeys
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props, nextProps)) {
      const { defaultOpenKeys: openKeys = [], defaultSelectedKey: selectedKey } = nextProps;
      this.setState({ selectedKey, openKeys });
    }
  }

  handleSelect = key => {
    const { onSelect } = this.props;
    this.setState({ selectedKey: key });
    onSelect(key);
  };

  handleOpenChange = (key, open) => {
    const { onOpenChange } = this.props;
    const { openKeys } = this.state;
    if (open) {
      openKeys.push(key);
    } else {
      openKeys.splice(openKeys.indexOf(key), 1);
    }
    this.setState({ openKeys });
    onOpenChange(openKeys);
  };

  isSelected = key => {
    const { selectedKey } = this.state;
    return selectedKey === key;
  };

  isOpen = key => {
    const { openKeys } = this.state;
    return openKeys.includes(key);
  };

  render() {
    const { children } = this.props;
    return (
      <ul className="fan-menu">
        {children.map(o =>
          React.cloneElement(o, {
            onSelect: this.handleSelect,
            onOpenChange: this.handleOpenChange,
            id: o.key,
            selected: this.isSelected(o.key),
            open: this.isOpen(o.key),
            isSelected: this.isSelected,
            isOpen: this.isOpen
          })
        )}
      </ul>
    );
  }
}

export class TreeItemGroup extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    layer: PropTypes.number.isRequired,
    children: PropTypes.any,
    onSelect: PropTypes.func,
    isSelected: PropTypes.func,
    isOpen: PropTypes.func,
    open: PropTypes.bool,
    onOpenChange: PropTypes.func
  };

  static defaultProps = {
    id: null,
    children: [],
    onSelect: () => {},
    isOpen: () => {},
    isSelected: () => {},
    onOpenChange: () => {},
    open: false
  };

  constructor(props) {
    super(props);
    const { open } = this.props;
    this.state = {
      open
    };
  }

  handleClick = e => {
    e.preventDefault();
    const { id, onSelect } = this.props;
    onSelect(id);
  };

  handleOpenClick = e => {
    e.preventDefault();
    e.stopPropagation();
    const { id, onOpenChange } = this.props;
    const open = !this.state.open;
    const end = () => {
      this.setState({ open });
      onOpenChange(id, open);
    };
    $(this.openIcon)[open ? 'removeClass' : 'addClass']('rotates');
    $(this.menuItemList)[open ? 'slideDown' : 'slideUp']('fast', end);
  };

  render() {
    const { id, title, children, layer, onSelect, onOpenChange, isSelected, isOpen } = this.props;
    const { open } = this.state;
    return (
      <li className="fan-menu-item">
        <div
          className={classnames('menu-item-title', { 'menu-item-selected': isSelected(id) })}
          onClick={this.handleClick}
          style={{ paddingLeft: 15 * layer }}
          role="none"
        >
          <div className="item-title">
            <a>{title}</a>
          </div>
          <i
            ref={icon => {
              this.openIcon = icon;
            }}
            className={classnames({ rotates: !open })}
            onClick={this.handleOpenClick}
            role="none"
          />
        </div>
        <ul
          ref={ul => {
            this.menuItemList = ul;
          }}
          className={classnames('fan-menu-item-group-list', { 'fan-menu-hidden': !open })}
        >
          {children.map(o =>
            React.cloneElement(o, {
              onSelect,
              onOpenChange,
              id: o.key,
              selected: isSelected(o.key),
              open: isOpen(o.key),
              isSelected,
              isOpen
            })
          )}
        </ul>
      </li>
    );
  }
}

export class TreeItem extends Component {
  static propTypes = {
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    layer: PropTypes.number.isRequired,
    onSelect: PropTypes.func,
    selected: PropTypes.bool
  };

  static defaultProps = {
    id: null,
    onSelect: () => {},
    selected: false
  };

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  handleClick = e => {
    e.preventDefault();
    const { id, onSelect } = this.props;
    onSelect(id);
  };

  render() {
    const { title, layer, selected } = this.props;
    return (
      <li className="fan-menu-item">
        <div
          className={classnames('menu-item-title', { 'menu-item-selected': selected })}
          onClick={this.handleClick}
          style={{ paddingLeft: 15 * layer }}
          role="none"
        >
          <div className="item-title">
            <a>{title}</a>
          </div>
        </div>
      </li>
    );
  }
}

export default { Tree, TreeItem, TreeItemGroup };
