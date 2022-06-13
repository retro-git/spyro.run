var React = require('react');
var ReactDOM = require('react-dom/client');
import { SubmitForm } from './components/SubmitForm.js'

const appElement = document.getElementById('app');
ReactDOM.createRoot(appElement).render(
    <div class="container">
        <h1>test</h1>
        <SubmitForm />
    </div>
);