var React = require('react');

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
            })
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
                <select onChange={this.handleChange.bind(this)}>
                    {this.props.categories.map((c) => (
                        <option value={c}>{c}</option>
                    ))}
                </select>
                <table>
                    <thead>
                        <tr>
                            {this.props.columns.map((h) => (
                                <th>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.runs.filter((r) => r[this.props.columns.indexOf("category")] == this.state.category).map((r) => (
                            <tr>
                                {r.map((d) => (
                                    <td>{d}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}
