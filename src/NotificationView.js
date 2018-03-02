import React, { Component } from 'react';


class NotificationView extends Component {
    render() {
        return (
            <div>
                <div>{this.props.message}</div>
                <button onClick={this.props.close}>close</button>
            </div>
        );
    }
}

export default NotificationView;
