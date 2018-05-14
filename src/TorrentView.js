import React, { Component } from 'react';


function make_button(src, callback) {
    return <svg className={'svg-button svg-' + src} onClick={callback}>
        <use xlinkHref={'svg/buttons.svg#button-' + src}></use>
    </svg>;
}

class TorrentView extends Component {
    constructor(props) {
        super(props);
        this.on_torrent = this.on_torrent.bind(this);
        this.make_done = this.make_done.bind(this);

        // TODO: custom chunk store; consider not saving for seeding
        this.torrent = props.client.add(
            props.magnet, this.on_torrent
        );

        this.magnet = props.magnet;
        this.state = {
            done: false
        };
        // BUG: this doesn't stop downloading after metadata fetch
        this.torrent.pause();

        this.torrent.on('done', this.make_done);
    }

    on_torrent(torrent) {
        this.setState({name: torrent.name});
    }

    make_done() {
        this.setState({done: true});
    }

    componentWillUnmount() {
        this.props.client.remove(this.magnet);
    }

    render() {
        return (
            <div className="torrent">
                <TorrentStats torrent={this.torrent}/>
                <span className="buttons">
                    <PauseTorrent torrent={this.torrent} />
                    {make_button(
                        'remove',
                        (e) => this.props.remove(this)
                    )}
                    {make_button(
                        'download',
                        (e) => this.props.save(this.torrent)
                    )}
                </span>
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
            name: '(missing title)',
            download_speed: 0,
            upload_speed: 0,
            progress: 0
        };

        this.props.torrent.on(
            'ready',
            () => this.setState({name: this.props.torrent.name})
        );
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
                <span className="title"> {this.state.name} </span>
                <span className="progress"> {this.state.progress.toFixed(2)} </span>
                <span className="down-speed"> {Math.round(this.state.download_speed / 1024)} Kb/s</span>
                <span className="up-speed"> {Math.round(this.state.upload_speed / 1024)} Kb/s</span>
            </React.Fragment>
        );
    }
}

// TODO: make buttons dynamic in size
// Unneeded code. You can puy into functions of ~3 lines
class PauseTorrent extends Component {
    constructor(props) {
        super(props);
        this.pause_torrent = this.pause_torrent.bind(this);
        this.resume_torrent = this.resume_torrent.bind(this);

        this.state = {paused: false};
    }

    render() {
        if (this.state.paused) {
            return make_button(
                'play',
                this.resume_torrent
            );
        } else {
            return make_button(
                'pause',
                this.pause_torrent
            );
        }
    }
    // NOTE: this pauses NEW connections
    // looks like an actual pause of download is not supported
    pause_torrent(event) {
        this.props.torrent.pause();
        this.setState({paused: true});
    }

    resume_torrent(event) {
        this.props.torrent.resume();
        this.setState({paused: false});
    }
}

export default TorrentView;
