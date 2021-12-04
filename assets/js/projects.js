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
    imgPath;
    infoLink;
    playLink;
    downloadLink;

    constructor(title, tags, titleTags, details, imgPath, infoLink, playLink, downloadLink) {
        this.title = title;
        this.tags = tags;
        this.titleTags = titleTags;
        this.details = details;
        this.imgPath = imgPath;
        this.infoLink = infoLink;
        this.playLink = playLink;
        this.downloadLink = downloadLink;
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
function initAll() {
    let p_CHG = new Project("Changeling");
    p_CHG.tags = [{ name: "Unreal Engine 4", type: "engine" }, { name: "UI/UX Design", type: "design" }, { name: "Perforce", type: "source_control" }, { name: "Level Design", type: "design" }, { name: "Documentation", type: "documentation" }];
    p_CHG.titleTags = [{ type: "Co-op/Internship" }];
    p_CHG.details = "3D VR Mystery Game\n\nConcepted and completed a working prototype of one of several major levels from scratch alongside 3 other designers— which was but one team amongst 20+ developers, artists, and audio engineers.";
    p_CHG.imgPath = "assets/images/CHG.mp4";
    p_CHG.infoLink = "https://changelingvr.com";
    p_CHG.downloadLink = "https://drive.google.com/uc?export=download&confirm=vHz-&id=1w2UEVYL7vYth15NmXheoG46dfrbP4JVt";

    let p_II = new Project("Data Analysis: Income Inequality");
    p_II.tags = [{ name: "Python", type: "programming" }, { name: "Unity Engine", type: "engine" }, { name: "C#", type: "programming" }, { name: "Mapbox", type: "tool" }];
    p_II.titleTags = [{ type: "Personal Project" }];
    p_II.details = "Unity Application\n\nParsed GeoJSON data correlated with multiple income inequality factors. Visualized results chronologically using Unity tools."
    p_II.imgPath = "assets/images/II.mp4";

    let p_GSG = new Project("Greg, Son of Greg");
    p_GSG.tags = [{ name: "Unity Engine", type: "engine" }, { name: "C#", type: "programming" }, { name: "UI/UX Design", type: "design" }, { name: "Documentation", type: "documentation" }, { name: "Procedural Generation", type: "programming" }];
    p_GSG.titleTags = [{ type: "Personal Project" }];
    p_GSG.details = "Rogue-Like Dungeon-Crawler\n\nTackle procedurally generated dungeons where death is a means of progression as you pass on skills to your next of kin.";
    p_GSG.imgPath = "assets/images/GSG.mp4";

    activeProjects = [];
    activeProjects.push(p_CHG, p_II, p_GSG);

    activeProjects.forEach(p => { p.sortTagsByType(); });
    allProjects = activeProjects.slice();

    return activeProjects;
}

function initByTag(tagName) {
    activeProjects = [];
    allProjects.forEach(p => {
        for (let i = 0; i < p.tags.length; i++) {
            if (p.tags[i].name == tagName) {
                activeProjects.push(p);
                break;
            }
        }
    });
}


//Styling
function getTagColor(tagType) {
    const tagColor = {
        programming: "#ff652f",
        design: "#e8c100",
        engine: "#5479ff",
        source_control: "#14a76c",
        tool: "#856fff",
        documentation: "#ba261e",
    };

    return tagColor[tagType];
}

export { Project, getActiveProjects, getAllProjects, initAll, initByTag, getTagColor };