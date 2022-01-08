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
const edges = [];

// for each course,
for (const course of courses.values()) {
    // iterate through its prereqs.
    for (const prereqId of course.prerequisites) {
        // add this dependence relationship to the list of links.
        edges.push({
            "source": prereqId,
            "target": course.id
        });
    }
}

// unit size
const UNIT = 1;

// spacing between course levels
const INTER_LEVEL_SPACING = 200 * UNIT;
// spacing between courses of different levels
const INTRA_LEVEL_SPACING = 100 * UNIT;

// radius of individual course nodes
const NODE_RADIUS = 35 * UNIT;

// color for core courses
const CORE_COURSE_COLOR = "#F786AA";
// color for core courses that are substitutable
const CORE_ONEOF_COURSE_COLOR = "#EA9010";

const OTHER_COURSE_COLOR = "#04A777";

// returns the color a given node should be
const getCourseColor = (course) => {
    // core courses are green
    if (coreCourses.indexOf(course.id) !== -1) {
        return CORE_COURSE_COLOR;
    } else if (multiCoreCourses.indexOf(course.id) !== -1) {
        return CORE_ONEOF_COURSE_COLOR;
    }

    return OTHER_COURSE_COLOR;
}

// scales position from data.js to absolute coordinates
const scalePosition = (position) => {
    // takes position in [row, col]
    // and returns absolute [x, y]

    return [position[1] * INTRA_LEVEL_SPACING, position[0] * INTER_LEVEL_SPACING];
}

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

    // root svg
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

    root.selectAll("path.link")
        .data(edges)
        .join("path")
        .classed("link", true) // adds .link class to each path
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
        .append("g").classed("course", true) // add .course class so css styles affect it
        // position it according to the value of the course's position attribute in data.js
        .attr("transform", d => `translate(${scalePosition(d.position).join(" ")})`) // scalePosition returns [x,y] so joining with space yields `x y`
        .attr("id", course => course.id)
        .on("click", handleCourseNodeClicked);


    // draw the circle
    courseGroups.append("circle")
        .attr("r", NODE_RADIUS)
        .style("fill", d => getCourseColor(d));
    // stroke style managed in CSS via classes

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
