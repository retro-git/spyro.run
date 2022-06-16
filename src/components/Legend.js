var React = require('react');
import styled, { css, createGlobalStyle } from 'styled-components'

const LegendSpan = styled.span`
    margin: 0em 0.2em;
`;

export class Legend extends React.Component {
    render() {
        return (
            <LegendSpan style={{ backgroundColor: this.props.l["colour"] }}>{this.props.name}
                <label>
                    <input type="checkbox" data-name={this.props.name} onChange={this.props.handleChangeFilter} defaultChecked={this.props.checked} />
                </label>
            </LegendSpan>
        );
    }
}