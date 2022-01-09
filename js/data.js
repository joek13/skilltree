export const courses = new Map([
    /*
    map from course id to course object, where a course object is:
    {
        "id": "cs11x", // course id: mnemonic + sequence number
        "position": [0, 0], // position: [row, column]
        "prerequisites": [], // any prerequisites
        "corequisites": [], // any corequisites (like prerequisites but can be taken concurrently)
    },
    */
    // level 0
    ["cs11x", {
        "position": [0, 0],
        "prerequisites": [],
    }],
    ["cs2330", {
        "position": [0, 2],
        "prerequisites": []
    }],
    // level 1
    ["cs2110", {
        "position": [1, -1],
        "prerequisites": ["cs11x"],
    }],
    ["cs2102", {
        "position": [1, 1],
        "prerequisites": ["cs11x"],
    }],
    // level 2
    ["cs2150", {
        "position": [2, 0],
        "prerequisites": ["cs2102", "cs2110"]
    }],
    ["cs3710", {
        "position": [2, 1],
        "corequisites": ["cs2150"],
        "prerequisites": []
    }],
    ["calc", {
        display: "Calc I",
        "position": [2, 2],
        "prerequisites": []
    }],
    ["cs3102", {
        "position": [2, -2],
        "prerequisites": ["cs2102", "cs2110"]
    }],
    ["cs3205", {
        "position": [2, 5],
        "prerequisites": ["cs2102"]
    }],
    // level 3
    ["cs3240", {
        "position": [3, -1],
        "prerequisites": ["cs2150"]
    }],
    ["cs3330", {
        "position": [3, 0],
        "prerequisites": ["cs2150"]
    }],
    ["cs4102", {
        "display": "Algo",
        "position": [3, 1],
        "prerequisites": ["cs2150", "calc"]
    }],
    ["cs4414", {
        "position": [3, 2],
        "prerequisites": ["cs2150"]
    }],
    ["cs4610", {
        "position": [3, 3],
        "prerequisites": ["cs2150"]
    }]
])

export const coreCourses = ["cs11x", "cs2110", "cs2102", "cs2150", "cs3330", "cs4102"];
export const multiCoreCourses = ["cs3102", "cs3240", "cs4414", "cs4610"];