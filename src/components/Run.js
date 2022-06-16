var React = require('react');
import platform_abbr from '../assets/json/platform_abbr.json5';
import legend from '../assets/json/legend.json5';
import styled, { css } from 'styled-components'
import { LBTableRow, LBTableData } from './LeaderboardTable'

export class Run extends React.Component {
    render() {
        let r = this.props.r;

        return <LBTableRow key={this.props.i} data={_.pick(_.clone(r), legend.map(l => l["name"]))}>
            {Object.keys(r).map((key, index) => {
                if (legend.map(l => l["name"]).includes(key)) return;
                const data = r[key];
                switch (key) {
                    case "hash":
                    case "game":
                    case "category":
                    case "subcategory":
                    case "region":
                    case "emulated":
                        return
                    case "player":
                        return <LBTableData key={index}>({this.props.i + 1}) {data}</LBTableData>
                    case "platform":
                        return <LBTableData key={index} col={key}>
                            {<img class="flag" title={r["region"]} src={`../assets/images/${_.head(r["region"].split(" / "))}.png`}/>}
                            {platform_abbr[data] ? platform_abbr[data] : data}
                            {r["emulated"] ? <sup> EMU</sup> : <></>}
                        </LBTableData>
                    case "link":
                        return (
                            <LBTableData key={index} col={key}>
                                {data.split(", ").map((e, i) => <a href={e}>[{i + 1}]</a>)}
                            </LBTableData>
                        )
                    case "time":
                        return (
                            <LBTableData key={index}>
                                <button key={index} className="button" onClick={() => navigator.clipboard.writeText(r["hash"])}>
                                    {new Date(data * 1000).toISOString().substring(11, 19).replace(/^0(?:0:0?)?/, '')}
                                </button>
                            </LBTableData>
                        )
                    default:
                        return <LBTableData key={index} col={key}>{data}</LBTableData>
                }
            })}
        </LBTableRow>
    }
}