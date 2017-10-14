import React, { Component } from 'react';
import './SearchBar.css'

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state={
      term:"",
      SearchBarClassName:''
    };
    this.className='';
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  handleKeyDown(event) {
    let keyName = event.key;
    if(keyName === 'Enter') {
      this.props.onSearch(this.state.term);
      this.setState({SearchBarClassName:'SearchBarHover'});
    }
  }

  handleKeyUp(event) {


    let keyName = event.key;
    if(keyName === 'Enter') {
      this.setState({SearchBarClassName:''});
    }
  }

  handleTermChange(event) {
    this.setState({term:event.target.value});
  }

  search(event) {
    this.props.onSearch(this.state.term);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.term !== '')
    this.setState({term:nextProps.term});
  }

  render() {
    return (
              <div className="SearchBar">
                <input onKeyUp={this.handleKeyUp} onKeyDown={this.handleKeyDown} onChange={this.handleTermChange}  value={this.state.term} placeholder="Enter A Song, Album, or Artist" />
                <a className={this.state.SearchBarClassName} onClick={this.search}>SEARCH</a>
              </div>
            );
          }

}

export default SearchBar;
