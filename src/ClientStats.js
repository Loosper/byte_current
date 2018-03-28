import React, { Component } from 'react';


class ClientStats extends Component {
    constructor(props) {
        super(props);

        this.update_stats = this.update_stats.bind(this);

        this.state = {
            download_speed: 0,
            upload_speed: 0
        };

        // console.log(props.client);
    }

    update_stats() {
        this.setState({
            download_speed: this.props.client.downloadSpeed,
            upload_speed: this.props.client.uploadSpeed
        });
    }

    componentDidMount() {
        this.stats_service = setInterval(this.update_stats, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.stats_service);
    }

    render() {
        // you can add help, contrubute here?
        return (
            <div>
                <span>Down: {Math.round(this.state.download_speed / 1024)} Kb/s </span>
                <span>Up: {Math.round(this.state.upload_speed / 1024)} Kb/s</span>
            </div>
        );
    }
}

export default ClientStats;
