import * as projects from "./projects.js";
import * as utils from "./utils.js";

//Declarations
let myProjects;

//Queries
const projectsSection = document.querySelector(".projects-container");
const scrollUp = document.querySelector("#scroll-up");

function init() {
    myProjects = projects.initAll();
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
    projectsSection.innerHTML = "";

    //Check if all projects are showing
    let pSeeAll = document.querySelector("#projects-see-all");
    pSeeAll.style.display = myProjects.length < projects.getAllProjects().length ? "block" : "none";
    pSeeAll.addEventListener("click", function() {
        myProjects = projects.getAllProjects();
        populateProjects();
    });

    myProjects.forEach(p => {
        //Initialize elements
        let pContainer = document.createElement("div");
        let pContent = document.createElement("div");
        let pVidContainer = document.createElement("div");
        let pVid = document.createElement("video");
        let pVidSource = document.createElement("source");
        let pTitle = document.createElement("h3");
        let pDetails = document.createElement("p");
        let pTags = document.createElement("div");
        let pTitleTags = document.createElement("div");

        pContainer.classList.add("project-card", "dark-back");
        pContent.classList.add("project-content");

        //Video preview
        pVid.className = "project-preview";
        pVid.muted = true;
        pVid.loop = true;
        pVid.addEventListener("mouseover", function() {
            this.play();
        });
        pVid.addEventListener("mouseleave", function() {
            this.pause();
            this.currentTime = 0;
        });

        //Other details
        pVidSource.src = p.imgPath;
        pVidSource.type = "video/mp4";
        pVidContainer.classList.add("project-preview-container");
        pTitle.classList.add("project-title");
        pTitle.innerText = p.title;
        pDetails.className = "project-details";
        pDetails.innerText = p.details;

        pVid.appendChild(pVidSource);
        pVidContainer.appendChild(pVid);
        pContent.appendChild(pVidContainer);
        pContent.appendChild(pDetails);

        //Project tags
        pTags.classList.add("project-tags");
        p.tags.forEach(t => {
            let pt = document.createElement("div");
            pt.classList.add("project-tag");
            pt.innerText = t.name;
            pt.style.backgroundColor = projects.getTagColor(t.type);
            pt.addEventListener("click", function() {
                projects.initByTag(t.name);
                myProjects = projects.getActiveProjects();
                populateProjects();
            });
            pTags.appendChild(pt);
        });
        pTitleTags.classList.add("project-title-tags");
        p.titleTags.forEach(tt => {
            let ptt = document.createElement("a");
            ptt.classList.add("project-title-tag");
            ptt.innerText = tt.type;
            ptt.style.color = "white";
            pTitleTags.appendChild(ptt);
        });

        //Append elements
        pContainer.appendChild(pTitle);
        pContainer.appendChild(pTitleTags);
        pContainer.appendChild(pContent);
        pContainer.appendChild(pTags);

        projectsSection.appendChild(pContainer);

        updateStyling();
    });
}

export { init };