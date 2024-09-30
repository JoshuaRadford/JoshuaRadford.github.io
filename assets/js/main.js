import * as project from "./project.js";
import * as utils from "./utils.js";

// Project data
let projectList;
let activeProjectList;
let projectCardList;

// Queries
let projectsSection = document.querySelector(".projects-container");
let scrollUp = document.querySelector("#scroll-up");

/**
 * Initialize project data and page-wide elements.
 */
function init() {
    projectList = project.init();
    activeProjectList = projectList;
    projectCardList = [];
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
    let elems = [];
    /* add elements here */

    elems.forEach(e => {
        let colors = utils.themeColors.slice();
        e.forEach(n => {
            const rColor = colors[utils.getRandomInt(colors.length)];
            //Validates a 6-digit hex color or CSS color
            n.style.color = (/^#[0-9A-F]{6}$/i.test(rColor) || utils.isColor(rColor)) ? rColor : "#808080";
            colors.splice(colors.indexOf(rColor), 1);
            if (colors.length === 0) colors = utils.themeColors.slice();
        });
    });
}

/**
 * Creates and fills an HTML element based on the details of a given Project.
 * @param p The project to create from.
 * @returns {HTMLDivElement} The parent div block.
 * @constructor
 */
function HTMLDivElementFromProject(p){
    // Initialize elements
    let card = document.createElement("div");
    let content = document.createElement("div");
    let videoBlock = document.createElement("div");
    let video = document.createElement("video");
    let videoSource = document.createElement("source");
    let title = document.createElement("h3");
    let detailsTitle = document.createElement("div");
    let details = document.createElement("p");
    let tags = document.createElement("div");
    let titleTags = document.createElement("div");

    card.classList.add("project-card", "dark-back");
    content.classList.add("project-content");

    //Video preview
    video.className = "project-preview";
    video.muted = true;
    video.loop = true;
    video.addEventListener("mouseover", function() {
        this.play();
    });
    video.addEventListener("mouseleave", function() {
        this.pause();
        this.currentTime = 0;
    });

    // Other details
    videoSource.src = p.imgPath;
    videoSource.type = "video/mp4";
    videoBlock.classList.add("project-preview-container");
    title.classList.add("project-title");
    title.innerText = p.title;
    details.className = "project-details";
    detailsTitle.innerText = p.detailsTitle;
    detailsTitle.className = "project-details-title";
    details.innerText = p.details;

    video.appendChild(videoSource);
    videoBlock.appendChild(video);

    // Title tag
    titleTags.classList.add("project-title-tags");
    p.titleTags.forEach(t => {
        let ptt = document.createElement("div");
        ptt.classList.add("project-title-tag");
        ptt.innerText = t.name;
        ptt.addEventListener("click", function() {
            activeProjectList = project.getByTitleTag(projectList, t.name);
            visualizeActiveProjects(t.name, true);
        });
        titleTags.appendChild(ptt);
    });

    // Project tags
    tags.classList.add("project-tags");
    let pTagElements = [];
    let hoveringTag = false;
    p.tags.forEach(t => {
        let pt = document.createElement("div");
        pt.classList.add("project-tag");
        pt.innerText = t.name;
        //pt.style.backgroundColor = project.getTagColor(t.type);
        pt.addEventListener("click", function() {
            activeProjectList = project.getByTag(projectList, t.name);
            visualizeActiveProjects(t.name, true);
        });
        pTagElements.push(pt);
        tags.appendChild(pt);
    });
    // Highlight tag on hover, de-highlight other tags
    pTagElements.forEach(t => {
        t.addEventListener("mouseover", function() {
            pTagElements.forEach(t => {
                t.style.opacity = "75%";
            });
            t.style.opacity = "100%";
            hoveringTag = true;
        });
        t.addEventListener("mouseleave", function() {
            hoveringTag = false;
            setTimeout(
                function() {
                    if (hoveringTag === false) {
                        pTagElements.forEach(t => t.style.opacity = "100%");
                    }
                },
                200);
        });
    });


    // Append elements
    content.appendChild(detailsTitle);
    content.appendChild(details);
    card.appendChild(videoBlock);
    card.appendChild(title);
    card.appendChild(content);
    content.appendChild(tags);
    content.appendChild(titleTags);
    p.htmlBlock = card;

    return card
}

/**
 * Hide non-active projects.
 */
function visualizeActiveProjects(tagName, resetTags = false){
    let seeAllProjects = document.querySelector("#projects-see-all");
    seeAllProjects.style.display = activeProjectList.length < projectList.length ? "inline-block" : "none";

    projectList.forEach(p => {
        if(p.htmlBlock){
            p.htmlBlock.style.display = activeProjectList.includes(p) ? "block" : "none";
        }
        if(resetTags){
            p.htmlBlock.querySelectorAll(".project-tag").forEach(t => {
                t.style = window.getComputedStyle(t);
            });
            p.htmlBlock.querySelectorAll(".project-title-tag").forEach(t => {
                t.style = window.getComputedStyle(t);
            });
        }
    });

    activeProjectList.forEach(p => {
        p.htmlBlock.querySelectorAll(".project-tag").forEach(t => {
            if(t.innerText === tagName){
                t.style.color = "#B37D00";
            }
        })
        p.htmlBlock.querySelectorAll(".project-title-tag").forEach(t => {
            if(t.innerText === tagName){
                t.style.color = "#B37D00";
            }
        })
    })
}

/**
 * Clear and refill the projects section.
 */
function populateProjects() {
    let professionalProjectsSection = document.createElement("div");
    let personalProjectsSection = document.createElement("div");

    projectsSection.innerHTML = "";
    professionalProjectsSection.classList.add("projects-subtype");
    personalProjectsSection.classList.add("projects-subtype");

    // Option to show all projects
    let seeAllProjects = document.querySelector("#projects-see-all");
    seeAllProjects.style.display = activeProjectList.length < projectList.length ? "inline-block" : "none";
    seeAllProjects.addEventListener("click", function() {
        activeProjectList = projectList;
        visualizeActiveProjects(null, true);
    });

    projectList.forEach(p => {
        let card = HTMLDivElementFromProject(p)

        // Sort types of projects
        switch (p.titleTags.type) {
            case "Professional":
                professionalProjectsSection.appendChild(card);
                break;
            case "Personal":
                personalProjectsSection.appendChild(card);
                break;
            default:
                personalProjectsSection.appendChild(card);
                break;
        }

        projectsSection.appendChild(professionalProjectsSection);
        projectsSection.appendChild(personalProjectsSection);
        updateStyling();

        projectCardList.push(card)
    });
}

export { init };