var React = require('react');
var ReactDOM = require('react-dom/client');
import { Boards } from './components/Boards.js'
import { NavBar } from './components/NavBar.js'

const appElement = document.getElementById('app');
ReactDOM.createRoot(appElement).render(
    <>
        <Boards mode="normal" sort="time" sort_order={0} />
    </>
);