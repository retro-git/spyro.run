var React = require('react');
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import overrides from '../data/overrides.json5';
import styled, { css } from 'styled-components'

const checkColour = (props) => {
    if (props.cheated) {
        return 'red';
    } else return 'black';
}

const Row = styled.tr`
  color: ${checkColour};
`;

export class Run extends React.Component {
    render() {
        let r = Object.fromEntries(this.props.r.map((e, i) => [this.props.columns[i], e]));
        const picked = _.pick(r, ['game', 'category', 'player', 'time', 'date']);
        const hash = Base64.stringify(sha256(JSON.stringify(picked)));
        _.assign(r, overrides[hash]);

        return <Row key={this.props.i} cheated={r["cheated"]}>
            {Object.keys(r).map((key, index) => {
                const data = r[key];
                switch (key) {
                    case "game":
                        return
                    case "category":
                        return
                    case "subcategory":
                        return
                    case "player":
                        return <td key={index}>({this.props.i + 1}) {data}</td>
                    case "emulated":
                        return <td key={index}>{data ? "Yes" : "No"}</td>
                    case "time":
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