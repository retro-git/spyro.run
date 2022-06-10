var React = require('react');
var ReactDOM = require('react-dom/client');
import './index.scss'
import { App } from './components/App.js'

const appElement = document.getElementById('app');
ReactDOM.createRoot(appElement).render(<App/>);