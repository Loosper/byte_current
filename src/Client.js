import React, { Component } from 'react';
import './Client.css';

// this is perhaps wrong
var WebTorrent = require('webtorrent');
var streamSaver = require('streamsaver');
// var parse_torrent = require('parse-torrent');

// TODO: test browser support.
// This app uses a lot of modern fetures and will break on old browsers


class Client extends Component {
    constructor(props) {
        super(props);
        this.add_torrent = this.add_torrent.bind(this);
        this.remove_torrent = this.remove_torrent.bind(this);

        this.state = {torrents: []};
        this.client = new WebTorrent();

        this.client.on('error', function (err) {
            console.error('ERROR: ' + err.message);
        });

        // temporary
        this.id = 1;
    }

    // TODO: global upload/downlaod
    add_torrent(magnet_link) {
        // TODO: validate the magnet/handle unvalid torrents
        let arr = this.state.torrents.slice();
        arr.push(<TorrentView
            key={this.id++}
            magnet={magnet_link}
            client={this.client}
            remove={this.remove_torrent}
        />);
        this.setState({torrents: arr});
    }

    remove_torrent(torrent_view) {
        let index = this.state.torrents.indexOf(torrent_view);
        let new_torrents = this.state.torrents.slice();
        new_torrents.splice(index, 1);
        this.setState({torrents: new_torrents});
    }

    render() {
        return (
            <div className="Client">
                <header className="Client-header">
                    <h1 className="Client-title">Torrent app</h1>
                </header>
                <AddButton new_torrent={this.add_torrent} />
                {this.state.torrents}
            </div>
        );
    }
}


class TorrentView extends Component {
    constructor(props) {
        super(props);
        this.on_torrent = this.on_torrent.bind(this);
        this.save = this.save.bind(this);

        // TODO: custom chunk store; consider not saving for seeding
        this.torrent = props.client.add(
            props.magnet, this.on_torrent
        );
        this.state = {
            save_opts: []
        };
    }

    // TODO: use StreamSaver to save the torrent as it's downloading.
    save(event) {
        console.log(this.torrent.files);
    }

    on_torrent(torrent) {
        // let info = parse_torrent(torrent.torrentFile);
        // this.setState({name: info.name});
        this.setState({name: torrent.name});
    }


    componentWillUnmount() {
        console.log('removing');
        this.props.client.remove(this.torrent.magnetURI);
    }

    render() {
        console.log('rendering a torrent');
        return (
            <div>
                <TorrentStats torrent={this.torrent}/>
                <PauseTorrent torrent={this.torrent} />
                <ResumeTorrent torrent={this.torrent} />
                <button onClick={this.save} >save</button>
                <button onClick={(e) => {this.props.remove(this);}} >remove</button>
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


class FileSaver extends Component {
    constructor(props) {
        super(props);
    }
}


class AddButton extends Component {
    constructor(props) {
        super(props);
        this.state = {link: ''};

        this.on_submit = this.on_submit.bind(this);
        this.on_change = this.on_change.bind(this);
    }

    on_submit(event) {
        this.props.new_torrent(this.state.link);

        event.preventDefault();
    }

    on_change(event) {
        this.setState({link: event.target.value});
    }

    render() {
        return (
            <form onSubmit={this.on_submit}>
                <input
                    type="text"
                    value={this.state.value}
                    onChange={this.on_change}
                />
                {/*<button type="submit" />*/}
            </form>
        );
    }
}


export default Client;
