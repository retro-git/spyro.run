var React = require('react');

export class Home extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {}
    render() {
        return (
            <a href="/boards.html">boards</a>
        );
    }
}