var React = require('react');
import "../assets/css/navbar.scss"

export class NavBar extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {}
    render() {
        return (
            <div className="nav">
                <a className="navlink" href="/">Home</a>
                <a className="navlink" href="/boards.html">Leaderboards</a>
                <a className="navlink" href="/records.html">WR History</a>
            </div>
        )
    }
}