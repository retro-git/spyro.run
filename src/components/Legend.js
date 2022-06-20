var React = require('react');
import styled, { css, createGlobalStyle } from 'styled-components'

const LegendSpan = styled.div`
    margin: 0.1em 0.15em;
    padding: 0.2em;
    border-radius: 0.5em;
`;

const LegendLabel = styled.label`
    cursor: pointer;
`;

export class Legend extends React.Component {
    render() {
        let txt = !this.props.l ? (this.props.name ? this.props.name : _.startCase(this.props.type + " unknown")) : "text" in this.props.l ? this.props.l.text : this.props.name;
        return (
            <LegendSpan style={{ backgroundColor: this.props.l ? this.props.l["colour"] : "grey" }}>
                <LegendLabel htmlFor={txt+this.props.type}>{txt}</LegendLabel>
                <input id={txt+this.props.type} type="checkbox" data-name={this.props.name} data-type={this.props.type} onChange={this.props.handleChangeFilter} checked={this.props.checked} />
            </LegendSpan>
        );
    }
}