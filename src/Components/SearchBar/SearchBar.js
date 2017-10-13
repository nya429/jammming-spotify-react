import React, { Component } from 'react';
import './SearchBar.css'

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state={
      term:""
    };
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }

  handleTermChange(event) {
    this.setState({term:event.target.value});
  }

  search(event) {
    this.props.onSearch(this.state.term);
  }

  componentWillReceiveProps(nextProps) {
    console.log('DEBUGH')
    //this.setState({term:nextProps.term});
  }

  render() {
    return (
              <div className="SearchBar">
                <input onChange={this.handleTermChange } value={this.props.term} placeholder="Enter A Song, Album, or Artist" />
                <a onClick={this.search}>SEARCH</a>
              </div>
            );
          }

}

export default SearchBar;
