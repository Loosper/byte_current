import React, { Component } from 'react';

class NotificationView extends Component {
    render() {
        return <span id="notification">
            <span title={this.props.message}>{this.props.message}</span>
            <button onClick={this.props.close} type="button">
                &times;
            </button>
        </span>;
    }
}

export default NotificationView;
