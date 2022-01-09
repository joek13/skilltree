import "../lib/d3.js";
import { courses, coreCourses, multiCoreCourses } from "./data.js";

// data preprocessing:

// add 'id' field to each of the course objects
for (const [courseId, obj] of courses) {
    courses.set(courseId, {
        "id": courseId, // add "id" field with the key from the key-value pair
        ...obj // leave the rest of the fields untouched
    })
}

// create list of links from course data
const prereqEdges = [];
const coreqEdges = []; // corequisites: i.e, prerequisite courses that can be taken concurrently

// for each course,
for (const course of courses.values()) {
    // iterate through its prereqs.
    for (const prereqId of course.prerequisites) {
        // add this dependence relationship to the list of links.
        prereqEdges.push({
            "source": prereqId,
            "target": course.id
        });
    }
    if (!!course.corequisites) {
        // any corequisites?
        for (const coreqId of course.corequisites) {
            coreqEdges.push({
                "source": coreqId,
                "target": course.id
            })
        }
    }
}

// variables for positioning

// unit size
const UNIT = 1;

// spacing between course levels
const INTER_LEVEL_SPACING = 200 * UNIT;
// spacing between courses of different levels
const INTRA_LEVEL_SPACING = 100 * UNIT;

// radius of individual course nodes
const NODE_RADIUS = 35 * UNIT;

// returns the css classes that should be applid to a course node
// based on the course id
const getNodeClasses = (courseId) => {
    if (coreCourses.indexOf(courseId) !== -1) {
        return ["core"];
    } else if (multiCoreCourses.indexOf(courseId) !== -1) {
        return ["multiCore"];
    } else {
        return [];
    }
}

// scales position from data.js to absolute coordinates
const scalePosition = (position) => {
    // takes position in [row, col]
    // and returns absolute [x, y]

    return [position[1] * INTRA_LEVEL_SPACING, position[0] * INTER_LEVEL_SPACING];
}

// computes display name for a course.
const displayName = (course) => {
    // has defined display name? return that.
    if (!!course.display)
        return course.display;

    // otherwise, just strip off the mnemonic
    if (course.id.startsWith("cs")) {
        return course.id.substring(2);
    } else {
        return course.id;
    }
}

// gets selected course based on url hash in window.location
const getSelectedCourse = () => {
    if (window.location.hash.startsWith("#")) {
        // selected course in url hash
        const courseId = window.location.hash.substring(1); // cut off the #
        const course = courses.get(courseId);

        if (!!course) {
            return course;
        } else {
            return null;
        }
    }

    return null;
}


// sets the selected course in the url hash,
// updates css classes accordingly.
const setSelectedCourse = (courseId) => {
    // remove .selected class from any existing object
    d3.selectAll(".course.selected").classed("selected", false);

    if (!!courseId) {
        // update class on the newly selected object
        d3.select("#" + courseId).classed("selected", true)

        // update window hash
        window.location.hash = "#" + courseId;
    } else {
        // clear selection
        window.location.hash = "";
    }
}


document.addEventListener('DOMContentLoaded', (_) => {
    // initialize zoom behavior
    const zoom = d3.zoom();

    // root svg tag
    const svg = d3.select("#vizContainer")
        .append("svg")
        .call(zoom) // add svg behavior
        .on("dblclick.zoom", null); // deregister doubleclick handler

    // root svg <g> element, will be transformed by the zoom
    const root = svg.append("g")
        // add .chart class
        .classed("chart", true)

    // register zoom handler
    zoom.on("zoom", (e) => {
        // update the root g.chart's transform to reflect zoom
        root.attr("transform", e.transform);
    });



    // link generator
    const linkGenerator = d3.linkVertical()
        // looks up and scales position for source...
        .source(d => scalePosition(courses.get(d.source).position))
        // ...and does same for target
        .target(d => scalePosition(courses.get(d.target).position));

    // creates the links for all prereqs
    root.selectAll("path.link.prerequisite")
        .data(prereqEdges)
        .join("path")
        .classed("link prerequisite", true) // adds .link class to each path
        .attr("d", linkGenerator)
        .attr("fill", "none")
        .attr("stroke", "black");

    // creates the links for all coreqs
    root.selectAll("path.link.corequisite")
        .data(coreqEdges)
        .join("path")
        .classed("link corequisite", true) // adds .link class to each path
        .attr("d", linkGenerator)
        .attr("fill", "none")
        .attr("stroke", "black");

    // hadnle when the user clicks a course node.
    const handleCourseNodeClicked = (e, course) => {
        setSelectedCourse(course.id);

        // scale the position
        const scaledPosition = scalePosition(course.position);

        // zoom to center this course 
        svg.transition()
            .duration(500)
            .call(zoom.translateTo, scaledPosition[0], scaledPosition[1]);
    };

    // create g.course svg element for each course
    const courseGroups = root.selectAll("g.course")
        .data(courses.values())
        .enter()
        .append("g")
        // needs to be done before we add course class, as it will wipe existing classes on the object:
        .attr("class", d => getNodeClasses(d.id).join(" ")) // set classes based on course info
        .classed("course", true) // add .course class so css styles affect it
        // position it according to the value of the course's position attribute in data.js
        .attr("transform", d => `translate(${scalePosition(d.position).join(" ")})`) // scalePosition returns [x,y] so joining with space yields `x y`
        .attr("id", course => course.id)
        .on("click", handleCourseNodeClicked);


    // draw the circle
    courseGroups.append("circle")
        .attr("r", NODE_RADIUS);
    // fill, stroke style managed in CSS via classes

    // draw text labels
    courseGroups.append("text")
        // strip "cs" from course id
        .text(d => displayName(d))
        .attr("text-anchor", "middle") // center text horizontally in circle
        .attr("dominant-baseline", "central") // center text vertically in circle
        .style("fill", "white"); // use white text

    // zoom to initial location
    svg.node().getBoundingClientRect();

    // check window hash, which contains the currently selected course
    const selectedCourse = getSelectedCourse();

    if (!!selectedCourse) {
        // if a course is selected, make sure we update the css class
        // (if we have just loaded the page, then getSelectedCourse will
        // return the selected course, but it will not yet have the appropriate class)
        setSelectedCourse(selectedCourse.id);
    }

    if (!!selectedCourse) {
        // scale the position
        const scaledPosition = scalePosition(selectedCourse.position);

        // zoom to center this course 
        svg.call(zoom.translateTo, scaledPosition[0], scaledPosition[1]);
    } else {
        // zoom to center (0,0)
        svg.call(zoom.translateTo, 0, 0);
    }
});
