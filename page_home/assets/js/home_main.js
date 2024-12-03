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
function init()
{
    projectList = project.init();
    activeProjectList = projectList;
    projectCardList = [];
    populateProjects();

    //Event Listeners
    scrollUp.addEventListener("click", () =>
    {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    });

    updateStyling();
}

function updateStyling()
{
    //Randomize text color of certain elements
    let elems = [];
    /* add elements here */

    elems.forEach(e =>
    {
        let colors = utils.themeColors.slice();
        e.forEach(n =>
        {
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
function HTMLDivElementFromProject(p)
{
    // Initialize elements
    let card = document.createElement("div");

    let content = document.createElement("div");
    let previewContainer = document.createElement("div");
    let video = document.createElement("video");
    let videoSource = document.createElement("source");

    let titleBlock = document.createElement("div");
    let title = document.createElement("h3");
    let subtitle = document.createElement("h4");
    let details = document.createElement("p");
    let tagsMainContainer = document.createElement("div");

    let skillTagsContainer = document.createElement("div");
    let skillTagsDropdownHeader = document.createElement("div");
    let skillTagsDropdownMenu = document.createElement("div");

    let titleTagsContainer = document.createElement("div");
    let titleTagsDropdownHeader = document.createElement("div");
    let titleTagsDropdownMenu = document.createElement("div");

    card.classList.add("project-card");
    content.classList.add("project-content");

    //Video preview
    video.className = "project-preview";
    video.muted = true;
    video.loop = true;
    video.addEventListener("mouseover", function ()
    {
        this.play();
    });
    video.addEventListener("mouseleave", function ()
    {
        this.pause();
        this.currentTime = 0;
    });

    // Other details

    // Preview container
    previewContainer.classList.add("project-preview-container");
    titleBlock.classList.add("project-title-block");
    subtitle.classList.add("project-subtitle");
    title.innerText = p.title;
    subtitle.innerText = (p.subtitle) ? (p.subtitle) : "";
    videoSource.src = p.imgPath;
    videoSource.type = "video/mp4";
    titleBlock.appendChild(title);
    titleBlock.appendChild(subtitle);
    video.appendChild(videoSource);
    previewContainer.appendChild(video);
    previewContainer.appendChild(titleBlock);

    // Project details
    details.className = "project-details";
    details.innerText = p.details;

    tagsMainContainer.classList.add("project-tags-main-container");

    tagsMainContainer.appendChild(skillTagsContainer);
    tagsMainContainer.appendChild(titleTagsContainer);

    // Title tags
    titleTagsContainer.classList.add("project-tags-container");
    titleTagsDropdownHeader.classList.add("project-tags-dropdown-header");
    titleTagsDropdownMenu.classList.add("project-tags-dropdown-menu");
    titleTagsContainer.appendChild(titleTagsDropdownHeader);
    titleTagsContainer.appendChild(titleTagsDropdownMenu);

    titleTagsDropdownHeader.innerHTML = "Project Types";
    // Dropdown logic
    titleTagsDropdownHeader.addEventListener("click", function ()
    {
        titleTagsDropdownMenu.style.maxHeight = (window.getComputedStyle(titleTagsDropdownMenu).maxHeight == "0px") ? titleTagsDropdownMenu.scrollHeight + "px" : "0px";
    });
    p.titleTags.forEach(t =>
    {
        let ptt = document.createElement("div");
        ptt.classList.add("project-tag");
        ptt.innerText = t.name;
        ptt.addEventListener("click", function ()
        {
            activeProjectList = project.getByTitleTag(projectList, t.name);
            visualizeActiveProjects(t.name, true);
        });
        titleTagsDropdownMenu.appendChild(ptt);
    });

    // Project tags
    let pTagElements = [];
    let hoveringTag = false;

    skillTagsContainer.classList.add("project-tags-container");
    skillTagsDropdownHeader.classList.add("project-tags-dropdown-header");
    skillTagsDropdownMenu.classList.add("project-tags-dropdown-menu");
    skillTagsContainer.appendChild(skillTagsDropdownHeader);
    skillTagsContainer.appendChild(skillTagsDropdownMenu);

    skillTagsDropdownHeader.innerHTML = "Skill Tags"
    // Dropdown logic
    skillTagsDropdownHeader.addEventListener("click", function ()
    {
        skillTagsDropdownMenu.style.maxHeight = (window.getComputedStyle(skillTagsDropdownMenu).maxHeight == "0px") ? skillTagsDropdownMenu.scrollHeight + "px" : "0px";
    });

    p.tags.forEach(t =>
    {
        let pt = document.createElement("div");
        pt.classList.add("project-tag");
        pt.innerText = t.name;
        pt.addEventListener("click", function ()
        {
            activeProjectList = project.getByTag(projectList, t.name);
            visualizeActiveProjects(t.name, true);
        });
        pTagElements.push(pt);
        skillTagsDropdownMenu.appendChild(pt);
    });
    // Highlight tag on hover, de-highlight other tags
    pTagElements.forEach(t =>
    {
        t.addEventListener("mouseover", function ()
        {
            pTagElements.forEach(t =>
            {
                t.style.opacity = "75%";
            });
            t.style.opacity = "100%";
            hoveringTag = true;
        });
        t.addEventListener("mouseleave", function ()
        {
            hoveringTag = false;
            setTimeout(
                function ()
                {
                    if (hoveringTag === false)
                    {
                        pTagElements.forEach(t => t.style.opacity = "100%");
                    }
                },
                200);
        });
    });

    // Close the dropdown if the user clicks outside of it
    window.addEventListener("click", function (event)
    {
        if (!event.target.classList.contains('project-tags-dropdown-header'))
        {
            skillTagsDropdownMenu.style.maxHeight = "0px";
            titleTagsDropdownMenu.style.maxHeight = "0px";
        }
    });


    // Append elements
    content.appendChild(details);
    content.appendChild(tagsMainContainer);
    card.appendChild(previewContainer);
    card.appendChild(content);
    p.htmlBlock = card;

    return card
}

/**
 * Hide non-active projects.
 */
function visualizeActiveProjects(tagName, resetTags = false)
{
    let seeAllProjects = document.querySelector("#projects-see-all");
    seeAllProjects.style.display = activeProjectList.length < projectList.length ? "inline-block" : "none";

    projectList.forEach(p =>
    {
        if (p.htmlBlock)
        {
            p.htmlBlock.style.display = activeProjectList.includes(p) ? "block" : "none";
        }
        if (resetTags)
        {
            p.htmlBlock.querySelectorAll(".project-tag").forEach(t =>
            {
                t.style = window.getComputedStyle(t);
            });
            p.htmlBlock.querySelectorAll(".project-title-tag").forEach(t =>
            {
                t.style = window.getComputedStyle(t);
            });
        }
    });

    activeProjectList.forEach(p =>
    {
        p.htmlBlock.querySelectorAll(".project-tag").forEach(t =>
        {
            if (t.innerText === tagName)
            {
                t.style.color = "#B37D00";
            }
        })
        p.htmlBlock.querySelectorAll(".project-title-tag").forEach(t =>
        {
            if (t.innerText === tagName)
            {
                t.style.color = "#B37D00";
            }
        })
    })
}

/**
 * Clear and refill the projects section.
 */
function populateProjects()
{
    let subsection = document.createElement("div");

    projectsSection.innerHTML = "";
    subsection.classList.add("projects-subtype");

    // Option to show all projects
    let seeAllProjects = document.querySelector("#projects-see-all");
    seeAllProjects.style.display = activeProjectList.length < projectList.length ? "inline-block" : "none";
    seeAllProjects.addEventListener("click", function ()
    {
        activeProjectList = projectList;
        visualizeActiveProjects(null, true);
    });

    projectList.forEach(p =>
    {
        let card = HTMLDivElementFromProject(p)
        subsection.appendChild(card);
        projectsSection.appendChild(subsection);
        updateStyling();

        projectCardList.push(card)
    });
}

export { init };