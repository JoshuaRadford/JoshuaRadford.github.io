import * as projects from "./projects.js";
import * as utils from "./utils.js";

//Declarations
let prjs;

//Queries
const prjs_section = document.querySelector(".projects-container");
const scrollUp = document.querySelector("#scroll-up");

function init() {
    prjs = projects.initAll();
    populateProjects();

    //Event Listeners
    scrollUp.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    });

    updateStyling();
}

function updateStyling() {
    //Randomize text color of certain elements
    const elems = [];
    elems.push(Array.from(document.querySelectorAll(".nav-link")));
    elems.push(Array.from(document.querySelectorAll("h2")));
    elems.push(Array.from(document.querySelectorAll("h3")));
    elems.forEach(e => {
        let colors = utils.themeColors.slice();
        e.forEach(n => {
            const rColor = colors[utils.getRandomInt(colors.length)];
            //Validates a 6-digit hex color or CSS color
            n.style.color = (/^#[0-9A-F]{6}$/i.test(rColor) || utils.isColor(rColor)) ? rColor : "#808080";
            colors.splice(colors.indexOf(rColor), 1);
            if (colors.length == 0) colors = utils.themeColors.slice();
        });
    });
}

function populateProjects() {
    prjs_section.innerHTML = "";
    let prjs_prof = document.createElement("div");
    prjs_prof.classList.add("projects-subtype");
    let prjs_pers = document.createElement("div");
    prjs_pers.classList.add("projects-subtype");

    //Check if all projects are showing
    let prjs_seeAll = document.querySelector("#projects-see-all");
    prjs_seeAll.style.display = prjs.length < projects.getAllProjects().length ? "block" : "none";
    prjs_seeAll.addEventListener("click", function() {
        prjs = projects.getAllProjects();
        populateProjects();
    });

    prjs.forEach(p => {
        //Initialize elements
        let prj_card = document.createElement("div");
        let prj_cont = document.createElement("div");
        let prj_vid_block = document.createElement("div");
        let prj_vid = document.createElement("video");
        let prj_vid_source = document.createElement("source");
        let prj_title = document.createElement("h3");
        let prj_det = document.createElement("p");
        let prj_tags = document.createElement("div");
        let prj_title_tags = document.createElement("div");

        prj_card.classList.add("project-card", "dark-back");
        prj_cont.classList.add("project-content");

        //Video preview
        prj_vid.className = "project-preview";
        prj_vid.muted = true;
        prj_vid.loop = true;
        prj_vid.addEventListener("mouseover", function() {
            this.play();
        });
        prj_vid.addEventListener("mouseleave", function() {
            this.pause();
            this.currentTime = 0;
        });

        //Other details
        prj_vid_source.src = p.imgPath;
        prj_vid_source.type = "video/mp4";
        prj_vid_block.classList.add("project-preview-container");
        prj_title.classList.add("project-title");
        prj_title.innerText = p.title;
        prj_det.className = "project-details";
        prj_det.innerText = p.details;

        prj_vid.appendChild(prj_vid_source);
        prj_vid_block.appendChild(prj_vid);
        prj_cont.appendChild(prj_vid_block);

        //Project tags
        prj_tags.classList.add("project-tags");
        p.tags.forEach(t => {
            let pt = document.createElement("div");
            pt.classList.add("project-tag");
            pt.innerText = t.name;
            pt.style.backgroundColor = projects.getTagColor(t.type);
            pt.addEventListener("click", function() {
                projects.initByTag(t.name);
                prjs = projects.getActiveProjects();
                populateProjects();
            });
            prj_tags.appendChild(pt);
        });
        prj_title_tags.classList.add("project-title-tags");

        //Title tag
        let ptt = document.createElement("a");
        ptt.classList.add("project-title-tag");
        ptt.innerText = p.titleTags.type;
        if (p.titleTags.subtype) ptt.innerText += " - " + p.titleTags.subtype;
        ptt.style.color = "white";
        prj_title_tags.appendChild(ptt);

        //Append elements
        prj_cont.appendChild(prj_tags);
        prj_cont.appendChild(prj_det);
        prj_card.appendChild(prj_title);
        prj_card.appendChild(prj_title_tags);
        prj_card.appendChild(prj_cont);

        //Sort types of projects
        switch (p.titleTags.type) {
            case "Professional":
                prjs_prof.appendChild(prj_card);
                break;
            case "Personal":
                prjs_pers.appendChild(prj_card);
                break;
            default:
                prjs_pers.appendChild(prj_card);
                break;
        }

        prjs_section.appendChild(prjs_prof);
        prjs_section.appendChild(prjs_pers);

        updateStyling();
    });
}

export { init };