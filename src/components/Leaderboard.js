const React = require('react');
var _ = require('lodash');
import { Run } from './Run'
import { LBTable, LBTableHead, LBTableRowHead, LBTableDataHead, LBTableBody } from './LeaderboardTable'
import legend from '../assets/json/legend.json5';
import { Legend } from './Legend'
import styled, { css, createGlobalStyle } from 'styled-components'

const LegendContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 0.5em;
    flex-wrap: wrap;
`;

export class Leaderboard extends React.Component {
    constructor(props) {
        super(props);

        const category = this.props.categories[0];

        const subcategories = this.getSubcategories(category);

        this.state = {
            category: category,
            subcategories: subcategories,
            subcategory_selections: subcategories.map(e => e[0]),
            show_all: true,
            legend_status: legend.reduce((o, l) => Object.assign(o, { [l["name"]]: _.omit(_.clone(l), ["name"]) }), {})
        }
    }

    getSubcategories(selected_category) {
        const subcategories_unfiltered = this.props.runs
            .filter(r => r["category"] == selected_category)
            .map(r => r["subcategory"])
            .map(r => r.split(", "));

        let subcategories = [];

        if (subcategories_unfiltered[0] !== undefined) {
            for (var i = 0; i < subcategories_unfiltered[0].length; i++) {
                subcategories.push([...new Set(subcategories_unfiltered.map(s => s[i]))]);
            }
        }
        return subcategories;
    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(prevProps.categories, this.props.categories)) {
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

    handleChangeFilter(e) {
        let ls = _.clone(this.state.legend_status);
        ls[e.target.dataset["name"]]["filter"] = !ls[e.target.dataset["name"]]["filter"];

        this.setState({
            legend_status: ls
        });
    }

    Subcategories(props) {
        if (props.subcategories[0] == '') return;
        return (
            <div class="subcategories">
                <h2>Select subcategory(s):</h2>
                {props.subcategories.map((cs, i) => {
                    return (
                        <select key={i} disabled={props.value} data-id={i} onChange={props.handleChangeSubcategory} value={props.subcategory_selections[i]}>
                            {cs.map((c, i) => (
                                <option key={i} value={c}>{c}</option>
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
        const seen = new Set();
        return (
            <div>
                <h2>Select category:</h2>
                <select onChange={this.handleChangeCategory.bind(this)} value={this.state.category}>
                    {this.props.categories.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                    ))}
                </select>
                <this.Subcategories
                    subcategories={this.state.subcategories}
                    handleChangeSubcategory={this.handleChangeSubcategory.bind(this)}
                    subcategory_selections={this.state.subcategory_selections}
                    handleChangeShowAll={this.handleChangeShowAll.bind(this)}
                    value={this.state.show_all} />
                <LegendContainer>
                    {Object.keys(this.state.legend_status).map((k, i) => {
                        return <Legend name={k} checked={this.state.legend_status[k]["filter"]} l={this.state.legend_status[k]} handleChangeFilter={this.handleChangeFilter.bind(this)} key={i} />
                    })}
                </LegendContainer>
                <LBTable>
                    <LBTableHead>
                        <LBTableRowHead>
                            {this.props.columns.map((h, i) => {
                                if (legend.map(l => l["name"]).includes(h)) return;
                                switch (h) {
                                    case "hash":
                                    case "game":
                                    case "category":
                                    case "emulated":
                                    case "region":
                                    case "subcategory":
                                        return
                                    default:
                                        return <LBTableDataHead key={i}>{h}</LBTableDataHead>
                                }
                            })}
                        </LBTableRowHead>
                    </LBTableHead>
                    <LBTableBody>
                        {
                        this.props.runs.filter((r) => r["category"] == this.state.category)
                            .filter((r) => {
                                if (this.state.show_all) return true;
                                return _.isEqual(r["subcategory"].split(", "), this.state.subcategory_selections)
                            })
                            .filter(_.overEvery(Object.keys(this.state.legend_status).map(k => {
                                if (!this.state.legend_status[k]["filter"]) {
                                    return r => !r[k]
                                }
                            })))
                            .filter(e => {
                                const duplicate = seen.has(e.player);
                                seen.add(e.player);
                                return !duplicate;
                            })
                            .map((r, i) => {
                                return <Run r={r} columns={this.props.columns} i={i} key={i} />
                            })}
                    </LBTableBody>
                </LBTable>
            </div>
        )
    }
}
