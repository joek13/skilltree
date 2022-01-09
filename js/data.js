export const courses = new Map([
    /*
    map from course id to course object, where a course object is:
    {
        "id": "cs11x", // course id: mnemonic + sequence number
        "position": [0, 0], // position: [row, column]
        "realizations": [], // optional: list of actual course IDs that fulfill this
        "prerequisites": [], // any prerequisites
        "corequisites": [], // any corequisites (like prerequisites but can be taken concurrently)
    },
    */
    // level 0
    ["cs11x", {
        "title": "Introduction to Programming",
        "position": [0, 0],
        "prerequisites": [],
        "realizations": ["cs1110", "cs1111", "cs1112", "cs1113", "cs1120"],
    }],
    ["cs2330", {
        "title": "Digital Logic Design",
        "display": "DLD",
        "position": [0, 2],
        "prerequisites": []
    }],
    // level 1
    ["cs2110", {
        "title": "Software Development Methods",
        "position": [1, -1],
        "prerequisites": ["cs11x"],
    }],
    ["cs2102", {
        "title": "Discrete Mathematics",
        "position": [1, 1],
        "prerequisites": ["cs11x"],
    }],
    // level 2
    ["cs2150", {
        "title": "Program & Data Representation",
        "position": [2, 0],
        "prerequisites": ["cs2102", "cs2110"]
    }],
    ["cs3710", {
        "title": "Introduction to Cybersecurity",
        "position": [2, 1],
        "corequisites": ["cs2150"],
        "prerequisites": []
    }],
    ["calc", {
        "title": "Calculus I (multiple)",
        "display": "Calc I",
        "position": [2, 4],
        "prerequisites": []
    }],
    ["cs3102", {
        "title": "Theory of Computation",
        "position": [2, -2],
        "prerequisites": ["cs2102", "cs2110"]
    }],
    ["cs3205", {
        "title": "HCI in Software Development",
        "display": "HCI",
        "position": [2, 2],
        "prerequisites": ["cs2102"]
    }],
    // level 3
    ["cs3240", {
        "title": "Advanced Software Development Techniques",
        "position": [3, -2],
        "prerequisites": ["cs2150"]
    }],
    ["cs3250", {
        "title": "Software Testing",
        "position": [3, -1],
        "prerequisites": ["cs2150"]
    }],
    ["cs3330", {
        "title": "Computer Architecture",
        "position": [3, 0],
        "prerequisites": ["cs2150"]
    }],
    ["cs4240", {
        "title": "Principles of Software Design",
        "position": [3, 1],
        "prerequisites": ["cs2150"]
    }],
    ["cs4414", {
        "title": "Operating Systems",
        "display": "OS",
        "position": [3, 2],
        "prerequisites": ["cs2150"]
    }],
    ["cs4610", {
        "title": "Programming Languages",
        "position": [3, 3],
        "prerequisites": ["cs2150"]
    }],
    ["cs4102", {
        "title": "Algorithms",
        "display": "Algo",
        "position": [3, 4],
        "prerequisites": ["cs2150", "calc"]
    }],
    // level 4
    ["cs4260", {
        "title": "Internet Scale Applications",
        "display": "ISA",
        "position": [4, -2],
        "prerequisites": ["cs3240"]
    }],
    ["cs4330", {
        "title": "Advanced Computer Architecture",
        "position": [4, 0],
        "prerequisites": ["cs3330"]
    }]
])

export const coreCourses = ["cs11x", "cs2110", "cs2102", "cs2150", "cs3330", "cs4102"];
export const multiCoreCourses = ["cs3102", "cs3240", "cs4414", "cs4610"];