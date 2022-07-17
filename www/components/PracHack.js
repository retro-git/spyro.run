var React = require('react');
import { NavBar } from './NavBar.js'
import '../assets/css/boards.scss'

export class PracHack extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {}
    render() {
        return (
            <div>
                <NavBar />
            </div>
        )
    }
}