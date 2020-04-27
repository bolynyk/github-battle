import React from 'react';
import PropTypes from 'prop-types';

export default class Hover extends React.Component {

    state = {
        hovering: false,
    }

    mouseOver = () => {
        this.setState({
            hovering: true
        });
    }
    mouseOut = () => {
        this.setState({
            hovering: false
        });
    }
    render() {
        return (
            <div onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
                {this.props.render(this.state.hovering)}
            </div>
        );
    }
}

