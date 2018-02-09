import React, { Component } from 'react';
import './Client.css';

// this is perhaps wrong
var WebTorrent = require('webtorrent');
// var parse_torrent = require('parse-torrent');


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
        this.pause_torrent = this.pause_torrent.bind(this);
        this.resume_torrent = this.resume_torrent.bind(this);

        // this could break: ontorrent handler might have to be keyword
        this.torrent = props.client.add(
            props.magnet, this.on_torrent
        );
        this.state = {
            name: 'sample',
            download_speed: 0,
            upload_speed: 0,
            progress: 0
        };
    }

    // NOTE: this pauses NEW connections
    // looks like an actual pause of download is not supported
    pause_torrent(event) {
        console.log('paused');
        this.torrent.pause();
    }

    resume_torrent(event) {
        console.log('resumed');
        this.torrent.resume();
    }

    // TODO: use StreamSaver to save the torrent as it's downloading.
    // You can attempt a nasty hack to delete the downloaded pieces that have
    // been saved to limit memory usage. May not work
    save_torrent() {}

    update_stats() {
        // console.log(this.torrent.name);
        this.setState({download_speed: this.torrent.downloadSpeed});
        this.setState({upload_speed: this.torrent.uploadSpeed});
        this.setState({progress: this.torrent.progress});
    }

    on_torrent(torrent) {
        // console.log('Metadata fetched');
        // let info = parse_torrent(torrent.torrentFile);
        // this.setState({name: info.name});
        // this didnt work 10 minutes ago???
        this.setState({name: torrent.name});
    }

    componentDidMount() {
        this.stats_service = setInterval(() => {this.update_stats();}, 1000);
    }

    componentWillUnmount() {
        console.log('removing');
        clearInterval(this.stats_service);
        this.props.client.remove(this.torrent.magnetURI);
    }

    render() {
        console.log('rendering a torrent');
        return (
            <div>
                <span> {this.state.name} </span>
                <span> {this.state.progress.toFixed(2)} </span>
                <span> {Math.round(this.state.download_speed / 1024)} Kb/s</span>
                <span> {Math.round(this.state.upload_speed / 1024)} Kb/s</span>
                <button onClick={this.pause_torrent} >pause</button>
                <button onClick={this.resume_torrent} >resume</button>
                <button onClick={this.save} >save</button>
                <button onClick={(e) => {this.props.remove(this);}} >remove</button>
            </div>
        );
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
