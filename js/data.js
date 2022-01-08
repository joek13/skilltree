export const courses = [
    /*
    {
        "id": "cs11x", // course id: mnemonic + sequence number
        "position": [0, 0], // position: [row, column]
        "prerequisites": [], // any prerequisites
    },
    */
    // level 0
    {
        "id": "cs11x",
        "position": [0, 0],
        "prerequisites": [],
    },
    // level 1
    {
        "id": "cs2110",
        "position": [1, -1],
        "prerequisites": ["cs11x"],
    },
    {
        "id": "cs2102",
        "position": [1, 1],
        "prerequisites": ["cs11x"],
    }
]

export const coreCourses = ["cs11x", "cs2110", "cs2102"];