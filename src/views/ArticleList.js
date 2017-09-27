import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';

import ARTICLES_QUERY from './../graphqls/ArticlesQuery.gql';

@graphql(ARTICLES_QUERY)
export default class ArticleList extends Component {
    static propTypes = {
      data: PropTypes.object.isRequired
    }
    constructor(props) {
      super(props);
      console.log('new ArticleList');
    }
    render() {
      const { data: { articles, loading } } = this.props;
      if (loading) {
        return <div>loading...</div>;
      }
      return (<div>
        <ul>
          {articles.map(item => <li key={item.id}>标题:{item.title}</li>)}
        </ul>
      </div>);
    }
}

