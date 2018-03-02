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

        this.state = {
            save_opts: []
        };
    }

    on_torrent(torrent) {
        // let info = parse_torrent(torrent.torrentFile);
        // this.setState({name: info.name});
        this.setState({name: torrent.name});
    }

    componentWillUnmount() {
        console.log('removing');
        this.props.client.remove(this.magnet);
    }

    render() {
        console.log('rendering a torrent');
        return (
            <div>
                <TorrentStats torrent={this.torrent}/>
                <PauseTorrent torrent={this.torrent} />
                <ResumeTorrent torrent={this.torrent} />
                <button onClick={(e) => {this.props.remove(this);}} >remove</button>
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

        this.state = {
            name: 'sample',
            download_speed: 0,
            upload_speed: 0,
            progress: 0,
            save_opts: []
        };
    }

    update_stats() {
        this.setState({download_speed: this.props.torrent.downloadSpeed});
        this.setState({upload_speed: this.props.torrent.uploadSpeed});
        this.setState({progress: this.props.torrent.progress});
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
        console.log('paused');
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
        console.log('resumed');
        this.props.torrent.resume();
    }
}

export default TorrentView;
