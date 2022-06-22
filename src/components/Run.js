var React = require('react');
import legend from '../assets/json/legend.json5';
import styled, { css } from 'styled-components'
import { LBTableRow, LBTableData } from './LeaderboardTable'

function format_time(time_str) {
    if (time_str.indexOf(".") > -1) {
        const time = _.replace(_.clone(time_str), ".", ":")
        const ret = time.split(":").reverse().reduce((prev, cur, i) => {
            switch (i) {
                case 0:
                    return cur.padEnd(3, "0") + "ms" + prev
                case 1:
                    return cur + "s " + prev
                case 2:
                    return cur + "m " + prev
                case 3:
                    return cur + "h " + prev
                default:
                    return
            }
        }, "");
        //console.log(ret);
        return ret;
    }
    else {
        const ret = time_str.split(":").reverse().reduce((prev, cur, i) => {
            switch (i) {
                case 0:
                    return cur + "s " + prev
                case 1:
                    return cur + "m " + prev
                case 2:
                    return cur + "h " + prev
                default:
                    return
            }
        }, "");
        //console.log(ret);
        return ret;
    }
}

export class Run extends React.Component {
    render() {
        let r = this.props.r;

        return <LBTableRow key={this.props.i} data={_.pick(_.clone(r), legend.map(l => l["name"]))}>
            {Object.keys(r).map((key, index) => {
                if (legend.map(l => "drawcol" in l  && l["drawcol"] ? "" : l["name"]).includes(key)) return;
                const data = r[key];
                switch (key) {
                    case "hash":
                    case "id":
                    case "game":
                    case "subcategory":
                    case "region":
                    case "realtime":
                    case "gametime":
                    case "examiner":
                    case "reason":
                        return
                    case "player":
                        return <LBTableData key={index}>({this.props.i + 1}) {data}</LBTableData>
                    case "platform":
                        return <LBTableData key={index} col={key}>
                            {<img className="flag" title={r["region"]} src={`../assets/images/${_.head(r["region"].split(" / "))}.png`}/>}
                            {data}
                            {r["emulated"] ? <sup> EMU</sup> : <></>}
                        </LBTableData>
                    case "link":
                        return (
                            <LBTableData key={index} col={key}>
                                {data.split(", ").map((e, i) => e ? <a key={i} href={e}>[{i + 1}]</a> : "")}
                            </LBTableData>
                        )
                    case "time":
                        return (
                            <LBTableData key={index}>
                                <button key={index} className="button" onClick={() => navigator.clipboard.writeText(r["hash"])}>
                                    {format_time(new Date(data * 1000).toISOString().substring(11, 19).replace(/^0(?:0:0?)?/, '') 
                                        + (data.toString().split(".")[1] ? "." + data.toString().split(".")[1] : ""))}
                                </button>
                            </LBTableData>
                        )
                    case "comment":
                        const newlines = data ? "\n\n" : "";
                        return <LBTableData key={index} col={key}>{data}
                            {r["reason"] ? newlines + "-----\n" + r["reason"] : ""}
                            {newlines + "examiner: " + r["examiner"]}
                            </LBTableData>
                    default:
                        return <LBTableData key={index} col={key}>{data}</LBTableData>
                }
            })}
        </LBTableRow>
    }
}