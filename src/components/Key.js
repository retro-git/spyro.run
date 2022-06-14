var React = require('react');

export class Key extends React.Component {
    render() { 
        return ( 
            <span style={{backgroundColor: this.props.colour}}>{this.props.text}</span>
         );
    }
}