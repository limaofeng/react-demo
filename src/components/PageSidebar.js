import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import { isEqual } from 'lodash';

import * as Format from '../helpers/Format';

import QUERY_MENUS from './graphqls/menus.gql';

class MenuItem extends Component {
    static propTypes = {
      id: PropTypes.string,
      icon: PropTypes.string,
      href: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      onSelect: PropTypes.func,
      selected: PropTypes.bool
    }

    static defaultProps = {
      id: null,
      icon: null,
      children: [],
      onSelect: () => {},
      isOpen: () => {},
      selected: false,
    }

    shouldComponentUpdate(nextProps) {
      return !isEqual(this.props, nextProps);
    }

    handleClick = e => {
      e.preventDefault();
      const { id, onSelect } = this.props;
      onSelect(id);
    }

    render() {
      const { href, text, icon, selected } = this.props;
      // activeClassName="selected"
      return (
        <li className={classnames({ active: selected })}>
          <a to={href} onClick={this.handleClick} role="none">
            {icon ? <i className={`menu-icon fa fa-${icon}`} /> : []}
            <span className="menu-text">{text}</span>
          </a>
        </li>
      );
    }
}

class ParentMenu extends Component {
    static propTypes = {
      id: PropTypes.string,
      icon: PropTypes.string,
      text: PropTypes.string.isRequired,
      children: PropTypes.any,
      onSelect: PropTypes.func,
      isSelected: PropTypes.func,
      isOpen: PropTypes.func,
      open: PropTypes.bool,
      onOpenChange: PropTypes.func
    }
    static defaultProps = {
      id: null,
      icon: null,
      children: [],
      onSelect: () => {},
      isOpen: () => {},
      isSelected: () => {},
      onOpenChange: () => {},
      open: false
    }

    constructor(props) {
      super(props);
      const { open } = this.props;
      this.state = {
        open
      };
    }

    handleClick = e => {
      e.preventDefault();
      const { id, onOpenChange } = this.props;
      const open = !this.state.open;
      const end = () => {
        this.setState({ open });
        onOpenChange(id, open);
      };
      $(this.menuItemList)[open ? 'slideDown' : 'slideUp']('fast', end);
    }

    render() {
      const { icon, text, children, onSelect, onOpenChange, isSelected, isOpen } = this.props;
      const { selected, open } = this.state;
      return (
        <li className={classnames({ active: selected, open })}>
          <a className="menu-dropdown" onClick={this.handleClick} role="none">
            {icon ? <i className={`menu-icon fa fa-${icon}`} /> : []}
            <span className="menu-text">{text}</span>
            <i className="menu-expand" />
          </a>
          <ul ref={ul => { this.menuItemList = ul; }} className="submenu">
            {children.map(o => React.cloneElement(o, {
              onSelect,
              onOpenChange,
              id: o.key,
              selected: isSelected(o.key),
              open: isOpen(o.key),
              isSelected,
              isOpen
            }))}
          </ul>
        </li>
      );
    }
}

class Menu extends Component {
    static propTypes = {
      children: PropTypes.any.isRequired,
      onSelect: PropTypes.func,
      defaultOpenKeys: PropTypes.array,
      defaultSelectedKey: PropTypes.string,
      onOpenChange: PropTypes.func
    }

    static defaultProps = {
      onSelect: () => {},
      onOpenChange: () => {},
      defaultOpenKeys: [],
      defaultSelectedKey: null
    }

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

    shouldComponentUpdate(nextProps, nextState) {
      return !(isEqual(this.props, nextProps) && isEqual(this.state, nextState));
    }

    handleSelect = key => {
      const { onSelect } = this.props;
      const { selectedKey } = this.state;
      if (selectedKey !== key) {
        this.setState({ selectedKey: key });
        onSelect(key);
      }
    }

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
    }

    isSelected = key => {
      const { selectedKey } = this.state;
      return selectedKey === key;
    }

    isOpen = key => {
      const { openKeys } = this.state;
      return openKeys.includes(key);
    }

    render() {
      const { children } = this.props;
      return (
        <ul className="nav sidebar-menu" role="none">
          {children.map(o => React.cloneElement(o, {
            onSelect: this.handleSelect,
            onOpenChange: this.handleOpenChange,
            id: o.key,
            selected: this.isSelected(o.key),
            open: this.isOpen(o.key),
            isSelected: this.isSelected,
            isOpen: this.isOpen }))}
        </ul>
      );
    }
}


/**
 * 菜单最多支持 4 层
 */
class PageSidebar extends Component {
    static propTypes = {
      data: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      push: PropTypes.func.isRequired
    };

    constructor(props) {
      super(props);
      const { data: { loading, menus } } = props;
      this.state = { menusTree: Format.tree(loading ? [] : menus, { sort: (a, b) => (a.sort > b.sort ? 1 : -1) }) };
    }

    componentWillReceiveProps({ location: nextLocation, ...nextProps }) {
      const { location: prevLocation, ...prevProps } = this.props;
      if (!isEqual(prevProps, nextProps)) {
        const { data: { loading, menus } } = nextProps;
        this.setState({ menusTree: Format.tree(loading ? [] : menus, { sort: (a, b) => (a.sort > b.sort ? 1 : -1) }) });
      }
    }

    shouldComponentUpdate({ location: nextLocation, ...nextProps }) {
      const { location: prevLocation, ...prevProps } = this.props;
      return !isEqual(prevProps, nextProps);
    }

