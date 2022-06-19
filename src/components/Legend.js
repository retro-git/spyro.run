var React = require('react');
import styled, { css, createGlobalStyle } from 'styled-components'

const LegendSpan = styled.div`
    margin: 0.1em 0.2em;
    padding: 0.3em;
    border-radius: 0.5em;
`;

export class Legend extends React.Component {
    render() {
        let txt = !this.props.l ? (this.props.name ? this.props.name : _.startCase(this.props.type + " unknown")) : "text" in this.props.l ? this.props.l.text : this.props.name;
        return (
            <LegendSpan style={{ backgroundColor: this.props.l ? this.props.l["colour"] : "grey" }}>
                <label for={txt}>{txt}</label>
                <input id={txt} type="checkbox" data-name={this.props.name} data-type={this.props.type} onChange={this.props.handleChangeFilter} checked={this.props.checked} />
            </LegendSpan>
        );
    }
}