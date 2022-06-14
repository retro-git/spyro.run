var React = require('react');

export class Legend extends React.Component {
    render() {
        return (
            <>
                <span style={{ backgroundColor: this.props.colour }}>{this.props.text}
                <label>
                    <input type="checkbox"/>
                </label>
                </span>
            </>
        );
    }
}