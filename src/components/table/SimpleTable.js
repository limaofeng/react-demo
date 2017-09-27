import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// 分页
import Pagnation from '../../components/Pagnation';


class Hover extends Component {
  render() {
    return (<div className="row">
      <div className="col-xs-12 col-md-12">
        <div className="well with-header  with-footer">
          <div className="header bg-blue">
                        Simple Table With Hover
          </div>
          <table className="table table-hover">
            <thead className="bordered-darkorange">
              <tr>
                <th>
                                    #
                </th>
                <th>
                                    Name
                </th>
                <th>
                                    Family
                </th>
                <th>
                                    Username
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                                    1
                </td>
                <td>
                                    Steve
                </td>
                <td>
                                    Jobs
                </td>
                <td>
                                    steve
                </td>
              </tr>
              <tr>
                <td>
                                    2
                </td>
                <td>
                                    Bill
                </td>
                <td>
                                    Gates
                </td>
                <td>
                                    billy
                </td>
              </tr>
              <tr>
                <td>
                                    3
                </td>
                <td>
                                    Mark
                </td>
                <td>
                                    Zuckerberg
                </td>
                <td>
                                    markz
                </td>
              </tr>
              <tr>
                <td>
                                    4
                </td>
                <td>
                                    Marissa
                </td>
                <td>
                                    Mayer
                </td>
                <td>
                                    marim
                </td>
              </tr>
            </tbody>
          </table>

          <div className="footer">
            <code>class="table table-hover"</code>
          </div>
        </div>

      </div>
    </div>);
  }
}
class Condensed extends Component {
  render() {
    return (<div className="row">
      <div className="col-xs-12 col-md-12">
        <div className="well with-header  with-footer">
          <div className="header bg-darkorange">
                        Condensed Table
          </div>
          <table className="table table-hover table-striped table-bordered table-condensed">
            <thead>
              <tr>
                <th>
                                    #
                </th>
                <th>
                                    Name
                </th>
                <th>
                                    Family
                </th>
                <th>
                                    Username
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                                    1
                </td>
                <td>
                                    Steve
                </td>
                <td>
                                    Jobs
                </td>
                <td>
                                    steve
                </td>
              </tr>
              <tr>
                <td>
                                    2
                </td>
                <td>
                                    Bill
                </td>
                <td>
                                    Gates
                </td>
                <td>
                                    billy
                </td>
              </tr>
              <tr>
                <td>
                                    3
                </td>
                <td>
                                    Mark
                </td>
                <td>
                                    Zuckerberg
                </td>
                <td>
                                    markz
                </td>
              </tr>
              <tr>
                <td>
                                    4
                </td>
                <td>
                                    Marissa
                </td>
                <td>
                                    Mayer
                </td>
                <td>
                                    marim
                </td>
              </tr>
            </tbody>
          </table>

          <div className="footer">
            <code>class="table table-condensed"</code>
          </div>
        </div>
      </div>
    </div>);
  }
}
class Bordered extends Component {
  render() {
    return (<div className="row">
      <div className="col-xs-12 col-md-12">
        <div className="well with-header with-footer">
          <div className="header bg-warning">
                        Bordered Table
          </div>
          <table className="table table-hover table-bordered">
            <thead>
              <tr>
                <th>
                                    #
                </th>
                <th>
                                    Name
                </th>
                <th>
                                    Family
                </th>
                <th>
                                    Username
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                                    1
                </td>
                <td>
                                    Steve
                </td>
                <td>
                                    Jobs
                </td>
                <td>
                                    steve
                </td>
              </tr>
              <tr>
                <td>
                                    2
                </td>
                <td>
                                    Bill
                </td>
                <td>
                                    Gates
                </td>
                <td>
                                    billy
                </td>
              </tr>
              <tr>
                <td>
                                    3
                </td>
                <td>
                                    Mark
                </td>
                <td>
                                    Zuckerberg
                </td>
                <td>
                                    markz
                </td>
              </tr>
              <tr>
                <td>
                                    4
                </td>
                <td>
                                    Marissa
                </td>
                <td>
                                    Mayer
                </td>
                <td>
                                    marim
                </td>
              </tr>
            </tbody>
          </table>
          <div className="footer">
            <code>class="table table-bordered"</code>
          </div>
        </div>

      </div>
    </div>);
  }
}

