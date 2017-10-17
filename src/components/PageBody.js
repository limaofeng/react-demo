import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

class Sidebar extends Component {
  isActive(path) {
    const { location } = this.props;
    return location.pathname === path;
  }

  render() {
    const { minHeight, menus } = this.props;
    const uls = [];
    menus.forEach((m, i) => {
      if (!uls.length || m.divider) {
        uls.push([]);
      }
      uls[uls.length - 1].push(
        m.divider ? (
          <li key={i} className="divider" />
        ) : (
          <li key={i} className={classnames({ active: this.isActive(m.url) })}>
            <Link to={m.url}>
              <i className={`fa ${m.icon}`} />
              {m.name}
            </Link>
          </li>
        )
      );
    });

    return (
      <div className="mail-sidebar" style={{ minHeight: `${minHeight}px` }}>
        {uls.map((lis, i) => (
          <ul key={i} className="mail-menu">
            {lis}
          </ul>
        ))}
      </div>
    );
  }
}

Sidebar.propTypes = {
  menus: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
  minHeight: PropTypes.number.isRequired
};

function Container({ height, location, children, menus }) {
  return (
    <div className="mail-container">
      <div className="mail-body" style={{ padding: '9px 10px 12px', minHeight: `${height}px` }}>
        {children}
      </div>
      <Sidebar minHeight={height} location={location} menus={menus} />
    </div>
  );
}

Container.propTypes = {
  menus: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  location: PropTypes.object.isRequired,
  children: PropTypes.any.isRequired
};

export default class PageBody extends Component {
  static propTypes = {
    fullscreen: PropTypes.bool,
    children: PropTypes.any.isRequired
  };

  static defaultProps = {
    fullscreen: false,
    menus: [],
    location: null
  };

  render() {
    const { fullscreen, children } = this.props;
    if (fullscreen) {
      return (
        <div className="page-body no-padding" style={{ display: children.length ? 'flex' : 'block' }}>
          {children}
        </div>
      );
    }
    return (
      <div className="page-body" style={{ display: children.length ? 'flex' : 'block' }}>
        {children}
      </div>
    );
  }
}
