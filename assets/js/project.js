import * as utils from "./utils.js";

const tagColor = {
    programming: "#A5402D",
    design: "#44086E",
    engine: "#3772FF",
    source_control: "#7BAE37",
    tool: "#F7B32B",
    documentation: "#02040F",
};

class Project {
    title;
    tags;
    titleTags;
    details;
    detailsTitle;
    imgPath;
    infoLink;
    playLink;
    downloadLink;
    htmlBlock;

    constructor(title, tags = [], titleTags = [], details, detailsTitle, imgPath, infoLink, playLink, downloadLink) {
        this.title = title;
        this.tags = tags;
        this.titleTags = titleTags;
        this.details = details;
        this.detailsTitle = detailsTitle;
        this.imgPath = imgPath;
        this.infoLink = infoLink;
        this.playLink = playLink;
        this.downloadLink = downloadLink;
        this.htmlBlock = null
    }

    sortTagsByType() {
        this.tags.sort(function(a, b) {
            if (a.type < b.type) return -1;
            if (a.type > b.type) return 1;
            return 0;
        });
    }
}

function init() {
    let p1 = new Project("Changeling");
    p1.tags = [
        { name: "Unreal Engine 4", type: "engine" },
        { name: "UI/UX Design", type: "design" },
        { name: "Perforce", type: "source_control" },
        { name: "Level Design", type: "design" },
        { name: "Documentation", type: "documentation" },
    ].sort();
    p1.titleTags = [
        { name: "Professional" },
        { name: "Co-op/Internship" },
    ].sort();
    p1.detailsTitle = "3D VR Mystery Game";
    p1.details = "Concepted and completed a working prototype of one of several major levels from scratch alongside 3 other designers— which was but one team amongst 20+ developers, artists, and audio engineers.";
    p1.imgPath = "assets/images/CHG.mp4";
    p1.infoLink = "https://changelingvr.com";
    p1.downloadLink = "https://drive.google.com/uc?export=download&confirm=vHz-&id=1w2UEVYL7vYth15NmXheoG46dfrbP4JVt";

    let p2 = new Project("Data Analysis: Income Inequality");
    p2.tags = [
        { name: "Python", type: "programming" },
        { name: "Unity Engine", type: "engine" },
        { name: "C#", type: "programming" },
        { name: "Mapbox", type: "tool" },
    ].sort();
    p2.titleTags = [
        { name: "Personal", }
    ].sort();
    p2.detailsTitle = "Unity Application";
    p2.details = "Parsed GeoJSON data correlated with multiple income inequality factors. Visualized results chronologically using Unity tools."
    p2.imgPath = "assets/images/II.mp4";

    let p3 = new Project("Greg, Son of Greg");
    p3.tags = [
        { name: "Unity Engine", type: "engine" },
        { name: "C#", type: "programming" },
        { name: "UI/UX Design", type: "design" },
        { name: "Documentation", type: "documentation" },
        { name: "Procedural Generation", type: "programming" },
    ].sort();
    p3.titleTags = [
        { name: "Personal", },
    ].sort();
    p3.detailsTitle = "Rogue-Like Dungeon-Crawler";
    p3.details = "Tackle procedurally generated dungeons where death is a means of progression as you pass on skills to your next of kin.";
    p3.imgPath = "assets/images/GSG.mp4";

    // Push all active projects, then sort by type
    let projectList = [p1, p2, p3];
    projectList.forEach(p => { p.sortTagsByType(); });

    return projectList;
}

/**
 *
 * @param projects List of projects to check.
 * @param tagName Project tag to check.
 * @returns {*[]} List of projects with this tag.
 */
function getByTag(projects, tagName){
    let projectList = [];
    projects.forEach(p => {
        for (let i = 0; i < p.tags.length; i++) {
            if (p.tags[i].name === tagName) {
                projectList.push(p);
                break;
            }
        }
    });
    return projectList;
}

/**
 *
 * @param projects List of projects to check.
 * @param tagName Project title tag to check.
 * @returns {*[]} List of projects with this title tag.
 */
function getByTitleTag(projects, tagName) {
    let projectList = [];
    projects.forEach(p => {
        for (let i = 0; i < p.titleTags.length; i++) {
            if (p.titleTags[i].name === tagName) {
                projectList.push(p);
                break;
            }
        }
    });
    return projectList;
}

/**
 *
 * @param tagType Project tag to check.
 * @returns {*|string} Hex color from the table.
 */
function getTagColor(tagType) {
    return (tagType in tagColor) ? tagColor[tagType] : "#FFFFFF";
}

export { Project, init, getByTag, getByTitleTag, getTagColor };