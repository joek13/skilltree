import "../lib/d3.js";
import { courses, coreCourses } from "./data.js";

// unit size
const UNIT = 1;

// spacing between course levels
const INTER_LEVEL_SPACING = 200 * UNIT;
// spacing between courses of different levels
const INTRA_LEVEL_SPACING = 100 * UNIT;

// radius of individual course nodes
const NODE_RADIUS = 30 * UNIT;

// color for core courses
const CORE_COURSE_COLOR = "green";

// color for core courses that are substitutable
const CORE_ONEOF_COURSE_COLOR = "yellow";

// returns the color a given node should be
const getCourseColor = (course) => {
    // core courses are green
    if (coreCourses.indexOf(course.id) !== -1) {
        return CORE_COURSE_COLOR;
    }

    return "#000000";
}

document.addEventListener('DOMContentLoaded', (_) => {
    // initialize zoom behavior
    const zoom = d3.zoom();

    // root svg
    const svg = d3.select("body")
        .append("svg")
        .call(zoom); // add svg behavior

    // root svg <g> element, will be transformed by the zoom
    const root = svg.append("g")
        // add .chart class
        .classed("chart", true)

    zoom.on("zoom", (e) => {
        // update the root g.chart's transform to reflect zoom
        root.attr("transform", e.transform);
    });

    // compute initial window size
    const initialWidth = window.innerWidth;
    const initialHeight = window.innerHeight;

    // use window size to zoom with center (0,0)
    svg.call(zoom.translateTo, -initialWidth / 2, -initialHeight / 2);

    // create g.course svg element for each course
    const courseGroups = root.selectAll("g.course")
        .data(courses)
        .enter()
        .append("g").classed("course", true) // add .course class so css styles affect it
        // position it according to the value of the course's position attribute in data.js
        .attr("transform", d => `translate(${d.position[1] * INTRA_LEVEL_SPACING} ${d.position[0] * INTER_LEVEL_SPACING})`);

    // draw the circle
    courseGroups.append("circle")
        .attr("r", NODE_RADIUS)
        .style("fill", d => getCourseColor(d))
        .style("stroke", "#000000");

    // draw text labels
    courseGroups.append("text")
        // strip "cs" from course id
        .text(d => d.id.substring(2))
        .attr("text-anchor", "middle") // center text horizontally in circle
        .attr("dominant-baseline", "central") // center text vertically in circle
        .style("fill", "white"); // use white text

    // create links from course data
    
});
