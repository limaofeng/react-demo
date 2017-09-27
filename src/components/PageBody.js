import React, { Component, PropTypes } from 'react';
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
      uls[uls.length - 1].push(m.divider ?
        <li key={i} className="divider" /> :
        <li key={i} className={classnames({ active: this.isActive(m.url) })}>
          <Link to={m.url}>
            <i className={`fa ${m.icon}`} />
            {m.name}
          </Link>
        </li>);
    });

    return (
      <div className="mail-sidebar" style={{ minHeight: `${minHeight}px` }}>
        {uls.map((lis, i) => <ul key={i} className="mail-menu">{lis}</ul>)}
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
  return (<div className="mail-container">
    <div className="mail-body" style={{ padding: '9px 10px 12px', minHeight: `${height}px` }}>
      {children}
    </div>
    <Sidebar minHeight={height} location={location} menus={menus} />
  </div>);
}

Container.propTypes = {
  menus: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  location: PropTypes.object.isRequired,
  children: PropTypes.any.isRequired
};

function getWindowHeight() {
  return $(window).height() - 125;
}

export default class PageBody extends Component {
    static propTypes = {
      fullscreen: PropTypes.bool,
      menus: PropTypes.array,
      location: PropTypes.object,
      children: PropTypes.any.isRequired
    };

    static defaultProps = {
      fullscreen: false,
      menus: [],
      location: null
    }

    constructor(props) {
      super(props);
      this.state = { height: getWindowHeight() };
      this.restHeight = () => {
        this.setState({ height: getWindowHeight() });
      };
    }

    componentDidMount() {
      $(window).bind('resize', this.restHeight);
    }

    componentWillUnmount() {
      $(window).unbind('resize', this.restHeight);
    }

    render() {
      const { location, fullscreen, children, menus } = this.props;
      const { height } = this.state;
      if (fullscreen) {
        return (<div className="page-body no-padding" style={{ display: children.length ? 'flex' : 'block' }}>
          <Container location={location} height={height} menus={menus}> {children} </Container>
        </div>);
      }
      return (<div className="page-body" style={{ display: children.length ? 'flex' : 'block' }}>{children}</div>);
    }
}
