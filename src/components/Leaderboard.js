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
        const platforms = this.getPlatforms(category);
        const regions = this.getRegions(category);

        this.state = {
            category: category,
            subcategories: subcategories,
            subcategory_selections: subcategories.map(e => e[0]),
            show_all: true,
            legend_status: legend.reduce((o, l) => Object.assign(o, { [l["name"]]: _.omit(_.clone(l), ["name"]) }), {}),
            platform_status: platforms.reduce((prev, cur) => {
                prev[cur] = 1;
                return prev;
            }, {}),
            region_status: regions.reduce((prev, cur) => {
                prev[cur] = 1;
                return prev;
            }, {}),
        }
    }

    getPlatforms(selected_category) {
        return [...new Set(this.props.runs.filter(r => r["category"] == selected_category).map(r => r["platform"]))]
    }

    getRegions(selected_category) {
        return [...new Set(this.props.runs.filter(r => r["category"] == selected_category).map(r => r["region"]))]
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

    updateData(category) {
        const subcategories = this.getSubcategories(category);
        const platforms = this.getPlatforms(category);
        const regions = this.getRegions(category);
        this.setState({
            category: category,
            subcategories: subcategories,
            subcategory_selections: subcategories.map(e => e[0]),
            platform_status: platforms.reduce((prev, cur) => {
                prev[cur] = 1;
                return prev;
            }, {}),
            region_status: regions.reduce((prev, cur) => {
                prev[cur] = 1;
                return prev;
            }, {}),
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(prevProps.game, this.props.game)) {
            this.updateData(this.props.categories[0]);
        }
    }

    handleChangeCategory(e) {
        this.updateData(e.target.value);
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
        switch(e.target.dataset["type"]) {
            case "platform":
                let ps = _.clone(this.state.platform_status);
                ps[e.target.dataset["name"]] = !ps[e.target.dataset["name"]];
                this.setState({platform_status: ps});
                break;
            case "region":
                let rs = _.clone(this.state.region_status);
                rs[e.target.dataset["name"]] = !rs[e.target.dataset["name"]];
                this.setState({region_status: rs});
                break;
            default:
                let ls = _.clone(this.state.legend_status);
                ls[e.target.dataset["name"]]["filter"] = !ls[e.target.dataset["name"]]["filter"];
                this.setState({legend_status: ls});
        }
    }

    Subcategories(props) {
        if (props.subcategories[0] == '') return;
        return (
            <div className="subcategories">
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
        let runs_filtered = this.props.runs.filter((r) => r["category"] == this.state.category)
            .filter((r) => {
                if (this.state.show_all) return true;
                return _.isEqual(r["subcategory"].split(", "), this.state.subcategory_selections)
            })
            .filter(_.overEvery(Object.keys(this.state.legend_status).map(k => {
                if (!this.state.legend_status[k]["filter"]) {
                    return r => !r[k]
                }
            })))
            .filter(_.overEvery(Object.keys(this.state.platform_status).map(k => {
                if (!this.state.platform_status[k]) {
                    return r => !(r["platform"] == k);
                }
            })))
            .filter(_.overEvery(Object.keys(this.state.region_status).map(k => {
                if (!this.state.region_status[k]) {
                    return r => !(r["region"] == k);
                }
            })))

        if (this.props.mode === "normal") {
            runs_filtered = runs_filtered.filter(e => {
                const duplicate = seen.has(e.player);
                seen.add(e.player);
                return !duplicate;
            });
        }
        else if (this.props.mode === "records") {
            runs_filtered = runs_filtered.filter(e => {
                return e["date"]
            }).reduce((prev, cur) => {
                if (prev.length == 0 || prev[prev.length - 1]["time"] > cur["time"]) {
                    prev.push(cur);
                }
                return prev;
            }, []).reverse();
        }

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
                <LegendContainer>
                    {Object.keys(this.state.platform_status).map((k, i) => {
                        return <Legend type="platform" name={k} checked={this.state.platform_status[k]} handleChangeFilter={this.handleChangeFilter.bind(this)} key={i} />
                    })}
                    {Object.keys(this.state.region_status).map((k, i) => {
                        return <Legend type="region" name={k} checked={this.state.region_status[k]} handleChangeFilter={this.handleChangeFilter.bind(this)} key={i} />
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
                                    case "reason":
                                    case "subcategory":
                                        return
                                    default:
                                        return <LBTableDataHead key={i}>{h}</LBTableDataHead>
                                }
                            })}
                        </LBTableRowHead>
                    </LBTableHead>
                    <LBTableBody>
                        {runs_filtered.map((r, i) => {
                            return <Run r={r} columns={this.props.columns} i={i} key={i} />
                        })}
                    </LBTableBody>
                </LBTable>
            </div>
        )
    }
}
