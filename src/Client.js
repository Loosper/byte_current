import React, { Component } from 'react';
import './Client.css';

// this is perhaps wrong
var WebTorrent = require('webtorrent');
var parse_torrent = require('parse-torrent');

class Client extends Component {
    constructor(props) {
        super(props);
        this.add_torrent = this.add_torrent.bind(this);
        this.state = {torrents: []};
        this.client = new WebTorrent();
        // temporary
        this.id = 1;
    }

    // TODO: remove torrent, global upload/downlaod
    add_torrent(magnet_link) {
        let arr = this.state.torrents.slice();
        arr.push(<TorrentView
            key={this.id++}
            magnet={magnet_link}
            client={this.client}
        />);
        this.setState({torrents: arr});
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
        // this could break: ontorrent handler might have to be keyword
        this.on_torrent = this.on_torrent.bind(this);
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

    update_stats() {
        this.setState({download_speed: this.torrent.downloadSpeed});
        this.setState({upload_speed: this.torrent.uploadSpeed});
        this.setState({progress: this.torrent.progress});
    }

    on_torrent(torrent) {
        console.log('Metadata fetched');
        let info = parse_torrent(torrent.torrentFile);
        this.setState({name: info.name});
    }

    componentDidMount() {
        this.stats_service = setInterval(() => {this.update_stats();}, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.stats_service);
    }

    render() {
        console.log('rendering a torrent');
        // TODO: pause/resume/save buttons
        return (
            <div>
                <span> {this.state.name} </span>
                <span> {this.state.download_speed} </span>
                <span> {this.state.progress} </span>
                <span> {this.state.upload_speed} </span>
                <button>save</button>
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
