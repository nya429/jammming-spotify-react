import React from 'react';
import './ToastInformation.css';


class ToastInformation extends React.Component {

  toggleToast() {
          return this.props.isToast ? 'ToastContainer visible' : 'ToastContainer';
  }

  render() {
    return (
          <div className={this.toggleToast()} >
              <h2>{this.props.toastInformation}</h2>
          </div> );
        }

}

export default ToastInformation;
