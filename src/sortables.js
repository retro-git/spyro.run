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
        func: (a, b) => b["examiner"] && a["examiner"] ? b["examiner"].localeCompare(a["examiner"]) : a["examiner"].localeCompare(b["examiner"]),
    },
    "category": {
        func: (a, b) => b["category"].localeCompare(a["category"]),
    },
}

export default sortables;