import React, { Component } from 'react';

import streamSaver from 'streamsaver';


class FileSaver extends Component {
    constructor(props) {
        super(props);

        this.get_files = this.get_files.bind(this);
        this.save_file = this.save_file.bind(this);

        this.torrent = props.torrent;
        this.files = [];

        if (this.torrent.ready) {
            this.get_files();
        } else {
            this.torrent.on('ready', this.get_files);
        }
    }

    get_files() {
        let id = 1;
        for (let file of this.torrent.files) {
            this.files.push(
                <button key={id++} onClick={(e) => this.save_file(file)} >{file.name}</button>
            );
        }
    }

    // REVIEW: this is all fine and dandy, but it does NOT work in firefox :(
    save_file(file) {
        let stream = streamSaver.createWriteStream(file.name, file.size);
        let writer = stream.getWriter();

        file.createReadStream()
            .on('data', (data) => {writer.write(data); console.log('fetched data');})
            .on('end', () => {writer.close(); console.log('done');});
    }

    render() {
        return (
            <div>
                <div>{this.torrent.name}</div>
                <div>{this.files}</div>
            </div>
        );
    }
}

export default FileSaver;
