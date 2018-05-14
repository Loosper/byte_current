import React, { Component } from 'react';

import streamSaver from 'streamsaver';


class FileSaver extends Component {
    constructor(props) {
        super(props);

        this.get_files = this.get_files.bind(this);
        this.save_files = this.save_files.bind(this);
        this.del_file = this.del_file.bind(this);
        this.add_file = this.add_file.bind(this);

        this.torrent = props.torrent;
        this.file_buttons = [];
        this.files_to_save = [];

        if (this.torrent.ready) {
            this.get_files();
        } else {
            this.torrent.on('ready', this.get_files);
        }
    }

    get_files() {
        let id = 1;
        for (let file of this.torrent.files) {
            this.file_buttons.push(
                <CheckBox
                    key={id++}
                    file={file}
                    add_file={this.add_file}
                    del_file={this.del_file}
                />
            );
        }
    }

    add_file(file) {
        this.files_to_save.push(file);
    }

    del_file(file) {
        let index = this.files_to_save.indexOf(file);
        if (index > -1)
            this.files_to_save.splice(index, 1);
    }

    // REVIEW: this is all fine and dandy, but it does NOT work in firefox :(
    save_files() {
        // BUG: doesnt work for the ones before the last one???
        for (let file of this.files_to_save) {
            let stream = streamSaver.createWriteStream(file.name, file.size);
            let writer = stream.getWriter();

            file.createReadStream()
                .on('data', (data) => writer.write(data))
                .on('end', () => writer.close());
        }

        this.props.close();
    }

    // REVIEW: upgrade path is to show paths in tree like order
    render() {
        return (
            <div id="file-saver">
                {'Select files to save from ' + this.torrent.name}
                <div>{this.file_buttons}</div>
                <button onClick={this.save_files}>Ok</button>
                <button onClick={this.props.close}>Cancel</button>
            </div>
        );
    }
}

class CheckBox extends Component{
    constructor(props) {
        super(props);

        this.click = this.click.bind(this);

        this.file = this.props.file;
        this.state = {
            checked: false
        };
    }

    click(e) {
        let check = !this.state.checked;

        if (check === true) {
            this.props.add_file(this.file);
        } else {
            this.props.del_file(this.file);
        }

        this.setState({checked: check});
    }

    render() {
        return <React.Fragment>
            <input
                type="checkbox"
                checked={this.state.checked}
                onChange={this.click}
            />
            <label>{this.file.name}</label>
        </React.Fragment>;
    }
}

export default FileSaver;