    /*
    componentDidUpdate(props) {
        const { data: { loading }, location: { pathname } } = props;
        if (!loading) {
            const $li = $(`[href="${pathname}"]`, '.sidebar-menu').parent();
            if ($li.length && !$li.hasClass('active')) {
                $('li.active', '.sidebar-menu').removeClass('active').parents('li').removeClass('open active');
                // $('li.open','.sidebar-menu').removeClass('open');
                $li.addClass('active').closest('.submenu').parent().addClass('open active');
            }
        }
    } */

    bodyClickHandler = e => {
      e.preventDefault();// 阻止浏览器默认事件
      // const { selected, close, open, dispatch } = this.props;
      const b = $('#sidebar').hasClass('menu-compact');
      const menuLink = $(e.target).closest('a');
      if (!menuLink || menuLink.length === 0) {
        return false;
      }
      if (!menuLink.hasClass('menu-dropdown')) {
        if (b && menuLink.get(0).parentNode.parentNode === this) {
          const menuText = menuLink.find('.menu-text').get(0);
          if (e.target !== menuText && !$.contains(menuText, e.target)) {
            return false;
          }
        }
        // const href = menuLink.attr('href');
        // console.log(`切换菜单选中:=>${menuLink.parent().data('id')}`);
        const id = $('.sidebar-menu > .active.open').data('id');
        if (id !== menuLink.closest('.sidebar-menu > .open').data('id')) {
          // $('.sidebar-menu > .active.open > .submenu').slideUp(200);
          /*
                .parent()
                    .removeClass('open')
                    .delay(200, 'mx')
                    .queue('mx', function () {
                        close($(this).data('id'));
                    })
                    .dequeue('mx');
                    */
        }
        // selected(menuLink.parent().data('id'));
        // NProgress.inc();
        const navigations = [];
        if (menuLink.closest('ul').hasClass('submenu')) {
          navigations.push({ text: menuLink.closest('ul').prev().find('.menu-text').text(), key: '' });
        }
        navigations.push({ text: menuLink.find('.menu-text').text(), key: menuLink.attr('href') });
        // dispatch(navigation(navigations));
        return false;
      }
      const submenu = menuLink.next().get(0);
      if (!$(submenu).is(':visible')) {
        const c = $(submenu.parentNode).closest('ul');
        if (b && c.hasClass('sidebar-menu')) {
          return false;
        }
        c.find('> .open > .submenu').each(() => {
          if (this !== submenu) {
            $(this).slideUp(200);

            $(this).parent()
              .removeClass('open')
              .delay(200, 'mx')
              .queue('mx', () => {
                // close($(this).data('id'));
              })
              .dequeue('mx');
          }
        });
      }
      if (b && $(submenu.parentNode.parentNode).hasClass('sidebar-menu')) {
        return false;
      }
      $(submenu).slideToggle(200).parent()
        .toggleClass('open')
        .delay(200, 'mx')
        .queue('mx', () => {
          if (!$(this).hasClass('open')) {
            // close($(this).data('id'));
          } else {
            // open($(this).data('id'));
          }
        })
        .dequeue('mx');
      return false;
    }

    handleClick = id => {
      const { data: { menus }, push } = this.props;
      const menu = menus.find(data => data.id === id);
      push(menu.value);
    }

    crateMenu = (tree, layer = 1) => tree.map(item => {
      if (item.children) {
        return (<ParentMenu key={item.id} data={item} text={item.name} >
          {this.crateMenu(item.children, layer + 1)}
        </ParentMenu>);
      }
      return (<MenuItem key={item.id} icon={item.icon} href={item.value} text={item.name} />);
    })

    render() {
      const { menusTree } = this.state;
      const compact = false;
      return (
        <div className={classnames({ 'page-sidebar': true, 'menu-compact': compact })} id="sidebar">
          <div className="sidebar-header-wrapper">
            <input type="text" className="searchinput" />
            <i className="searchicon fa fa-search" />
            <div className="searchhelper">Search Reports, Charts, Emails or Notifications</div>
          </div>
          <Menu onSelect={this.handleClick}>{/* onClick={this.bodyClickHandler} */}
            {this.crateMenu(menusTree)}
          </Menu>
          {/*
                    <li>
                        <ParentMenu icon="th" text={'测试'} />
                        <ul className="submenu" style={{ display: 'none' }}>
                            <li>
                                <MenuItem icon="th" href={'1'} text={'测试1'} />
                            </li>
                            <li>
                                <MenuItem icon="th" href={'2'} text={'测试2'} />
                            </li>
                            <li>
                                <ParentMenu icon="th" text={'测试'} />
                                <ul className="submenu" style={{ display: 'none' }}>
                                    <li>
                                        <MenuItem icon="th" href={'1'} text={'测试1'} />
                                    </li>
                                    <li>
                                        <MenuItem icon="th" href={'2'} text={'测试2'} />
                                    </li>
                                    <li>
                                        <ParentMenu icon="th" text={'测试'} />
                                        <ul className="submenu" style={{ display: 'none' }}>
                                            <li>
                                                <MenuItem icon="th" href={'1'} text={'测试1'} />
                                            </li>
                                            <li>
                                                <MenuItem icon="th" href={'2'} text={'测试2'} />
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                */}
        </div>
      );
    }
}

@withRouter
@graphql(QUERY_MENUS, {
  options: ({ uid }) => ({
    variables: {
      uid
    }
  })
})
export default class PageSidebarWrapper extends Component {
    static propTypes = {
      data: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
    };

    push = url => {
      const { history } = this.props;
      console.log(url);
      history.push(url);
    }

    render() {
      const { data: { loading, menus, variables, error }, location: { pathname } } = this.props;
      return <PageSidebar data={{ loading, menus, variables, error }} push={this.push} location={{ pathname }} />;
    }
}
