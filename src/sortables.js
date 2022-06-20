let sortables = {
    "time": {
        func: (a, b) => a["time"] - b["time"],
    },
    "date": {
        func: (a, b) => new Date(a["date"]) - new Date(b["date"]),
    },
    "player": {
        func: (a, b) => b["player"].localeCompare(a["player"]),
    },
    "examiner": {
        func: (a, b) => b["examiner"].localeCompare(a["examiner"]),
    },
}

export default sortables;