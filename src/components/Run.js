var React = require('react');
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import overrides from '../assets/overrides.json5';
import legend from '../assets/legend.json5';
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
                        return
                    case "player":
                        return <LBTableData key={index}>({this.props.i + 1}) {data}</LBTableData>
                    case "emulated":
                        return <LBTableData key={index}>{data ? "Yes" : "No"}</LBTableData>
                    case "link":
                        return (
                            <LBTableData key={index} col={key}>
                                {data.split(", ").map((e, i) => <><a href={e}>[{i+1}]</a></>)}
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