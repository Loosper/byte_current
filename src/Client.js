import React, { Component } from 'react';
import './Client.css';

// this is perhaps wrong
var WebTorrent = require('webtorrent');

class Client extends Component {
    constructor(props) {
        super(props);
        this.add_torrent = this.add_torrent.bind(this);
        this.state = {torrents: []};
        this.client = new WebTorrent();
        // temporary
        this.id = 1;
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

    // TODO: remove torrent global upload/downlaod
    add_torrent(magnet_link) {
        let arr = this.state.torrents.slice();
        arr.push(<TorrentView key={this.id++} magnet={magnet_link} client={this.client} />);
        this.setState({torrents: arr});
    }
}

class TorrentView extends Component {
    constructor(props) {
        super(props);
        console.log('been there done that');
        // this could break: ontorrent handler might have to be keyword
        this.torrent = props.client.add(props.magnet_link, this.on_torrent);
        // NOTE: state variables are referenced when potentially undefined.
        // give `loading` values?
    }

    on_torrent(torrent) {
        console.log('Metadata fetched');
        // console.log(torrent.magnetURI);
        this.setState({name: this.torrent.name});
    }

    update_stats() {
        this.setState({download_speed: this.torren.downloadSpeed});
        this.setState({upload_speed: this.torren.uploadSpeed});
        this.setState({progress: this.torren.progress});
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
                <div> {this.state.name} </div>
                <div> {this.state.download_speed} </div>
                <div> {this.state.progress} </div>
                <div> {this.state.upload_speed} </div>
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

        console.log('sent');
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