class Stripped extends Component {
  render() {
    return (
      <div>
        <div className="col-xs-12 col-md-12">
          <div className="well with-header with-footer">
            <div className="header bg-palegreen">
                            Stripped Table
            </div>
            <table className="table table-hover table-striped table-bordered">
              <thead className="bordered-blueberry">
                <tr>
                  <th>
                                        #
                  </th>
                  <th>
                                        Name
                  </th>
                  <th>
                                        Family
                  </th>
                  <th>
                                        Username
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                                        1
                  </td>
                  <td>
                                        Steve
                  </td>
                  <td>
                                        Jobs
                  </td>
                  <td>
                                        steve
                  </td>
                </tr>
                <tr>
                  <td>
                                        2
                  </td>
                  <td>
                                        Bill
                  </td>
                  <td>
                                        Gates
                  </td>
                  <td>
                                        billy
                  </td>
                </tr>
                <tr>
                  <td>
                                        3
                  </td>
                  <td>
                                        Mark
                  </td>
                  <td>
                                        Zuckerberg
                  </td>
                  <td>
                                        markz
                  </td>
                </tr>
                <tr>
                  <td>
                                        4
                  </td>
                  <td>
                                        Marissa
                  </td>
                  <td>
                                        Mayer
                  </td>
                  <td>
                                        marim
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="footer">
              <code>class="table table-striped"</code>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
// Hover      table table-hover
// Condensed  table table-hover table-striped table-bordered table-condensed
// Bordered   table table-bordered table-hover
// Stripped   table table-hover table-striped table-bordered
export default class SimpleTable extends Component {
    static propTypes = {
    }
    static defaultProps = {
      cless: 'table table-hover'
    }
    constructor(p) {
      super(p);
      this.state = {};
    }

    componentDidMount() {

    }

    render() {
      // <Hover />
      // <Condensed />
      //     <Bordered />
      //     <Stripped />
      const { header, footer, width, thead, tdata, location } = this.props;

      console.log(location);
      return (<div className="row">
        <div className={`col-xs-12 ${width || 'col-md-12'}`}>
          <div className={`well ${header ? ' with-header' : ''}${footer ? ' with-footer' : ''}`}>
            {
              header &&
              <div className={`header ${header && header.background ? header.background : ''}`}>
                {header.txt}
              </div>
            }
            <table className={this.props.class}>
              <thead className={this.props.class === 'Hover' || this.props.class === 'Stripped' ? 'bordered-darkorange ' : ''}>
                <tr>
                  {
                    thead && thead.map((v, i) => (
                      <th key={`thead_${i}`}>
                        {v.txt}
                      </th>
                    ))
                  }
                </tr>
              </thead>
              <tbody>
                {
                  tdata && tdata.map((item, i) => (<tr key={`tdata_tr_${i}`}>
                    {
                      thead && thead.map((t, i) => (
                        <td key={`tdata_td_${i}`}>
                          {
                            item[t.code]
                          }
                        </td>
                      ))
                    }
                  </tr>))
                }
              </tbody>
            </table>
            {
              footer &&
              <div className="footer">
                {
                  footer.txt ?
                    <code>{footer.txt}</code>
                    :
                    footer.pager ?
                      <div>
                        <div className="col-sm-6">
                                                当前页：{footer.pager.page}&nbsp;&nbsp;共&nbsp;{footer.pager.total}&nbsp;页&nbsp;&nbsp;共&nbsp;{footer.pager.count}&nbsp;条数据
                        </div>
                        <div className="col-sm-6">
                          <div className="dataTables_paginate paging_bootstrap">
                            <Pagnation pager={footer.pager} url={location.pathname} click={this.props.page} />
                          </div>
                        </div>
                      </div>
                      :
                      ''
                }
              </div>
            }
          </div>

        </div>
      </div>);
    }
}

