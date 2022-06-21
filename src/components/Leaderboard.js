const React = require('react');
var _ = require('lodash');
import { Run } from './Run'
import { LBTable, LBTableHead, LBTableRowHead, LBTableDataHead, LBTableBody } from './LeaderboardTable'
import legend from '../assets/json/legend.json5';
import filter_uniqs_list from '../assets/json/filter_uniqs.json5';
import { Legend } from './Legend'
import styled, { css, createGlobalStyle } from 'styled-components'
import sortables from '../sortables.js'

let keys = {
    "KeyA": 0, "KeyS": 0,
};

document.addEventListener('keydown', (event) => {
    if (event.code in keys) keys[event.code] = 1;
}, false);

document.addEventListener('keyup', (event) => {
    if (event.code in keys) keys[event.code] = 0;
}, false);

const LegendContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0.1em;
    flex-wrap: wrap;
    align-self: flex-start;
`;

export class Leaderboard extends React.Component {
    constructor(props) {
        super(props);

        const subcategories = this.getSubcategories();


        console.log(this.generateFilterUniqsStatus(subcategories))

        this.state = {
            subcategories: subcategories,
            subcategory_selections: Object.keys(subcategories).map(e => subcategories[e][0]),
            show_all: true,
            legend_status: legend.reduce((o, l) => Object.assign(o, { [l["name"]]: _.omit(_.clone(l), ["name"]) }), {}),
            filter_uniqs_status: this.generateFilterUniqsStatus(subcategories),
            other_status: 1,
            obsolete_status: 0,
            invert_status: 0,
            sort: this.props.sort,
            sort_order: this.props.sort_order,
        }
    }

    generateSubcatFilterStatus(subcategories) {
        return Object.keys(subcategories).reduce((prev, cur) => {
            prev[cur] = subcategories[cur].reduce((p, c) => {
                p[c] = 1;
                return p;
            }, {})
            return prev;
        }, {});
    }

    generateFilterUniqsStatus(subcategories) {
        let fus = filter_uniqs_list.reduce((prevObj, curFilter) => {
            prevObj[curFilter] = this.getUniques(curFilter)
                .reduce((prev, cur) => {
                    prev[cur] = !(_.isEmpty(prev)) && curFilter == "category" ? 0 : 1;
                    return prev;
                }, {});
            return prevObj;
        }, {});
        let sfs = Object.keys(subcategories).reduce((prev, cur) => {
            prev[cur] = subcategories[cur].reduce((p, c) => {
                p[c] = 1;
                return p;
            }, {})
            return prev;
        }, {});


        fus = _.assign(_.clone(fus), sfs);

        return fus;
    }

    getUniques(column) {
        return [...new Set(this.props.runs.map(r => r[column]))]
    }

    getSubcategories() {
        // const subcategories_unfiltered = this.props.runs
        //     .map(r => {
        //         let json = JSON.parse(r["subcategory"]);
        //         return json.map(s => s.value);
        //     })

        const subcategories_unfiltered = this.props.runs
            .map(r => {
                let json = JSON.parse(r["subcategory"]);
                return json.reduce((prev, cur) => {
                    prev[cur.name] = cur.value;
                    return prev;
                }, {});
            })


        let subcategories = {};
        //console.log(subcategories_unfiltered)
        //console.log(Object.keys(subcategories_unfiltered[0]) !== undefined)

        if (Object.keys(subcategories_unfiltered[0]) !== undefined) {
            subcategories = Object.keys(subcategories_unfiltered[0]).reduce((prev, cur) => {
                prev[cur] = [...new Set(subcategories_unfiltered.map(s => s[cur]))].filter(s => s != undefined)
                return prev;
            }, {})
            // for (var i = 0; i < Object.keys(subcategories_unfiltered[0]).length; i++) {
            //     subcategories.push([...new Set(subcategories_unfiltered.map(s => s[i].value))].filter(s => s != undefined));
            // }
        }

        return subcategories;
    }

    updateData() {
        const subcategories = this.getSubcategories();

        this.setState({
            subcategories: subcategories,
            subcategory_selections: Object.keys(subcategories).map(e => subcategories[e][0]),
            filter_uniqs_status: this.generateFilterUniqsStatus(subcategories),
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
        let name = e.target.dataset["name"];

        if (Object.keys(this.state.filter_uniqs_status).includes(type)) {
            let fus = _.clone(this.state.filter_uniqs_status);
            fus[type][name] = !fus[type][name];

            if (keys["KeyA"]) {
                Object.keys(fus[type]).forEach(e => {
                    fus[type][e] = 1;
                });
            }

            if (keys["KeyS"]) {
                Object.keys(fus[type]).forEach(e => {
                    fus[type][e] = 0;
                });
                fus[type][name] = !fus[type][name];
            }

            this.setState({ filter_uniqs_status: fus });
            return;
        }

        switch (type) {
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

    render() {
        const seen = new Set();
        let runs_filtered = this.props.runs
            .filter((r) => {
                if (this.state.show_all) return true;
                return _.isEqual(JSON.parse(r["subcategory"]).map(s => s.value), this.state.subcategory_selections)
            })

        let legend_filter = _.overEvery(Object.keys(this.state.legend_status).map(k => {
            if (!this.state.legend_status[k]["filter"]) {
                return this.state.legend_status[k]["invert"] ? r => r[k] : r => !r[k]
            }
        }));

        let uniqs_filters = Object.keys(this.state.filter_uniqs_status).map((type, i) => {
            return _.overEvery(Object.keys(this.state.filter_uniqs_status[type]).map((k, i) => {
                if (!this.state.filter_uniqs_status[type][k]) {
                    if (filter_uniqs_list.includes(type)) {
                        return r => !(r[type] == k);
                    }
                    else {
                        return r => {
                            let json = JSON.parse(r["subcategory"]);
                            return !(json.find(e => e.name == type).value == k);
                        }
                    }
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
                <div id="test" style={{ display: "grid", justifyContent: "center", alignItems: "center", alignContent: "center" }}>
                    <div style={{ border: "1px dotted grey", borderRadius: "10px", padding: "0.1em", margin: "0.5em" }}>
                        <LegendContainer>
                            <Legend type="invert" name={"invert filters"} checked={this.state.invert_status} handleChangeFilter={this.handleChangeFilter.bind(this)} />
                            {this.props.mode === "normal" && <Legend type="obsolete" name={"obsolete runs"} checked={this.state.obsolete_status} handleChangeFilter={this.handleChangeFilter.bind(this)} />}
                        </LegendContainer>
                        <LegendContainer>
                            {Object.keys(this.state.filter_uniqs_status["category"]).map((k, i) => {
                                return <Legend type="category" name={k} checked={this.state.filter_uniqs_status["category"][k]} handleChangeFilter={this.handleChangeFilter.bind(this)} key={i} />
                            })}
                        </LegendContainer>
                        <LegendContainer>
                            {Object.keys(this.state.filter_uniqs_status).map((type, i) => {
                                if (type == "category") return;
                                return Object.keys(this.state.filter_uniqs_status[type]).map((k, i) => {
                                    return <Legend type={type} name={k} checked={this.state.filter_uniqs_status[type][k]} handleChangeFilter={this.handleChangeFilter.bind(this)} key={i} />
                                })
                            })}
                        </LegendContainer>
                        <LegendContainer>
                            {Object.keys(this.state.legend_status).map((k, i) => {
                                return <Legend name={k} checked={this.state.legend_status[k]["filter"]} l={this.state.legend_status[k]} handleChangeFilter={this.handleChangeFilter.bind(this)} key={i} />
                            })}
                            <Legend type="other" name={"other"} checked={this.state.other_status} handleChangeFilter={this.handleChangeFilter.bind(this)} />
                        </LegendContainer>
                    </div>
                </div >
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
                                    case "region":
                                    case "realtime":
                                    case "gametime":
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
