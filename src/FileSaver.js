import React, { Component } from 'react';

import streamSaver from 'streamsaver';


class FileSaver extends Component {
    constructor(props) {
        super(props);

        this.get_files = this.get_files.bind(this);
        this.save_file = this.save_file.bind(this);

        this.props.torrent.on('ready', this.get_files);
        this.files = [];
        this.state = {menu: false};
    }

    get_files() {
        for (let file of this.props.torrent.files) {
            this.files.push(
                <button onClick={(e) => this.save_file(file)} >{file.name}</button>
            );
        }
    }

    // REVIEW: this is all fine and dandy, but it does NOT work in firefox :(
    save_file(file) {
        this.setState({menu: false});
        let stream = streamSaver.createWriteStream(file.name, file.size);
        let writer = stream.getWriter();

        file.createReadStream()
            .on('data', (data) => {writer.write(data); console.log('fetched data');})
            .on('end', () => {writer.close(); console.log('done');});
    }

    render() {
        if (!this.state.menu) {
            return (
                <button onClick={(e) => this.setState({menu: true})} >save</button>
            );
        } else {
            return (
                <div>
                    {this.files}
                </div>
            );
        }
    }
}

export default FileSaver;
