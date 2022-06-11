const React = require('react');
const JSON5 = require('json5')
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import overrides from '../data/overrides.json5';

export class Leaderboard extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        category: this.props.categories[0],
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.categories != this.props.categories) {
            this.setState({
                category: this.props.categories[0],
            });
        }
    }

    handleChange(e) {
        this.setState({
            category: e.target.value,
        })
    }

    render() {
        return (
            <div>
                <h5>Select category:</h5>
                <select onChange={this.handleChange.bind(this)} value={this.state.category}>
                    {this.props.categories.map((c) => (
                        <option value={c}>{c}</option>
                    ))}
                </select>
                <table>
                    <thead>
                        <tr>
                            {this.props.columns.map((h) => {
                                switch (h) {
                                    case "game":
                                        return
                                    case "category":
                                        return
                                    default:
                                        return <th>{h}</th>
                                }
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.runs.filter((r) => r[this.props.columns.indexOf("category")] == this.state.category).map((r) => {
                            const hash = Base64.stringify(sha256(JSON.stringify(r)));
                            const override = overrides[hash];
                            return <tr>
                                {r.map((data, index) => {
                                    if (override !== undefined && override[this.props.columns[index]] !== undefined) {
                                        data = override[this.props.columns[index]];
                                    }
                                    switch (index) {
                                        case this.props.columns.indexOf("game"):
                                            return
                                        case this.props.columns.indexOf("category"):
                                            return
                                        case this.props.columns.indexOf("time"):
                                            return (
                                                <td>
                                                    <button onClick={() => navigator.clipboard.writeText(hash)}>
                                                        {new Date(data * 1000).toISOString().substring(11, 19).replace(/^0(?:0:0?)?/, '')}
                                                    </button>
                                                </td>
                                            )
                                        default:
                                            return <td>{data}</td>
                                    }
                                })}
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}
