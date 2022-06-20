let sortables = {
    "time": {
        func: (a, b) => a["time"] - b["time"],
    },
    "date": {
        func: (a, b) => new Date(a["date"]) - new Date(b["date"]),
    }
}

export default sortables;