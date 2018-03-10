import React, { Component } from 'react';


class TorrentView extends Component {
    constructor(props) {
        super(props);
        this.on_torrent = this.on_torrent.bind(this);

        // TODO: custom chunk store; consider not saving for seeding
        this.torrent = props.client.add(
            props.magnet, this.on_torrent
        );

        this.magnet = props.magnet;

        // BUG: this doesn't stop downloading after metadata fetch
        this.torrent.pause();
    }

    on_torrent(torrent) {
        // let info = parse_torrent(torrent.torrentFile);
        // this.setState({name: info.name});
        this.setState({name: torrent.name});
    }

    componentWillUnmount() {
        this.props.client.remove(this.magnet);
    }

    render() {
        return (
            <div>
                <TorrentStats torrent={this.torrent}/>
                <PauseTorrent torrent={this.torrent} />
                <ResumeTorrent torrent={this.torrent} />
                <button onClick={(e) => this.props.remove(this)} >remove</button>
                <button
                    onClick={(e) => this.props.save(this.torrent)}
                >save</button>
            </div>
        );
    }
}


class TorrentStats extends Component {
    constructor(props) {
        super(props);

        this.update_stats = this.update_stats.bind(this);

        // TODO: show done/downlaoding status
        this.state = {
            name: 'sample',
            download_speed: 0,
            upload_speed: 0,
            progress: 0
        };
    }

    update_stats() {
        this.setState({
            download_speed: this.props.torrent.downloadSpeed,
            upload_speed: this.props.torrent.uploadSpeed,
            progress: this.props.torrent.progress
        });
    }

    componentDidMount() {
        this.stats_service = setInterval(this.update_stats, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.stats_service);
    }

    render() {
        return (
            <React.Fragment>
                <span> {this.state.name} </span>
                <span> {this.state.progress.toFixed(2)} </span>
                <span> {Math.round(this.state.download_speed / 1024)} Kb/s</span>
                <span> {Math.round(this.state.upload_speed / 1024)} Kb/s</span>
            </React.Fragment>
        );
    }
}

// Unneeded code. You can put into functions of ~3 lines
class PauseTorrent extends Component {
    constructor(props) {
        super(props);
        this.pause_torrent = this.pause_torrent.bind(this);
    }

    render() {
        return (<button onClick={this.pause_torrent} >pause</button>);
    }

    // NOTE: this pauses NEW connections
    // looks like an actual pause of download is not supported
    pause_torrent(event) {
        this.props.torrent.pause();
    }
}


class ResumeTorrent extends Component {
    constructor(props) {
        super(props);
        this.resume_torrent = this.resume_torrent.bind(this);
    }

    render() {
        return (<button onClick={this.resume_torrent} >resume</button>);
    }

    resume_torrent(event) {
        this.props.torrent.resume();
    }
}

export default TorrentView;
