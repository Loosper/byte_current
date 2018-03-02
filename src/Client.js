import React, { Component } from 'react';

import WebTorrent from 'webtorrent';
import AddButton from './AddButton.js';
import TorrentView from './TorrentView.js';

import './Client.css';
// var parse_torrent = require('parse-torrent');

// TODO: test browser support.
// This app uses a lot of modern fetures and will break on old browsers
// Use fileSaver for firefox or something like this

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

export default Client;
