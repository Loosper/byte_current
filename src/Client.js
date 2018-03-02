import React, { Component } from 'react';

import WebTorrent from 'webtorrent';
import AddButton from './AddButton.js';
import TorrentView from './TorrentView.js';
import FileSaver from './FileSaver.js';
import NotificationView from './NotificationView';
import ClientStats from './ClientStats';
import './Client.css';


// TODO: test browser support.
// This app uses a lot of modern fetures and will break on old browsers
// Use fileSaver for firefox or something like this

class Client extends Component {
    constructor(props) {
        super(props);
        this.add_torrent = this.add_torrent.bind(this);
        this.remove_torrent = this.remove_torrent.bind(this);
        this.save_torrent = this.save_torrent.bind(this);
        this.close_error = this.close_error.bind(this);

        this.state = {
            torrents: [],
            saver: null,
            error: null
        };
        this.client = new WebTorrent();
        this.hashes = new Set();

        this.client.on('error', function (err) {
            console.error('ERROR: ' + err.message);
        });

        this.id = 1;
    }

    // TODO: global upload/downlaod
    add_torrent(magnet_link) {
        let arr = this.state.torrents.slice();

        if (magnet_link.match(/\burn:btih:([A-F\d]+)\b/i) == null) {
            this.display_error('Invalid magnet link');
            return;
        }

        if (this.hashes.has(magnet_link)) {
            this.display_error('Torrent already added');
            return;
        } else {
            this.hashes.add(magnet_link);
        }

        arr.push(<TorrentView
            key={this.id++}
            magnet={magnet_link}
            client={this.client}
            remove={this.remove_torrent}
            save={this.save_torrent}
        />);
        this.setState({torrents: arr});
    }

    save_torrent(torrent) {
        this.setState({saver: <FileSaver torrent={torrent} />});
    }

    remove_torrent(torrent_view) {
        let index = this.state.torrents.indexOf(torrent_view);
        let new_torrents = this.state.torrents.slice();

        new_torrents.splice(index, 1);

        this.setState({torrents: new_torrents, saver: null});
        this.hashes.delete(torrent_view.magnet);
    }

    display_error(error_msg) {
        this.setState({
            error: <NotificationView message={error_msg} close={this.close_error}/>
        });
    }

    close_error() {
        this.setState({error: null});
    }

    render() {
        return (
            <div>
                <header>
                    <h1>Torrent app</h1>
                </header>
                <ClientStats client={this.client}/>
                <AddButton new_torrent={this.add_torrent} />
                {this.state.torrents}
                {this.state.saver}
                {this.state.error}
            </div>
        );
    }
}

export default Client;
