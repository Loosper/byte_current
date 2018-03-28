import React, { Component } from 'react';
import './css/addButton.css';

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
                    placeholder="Enter magnet link"
                    value={this.state.value}
                    onChange={this.on_change}
                />
                <button
                    id="add-button"
                    type="submit"
                >Add</button>
            </form>
        );
    }
}

export default AddButton;
