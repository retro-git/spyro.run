var React = require('react');

export class Leaderboard extends React.Component {
    constructor(props) {
        super(props);

        console.log([...new Set(this.props.runs.map(r => r[this.props.columns.indexOf("category")]))]);
    } 

    render() {
        return (
            <table>
                <thead>
                    <tr>
                        {this.props.columns.map((h) => (
                            <th>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {this.props.runs.map((r) => (
                        <tr>
                            {r.map((d) => (
                                <td>{d}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }
}
