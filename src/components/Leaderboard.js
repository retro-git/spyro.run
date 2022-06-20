const React = require('react');
var _ = require('lodash');
import { Run } from './Run'
import { LBTable, LBTableHead, LBTableRowHead, LBTableDataHead, LBTableBody } from './LeaderboardTable'
import legend from '../assets/json/legend.json5';
import filter_uniqs_list from '../assets/json/filter_uniqs.json5';
import { Legend } from './Legend'
import styled, { css, createGlobalStyle } from 'styled-components'
import sortables from '../sortables.js'

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
            legend_status: legend.reduce((o, l) => Object.assign(o, { [l["name"]]: _.omit(_.clone(l), ["name"]) }), {}),
            filter_uniqs_status: this.generateFilterUniqsStatus(category),
            other_status: 1,
            obsolete_status: 0,
            invert_status: 0,
            sort: this.props.sort,
            sort_order: this.props.sort_order,
        }
    }

    generateFilterUniqsStatus(category) {
        return filter_uniqs_list.reduce((prevObj, curFilter) => {
            prevObj[curFilter] = this.getUniques(curFilter, category)
                .reduce((prev, cur) => {
                    prev[cur] = 1;
                    return prev;
                }, {});
            return prevObj;
        }, {})
    }

    getUniques(column, selected_category) {
        return [...new Set(this.props.runs.filter(r => r["category"] == selected_category).map(r => r[column]))]
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

        this.setState({
            category: category,
            subcategories: subcategories,
            subcategory_selections: subcategories.map(e => e[0]),
            filter_uniqs_status: this.generateFilterUniqsStatus(category),
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

    handleChangeSort(e) {
        let column = e.target.dataset["column"];
        
        this.setState({
            sort: column,
            sort_order: !this.state.sort_order
        });
    }

    handleChangeShowAll(e) {
        this.setState({
            show_all: !this.state.show_all,
        })
    }

    handleChangeFilter(e) {
        let type = e.target.dataset["type"];

        if (filter_uniqs_list.includes(type)) {
            let fus = _.clone(this.state.filter_uniqs_status);
            fus[type][e.target.dataset["name"]] = !fus[type][e.target.dataset["name"]];
            this.setState({ filter_uniqs_status: fus });
            return
        }

        switch (e.target.dataset["type"]) {
            case "other":
                this.setState({
                    other_status: !this.state.other_status,
                });
                break;
            case "invert":
                this.setState({
                    invert_status: !this.state.invert_status,
                });
                break;
            case "obsolete":
                this.setState({
                    obsolete_status: !this.state.obsolete_status,
                });
                break;
            default:
                let ls = _.clone(this.state.legend_status);
                ls[e.target.dataset["name"]]["filter"] = !ls[e.target.dataset["name"]]["filter"];
                this.setState({ legend_status: ls });
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

        let legend_filter = _.overEvery(Object.keys(this.state.legend_status).map(k => {
            if (!this.state.legend_status[k]["filter"]) {
                return this.state.legend_status[k]["invert"] ? r => r[k] : r => !r[k]
            }
        }));

        let uniqs_filters = Object.keys(this.state.filter_uniqs_status).map((type, i) => {
            return _.overEvery(Object.keys(this.state.filter_uniqs_status[type]).map((k, i) => {
                if (!this.state.filter_uniqs_status[type][k]) {
                    return r => !(r[type] == k);
                }
            }))
        })

        let other_filter = _.negate(_.overEvery(Object.keys(_.omit(_.clone(this.state.legend_status), ["other"])).map(k => {
            if (k == "date") return r => r["date"] !== "";
            return r => !r[k];
        })));

        let filters = [legend_filter, uniqs_filters].flat();

        if (!this.state.other_status) filters.push(other_filter);

        if (this.state.invert_status) {
            runs_filtered = _.reject(runs_filtered, _.overEvery(filters));
        }
        else {
            runs_filtered = runs_filtered.filter(_.overEvery(filters));
        }

        runs_filtered.sort(sortables[this.props.sort]["func"]);

        if (!this.state.obsolete_status && this.props.mode === "normal") {
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
            }, []);
        }

        runs_filtered.sort(sortables[this.state.sort]["func"]);
        if (this.state.sort_order) runs_filtered.reverse();

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
                    <Legend type="invert" name={"invert filters"} checked={this.state.invert_status} handleChangeFilter={this.handleChangeFilter.bind(this)} />
                    {this.props.mode === "normal" && <Legend type="obsolete" name={"obsolete runs"} checked={this.state.obsolete_status} handleChangeFilter={this.handleChangeFilter.bind(this)} />}
                </LegendContainer>
                <LegendContainer>
                    {Object.keys(this.state.legend_status).map((k, i) => {
                        return <Legend name={k} checked={this.state.legend_status[k]["filter"]} l={this.state.legend_status[k]} handleChangeFilter={this.handleChangeFilter.bind(this)} key={i} />
                    })}
                    <Legend type="other" name={"other"} checked={this.state.other_status} handleChangeFilter={this.handleChangeFilter.bind(this)} />
                </LegendContainer>
                <LegendContainer>
                    {Object.keys(this.state.filter_uniqs_status).map((type, i) => {
                        return Object.keys(this.state.filter_uniqs_status[type]).map((k, i) => {
                            return <Legend type={type} name={k} checked={this.state.filter_uniqs_status[type][k]} handleChangeFilter={this.handleChangeFilter.bind(this)} key={i} />
                        })
                    })}
                </LegendContainer>
                <LBTable>
                    <LBTableHead>
                        <LBTableRowHead>
                            {this.props.columns.map((h, i) => {
                                if (legend.map(l => "drawcol" in l && l["drawcol"] ? "" : l["name"]).includes(h)) return;

                                if (Object.keys(sortables).includes(h)) {
                                    return <LBTableDataHead clickable data-column={h} onClick={this.handleChangeSort.bind(this)} key={i}>{h}</LBTableDataHead>
                                }

                                switch (h) {
                                    case "hash":
                                    case "id":
                                    case "game":
                                    case "category":
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
