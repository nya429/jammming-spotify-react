import React from 'react';
import './Header.css';


class Header extends React.Component {
  //Thanks Tobiasahlin!
  renderLoading() {
    return (
      <div  className="spinner">
      <div className="rect1"></div>
        <div className="rect2"></div>
        <div className="rect3"></div>
        <div className="rect4"></div>
        <div className="rect5"></div>
        <div className="rect6"></div>
        <div className="rect7"></div>
        <div className="rect8"></div>
        <div className="rect9"></div>
              </div>);
  }

  render() {
      let mmmCalssname = this.props.load ? 'highlight MMuploding' : 'highlight';
    return (
          <div className='header'>
            <div className='title'>
            <h1>Ja<span className={mmmCalssname} >mmm</span>ing</h1>
            </div>
            <div className="loading">
            {this.props.load && this.renderLoading()}
            </div>
          </div> );
        }

}

export default Header;
