var React = require('react');
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import overrides from '../data/overrides.json5';
import styled, { css } from 'styled-components'

const Row = styled.tr`
  color: black;
`;

export class Run extends React.Component {
    render() {
        const picked = _.pick(Object.fromEntries(this.props.r.map((e, i) => [this.props.columns[i], e])), ['game', 'category', 'player', 'time', 'date']);
        const hash = Base64.stringify(sha256(JSON.stringify(picked)));
        const override = overrides[hash];
        return <Row key={this.props.i}>
            {this.props.r.map((data, index) => {
                if (override !== undefined && override[this.props.columns[index]] !== undefined) {
                    data = override[this.props.columns[index]];
                }
                switch (index) {
                    case this.props.columns.indexOf("game"):
                        return
                    case this.props.columns.indexOf("category"):
                        return
                    case this.props.columns.indexOf("subcategory"):
                        return
                    case this.props.columns.indexOf("player"):
                        return <td key={index}>({this.props.i + 1}) {data}</td>
                    case this.props.columns.indexOf("emulated"):
                        return <td key={index}>{data ? "Yes" : "No"}</td>
                    case this.props.columns.indexOf("time"):
                        return (
                            <td key={index}>
                                <button key={index} className="button" onClick={() => navigator.clipboard.writeText(hash)}>
                                    {new Date(data * 1000).toISOString().substring(11, 19).replace(/^0(?:0:0?)?/, '')}
                                </button>
                            </td>
                        )
                    default:
                        return <td key={index}>{data}</td>
                }
            })}
        </Row>
    }
}