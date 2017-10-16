import React from 'react';
import './ToastInformation.css';


class ToastInformation extends React.Component {

  toggleToast() {
          if (this.props.isToast === null) {
            return 'ToastContainer';
          } else {
          return this.props.isToast ? 'ToastContainer visible' : 'ToastContainer invisible';
          }
    }

  render() {
    return (
          <div className={this.toggleToast()} >
              <h2>{this.props.toastInformation}</h2>
          </div> );
        }

}

export default ToastInformation;
