var React = require('react');
import { Leaderboard } from './Leaderboard'
import db from '../db.js'

const games_srcom = db.srcom.exec("SELECT tbl_name from sqlite_master WHERE type = 'table'")[0]["values"];
const games_extras = db.extras.exec("SELECT tbl_name from sqlite_master WHERE type = 'table'")[0]["values"];
let columns = db.srcom.exec(`SELECT * FROM ${games_srcom[0]}`)[0]["columns"];

export class Boards extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        game: games_srcom[0],
        columns: db.srcom.exec(`SELECT * FROM ${games_srcom[0]}`)[0]["columns"],
        runs: db.srcom.exec(`SELECT * FROM ${games_srcom[0]}`)[0]["values"]
            .concat(games_extras.find(elem => elem == games_srcom[0][0]) ? db.extras.exec(`SELECT * FROM ${games_srcom[0]}`)[0]["values"] : [])
            .sort((a, b) => a[columns.indexOf("time")] - b[columns.indexOf("time")]),
    }

    handleChange(e) {
        this.setState({
            game: e.target.value,
            columns: db.srcom.exec(`SELECT * FROM ${e.target.value}`)[0]["columns"],
            runs: db.srcom.exec(`SELECT * FROM ${e.target.value}`)[0]["values"]
                .concat(games_extras.find(elem => elem == e.target.value) ? db.extras.exec(`SELECT * FROM ${e.target.value}`)[0]["values"] : [])
                .sort((a, b) => a[columns.indexOf("time")] - b[columns.indexOf("time")]),
        })
    }

    render() {
        return (
            <div>
                <h5>Select game:</h5>
                <select onChange={this.handleChange.bind(this)}>
                    {games_srcom.map((g, i) => (
                        <option key={i} value={g}>{g}</option>
                    ))}
                </select>
                <Leaderboard game={this.state.game}
                    columns={this.state.columns}
                    runs={this.state.runs}
                    categories={[...new Set(this.state.runs.map(r => r[this.state.columns.indexOf("category")]))]
                        .sort((a, b) => {
                            if (a.charAt(0).match(/[a-zA-Z]/i) && b.charAt(0).match(/[a-zA-Z]/i)) {
                                return a.localeCompare(b)
                            }
                            else return b.localeCompare(a)
                        })
                    }
                />
            </div>
        )
    }
}