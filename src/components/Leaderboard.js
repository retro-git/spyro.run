const React = require('react');
const JSON5 = require('json5')
var _ = require('lodash');
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import overrides from '../data/overrides.json5';

export class Leaderboard extends React.Component {
    constructor(props) {
        super(props);

        const category = this.props.categories[0];

        const subcategories = this.getSubcategories(category);

        this.state = {
            category: category,
            subcategories: subcategories,
            subcategory_selections: subcategories.map(e => e[0]),
            show_all: false,
        }
    }

    getSubcategories(selected_category) {
        const subcategories_unfiltered = this.props.runs
            .filter(r => r[this.props.columns.indexOf("category")] == selected_category)
            .map(r => r[this.props.columns.indexOf("subcategory")])
            .map(r => r.split(", "));

        let subcategories = [];

        if (subcategories_unfiltered[0] !== undefined) {
            for (var i = 0; i < subcategories_unfiltered[0].length; i++) {
                subcategories.push([...new Set(subcategories_unfiltered.map(s => s[i]))]);
            }
        }
        return subcategories;
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.categories != this.props.categories) {
            const subcategories = this.getSubcategories(this.props.categories[0]);
            this.setState({
                category: this.props.categories[0],
                subcategories: subcategories,
                subcategory_selections: subcategories.map(e => e[0])
            });
        }
    }

    handleChangeCategory(e) {
        const subcategories = this.getSubcategories(e.target.value);
        this.setState({
            category: e.target.value,
            subcategories: subcategories,
            subcategory_selections: subcategories.map(e => e[0])
        })
    }

    handleChangeSubcategory(e) {
        let subcategory_selections = [...this.state.subcategory_selections];
        subcategory_selections[e.target.dataset["id"]] = e.target.value;
        this.setState({
            subcategory_selections: subcategory_selections,
        })
    }

    handleChangeShowAll(e) {
        this.setState({
            show_all: !this.state.show_all,
        })
    }

    Subcategories(props) {
        if (props.subcategories[0] == '') return;
        return (
            <div>
                <h5>Select subcategory(s):</h5>
                {props.subcategories.map((cs, i) => {
                    return (
                        <select data-id={i} onChange={props.handleChangeSubcategory} value={props.subcategory_selections[i]}>
                            {cs.map((c) => (
                                <option value={c}>{c}</option>
                            ))}
                        </select>
                    )
                })}
                <label>
                    <input type="checkbox" onChange={props.handleChangeShowAll} defaultChecked={props.value} />
                    Show all
                </label>
            </div>
        )
    }

    render() {
        return (
            <div>
                <h5>Select category:</h5>
                <select onChange={this.handleChangeCategory.bind(this)} value={this.state.category}>
                    {this.props.categories.map((c) => (
                        <option value={c}>{c}</option>
                    ))}
                </select>
                <this.Subcategories
                    subcategories={this.state.subcategories}
                    handleChangeSubcategory={this.handleChangeSubcategory.bind(this)}
                    subcategory_selections={this.state.subcategory_selections}
                    handleChangeShowAll={this.handleChangeShowAll.bind(this)}
                    value={this.state.show_all} />
                <table>
                    <thead>
                        <tr>
                            {this.props.columns.map((h) => {
                                switch (h) {
                                    case "game":
                                        return
                                    case "category":
                                        return
                                    case "subcategory":
                                        return
                                    default:
                                        return <th>{h}</th>
                                }
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.runs.filter((r) => r[this.props.columns.indexOf("category")] == this.state.category)
                            .filter((r) => {
                                if (this.state.show_all) return true;
                                return r[this.props.columns.indexOf("subcategory")].split(", ").every((e, i) => {
                                    return e === this.state.subcategory_selections[i]
                                })
                            })
                            .map((r, rank) => {
                                const picked = _.pick(Object.fromEntries(r.map((e, i) => [this.props.columns[i], e])), ['game', 'category', 'player', 'time', 'date']);
                                const hash = Base64.stringify(sha256(JSON.stringify(picked)));
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
                                            case this.props.columns.indexOf("subcategory"):
                                                return
                                            case this.props.columns.indexOf("player"):
                                                return <td>({rank+1}) {data}</td>
                                            case this.props.columns.indexOf("emulated"):
                                                return <td>{data ? "Yes" : "No"}</td>
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
