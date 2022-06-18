var React = require('react');
import styled, { css, createGlobalStyle } from 'styled-components'
import { Leaderboard } from './Leaderboard'
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import db from '../db.js'
import overrides from '../assets/json/overrides.json5';
import _ from 'lodash';

// I assure you, dear reader, ignoring the benefits of styled and simply using an external file is necessary
import '../boards.scss'

const games_srcom = db.srcom.exec("SELECT tbl_name from sqlite_master WHERE type = 'table'")[0]["values"];
const games_extras = db.extras.exec("SELECT tbl_name from sqlite_master WHERE type = 'table'")[0]["values"];

const Content = styled.div`
    text-align:center;
`;

const GlobalStyle = createGlobalStyle``

export class Boards extends React.Component {
    constructor(props) {
        super(props);

        const data = this.getData();

        this.state = {
            game: data.game,
            columns: data.columns,
            runs: data.runs,
        }
    }

    getData(e) {
        const game = e ? e.target.value : games_srcom[0][0];
        const columns = db.srcom.exec(`SELECT * FROM ${game}`)[0]["columns"];
        const runs = db.srcom.exec(`SELECT * FROM ${game}`)[0]["values"]
            .concat(games_extras.find(elem => elem == game) ? db.extras.exec(`SELECT * FROM ${game}`)[0]["values"] : [])
            .map(r => {
                return Object.fromEntries(r.map((e, i) => [columns[i], e]));
            })
            .map(r => {
                const picked_hash = _.assign({ "game": game }, (_.pick(_.clone(r), ['category', 'player', 'time', 'date'])));
                const hash = Base64.stringify(sha256(JSON.stringify(picked_hash)));
                return _.assign(_.assign(_.clone(r), overrides[hash]), { "hash": hash });
            })
            .sort(this.props.sort)

        return {
            game: game,
            columns: columns,
            runs: runs,
        }
    }

    handleChange(e) {
        const data = this.getData(e);

        this.setState({
            game: data.game,
            columns: data.columns,
            runs: data.runs,
        })
    }

    render() {
        return (
            <div>
                <h2>Select game:</h2>
                <select onChange={this.handleChange.bind(this)}>
                    {games_srcom.map((g, i) => (
                        <option key={i} value={g}>{g}</option>
                    ))}
                </select>
                <Leaderboard game={this.state.game}
                    columns={Object.keys(this.state.runs[0])}
                    runs={this.state.runs}
                    categories={[...new Set(this.state.runs.map(r => r["category"]))]
                        .sort((a, b) => {
                            if (a.charAt(0).match(/[a-zA-Z]/i) && b.charAt(0).match(/[a-zA-Z]/i)) {
                                return a.localeCompare(b)
                            }
                            else return b.localeCompare(a)
                        })
                    }
                    mode={this.props.mode}
                />
            </div>
        )
    }
}