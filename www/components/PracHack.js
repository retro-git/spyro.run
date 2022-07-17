var React = require('react');
import { NavBar } from './NavBar.js'
import '../assets/css/boards.scss'
import { echo_string } from "../../pkg/patcher";

export class PracHack extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {}
    render() {
        echo_string("Hello, World!");
        return (
            <div>
                <NavBar />
            </div>
        )
    }
}