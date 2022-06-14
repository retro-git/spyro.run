var React = require('react');

export class Legend extends React.Component {
    render() {
        return (
            <>
                <span style={{ backgroundColor: this.props.l["colour"]}}>{this.props.name}
                <label>
                    <input type="checkbox" data-name={this.props.name} onChange={this.props.handleChangeFilter} defaultChecked={this.props.checked}/>
                </label>
                </span>
            </>
        );
    }
}