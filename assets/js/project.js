import * as utils from "./utils.js";

let allProjects = [];
let activeProjects = [];

function getActiveProjects() {
    return activeProjects;
}

function getAllProjects() {
    return allProjects;
}

//Class Definitions
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

//Main
function init() {
    let p_CHG = new Project("Changeling");
    p_CHG.tags.push({ name: "Unreal Engine 4", type: "engine" });
    p_CHG.tags.push({ name: "UI/UX Design", type: "design" });
    p_CHG.tags.push({ name: "Perforce", type: "source_control" });
    p_CHG.tags.push({ name: "Level Design", type: "design" });
    p_CHG.tags.push({ name: "Documentation", type: "documentation" });
    p_CHG.titleTags = [{ name: "Professional" }, { name: "Co-op/Internship" }, ];
    p_CHG.detailsTitle = "3D VR Mystery Game";
    p_CHG.details = "Concepted and completed a working prototype of one of several major levels from scratch alongside 3 other designers— which was but one team amongst 20+ developers, artists, and audio engineers.";
    p_CHG.imgPath = "assets/images/CHG.mp4";
    p_CHG.infoLink = "https://changelingvr.com";
    p_CHG.downloadLink = "https://drive.google.com/uc?export=download&confirm=vHz-&id=1w2UEVYL7vYth15NmXheoG46dfrbP4JVt";

    let p_II = new Project("Data Analysis: Income Inequality");
    p_II.tags.push({ name: "Python", type: "programming" });
    p_II.tags.push({ name: "Unity Engine", type: "engine" });
    p_II.tags.push({ name: "C#", type: "programming" });
    p_II.tags.push({ name: "Mapbox", type: "tool" });
    p_II.titleTags = [{ name: "Personal", }];
    p_II.detailsTitle = "Unity Application";
    p_II.details = "Parsed GeoJSON data correlated with multiple income inequality factors. Visualized results chronologically using Unity tools."
    p_II.imgPath = "assets/images/II.mp4";

    let p_GSG = new Project("Greg, Son of Greg");
    p_GSG.tags.push({ name: "Unity Engine", type: "engine" });
    p_GSG.tags.push({ name: "C#", type: "programming" });
    p_GSG.tags.push({ name: "UI/UX Design", type: "design" });
    p_GSG.tags.push({ name: "Documentation", type: "documentation" });
    p_GSG.tags.push({ name: "Procedural Generation", type: "programming" });
    p_GSG.titleTags = [{ name: "Personal", }, ];
    p_GSG.detailsTitle = "Rogue-Like Dungeon-Crawler";
    p_GSG.details = "Tackle procedurally generated dungeons where death is a means of progression as you pass on skills to your next of kin.";
    p_GSG.imgPath = "assets/images/GSG.mp4";

    // Push all active projects, then sort by type
    activeProjects = [];
    activeProjects.push(p_CHG, p_II, p_GSG);
    activeProjects.forEach(p => { p.sortTagsByType(); });
    allProjects = activeProjects.slice();

    return activeProjects;
}

function initAll(){
    activeProjects = allProjects;
}

function initByTag(tagName) {
    activeProjects = [];
    allProjects.forEach(p => {
        for (let i = 0; i < p.tags.length; i++) {
            if (p.tags[i].name === tagName) {
                activeProjects.push(p);
                break;
            }
        }
    });
}

function initByTitleTag(tagName) {
    activeProjects = [];
    allProjects.forEach(p => {
        for (let i = 0; i < p.titleTags.length; i++) {
            if (p.titleTags[i].name === tagName) {
                activeProjects.push(p);
                break;
            }
        }
    });
}


//Styling
function getTagColor(tagType) {
    const tagColor = {
        programming: "#A5402D",
        design: "#44086E",
        engine: "#3772FF",
        source_control: "#7BAE37",
        tool: "#F7B32B",
        documentation: "#02040F",
    };

    return tagColor[tagType];
}

export { Project, getActiveProjects, getAllProjects, init, initAll, initByTag, initByTitleTag, getTagColor };