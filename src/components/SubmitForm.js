var React = require('react');
import styled, { css, createGlobalStyle } from 'styled-components'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';

export class SubmitForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            message: 'Please write a submission.'
        };
    }

    handleChangeName(event) {
        this.setState({ name: event.target.value });
    }

    handleChangeMessage(event) {
        this.setState({ message: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log('An essay was submitted: ' + this.state.name + this.state.message);

        const request = new XMLHttpRequest();
        request.open("POST", "https://discord.com/api/webhooks/985964361334009896/RM4MhUUDrNCGNGUhXU2xrdoJrGy0hg3nb_9pMLmmULUsGKWVqV1pkabILCkt1Jpm2rdR");
        request.setRequestHeader('Content-type', 'application/json');

        const params = {
            content: "***" + this.state.name + "***" + " *sent message*: \n" + this.state.message,
        }

        request.send(JSON.stringify(params));
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit.bind(this)}>
                <Form.Label>
                    Name:
                    <Form.Control type="text" style = {{width: 500}}v alue={this.state.name} onChange={this.handleChangeName.bind(this)} />
                </Form.Label>
                <br></br>
                <Form.Label>
                    Essay:
                    <Form.Control as="textarea" style = {{width: 500}} rows={10} value={this.state.message} onChange={this.handleChangeMessage.bind(this)} />
                </Form.Label>
                <br></br>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        );
    }
}
