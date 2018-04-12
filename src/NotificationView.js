import React, { Component } from 'react';

class NotificationView extends Component {
    render() {
        return <span id="notification">
            {this.props.message}
            <button onClick={this.props.close} type="button">
                &times;
            </button>
        </span>;
    }
}

export default NotificationView;
