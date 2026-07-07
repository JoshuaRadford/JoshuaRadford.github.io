import { ProjectManager } from './projectManager.js';
import * as utils from './utils.js';

// Project data
let projectManager = new ProjectManager();

/**
 * Initialize project data and page-wide elements.
 */
async function init()
{
    await projectManager.loadProjects();
    projectManager.activateAllProjects();
    populateProjects();
    initGlobalEvents();
    visualizeActiveProjects();
}

function initGlobalEvents()
{
    let scrollUp = document.getElementById('scroll-up');
    let seeAll = document.getElementById('projects-toggle');

    scrollUp.addEventListener('click', () =>
    {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    });

    seeAll.addEventListener("click", () =>
    {
        projectManager.activateAllProjects();
        visualizeActiveProjects();
    });
}

function createElement(type, classes = [], content = '')
{
    const element = document.createElement(type);
    element.classList.add(...classes);
    element.innerHTML = (content) ? content : element.innerHTML;
    return element;
}

function handleTagClick(tag, type)
{
    let projectsToActivate = [];
    if (type === 'skill')
    {
        projectsToActivate = projectManager.getProjectsBySkill(tag.name);
    }
    else if (type === 'category')
    {
        projectsToActivate = projectManager.getProjectsByCategory(tag.name);
    }

    projectManager.projects.forEach(p =>
    {
        p.active = projectsToActivate.includes(p) ? true : false;
    });
    visualizeActiveProjects();
}

/**
 * Creates and fills an HTML element based on the details of a given Project.
 * @param p The project to create from.
 * @returns {HTMLDivElement} The parent div block.
 * @constructor
 */
function createProjectWidget(p)
{
    let widget = createElement('div', ['project-card']);
    let body = createElement('div', ['project-card__body']);
    let media = createElement('div', ['project-card__media']);

    if (p.extLink)
    {
        media.addEventListener('click', () =>
            window.open(p.extLink, "_blank")
        );
    }

    let img = createElement('img', ['project-card__image']);
    img.src = p.imagePath;
    let titles = createElement('div', ['project-card__titles']);
    let title = createElement('h3', ['project-card__title'], p.title);
    let subtitle = createElement('h4', ['project-card__subtitle'], p.subtitle);
    let overview = createElement('p', ['project-card__description'], p.overview);
    let description = createElement(
        'p', ['project-card__description'], p.description
    );

    if(p.skills?.length)
    {
        let container = createElement('div', ['project-card__meta']);
        p.skills.forEach(s => {
            let tag = createElement('div', ['project-card__tag'], s.abbrev);
            tag.title = s.name;
            tag.addEventListener('click', (e) => {
                e.stopPropagation();
                handleTagClick(s, 'skill');
            });
            container.appendChild(tag);
        });
        widget.prepend(container);
    }

    if(p.categories?.length)
    {
        let catName = p.categories[0].name.toLowerCase();
        let catColor = projectManager.projectColors[catName] || "#ffffff";
        widget.style.setProperty('--project-color', catColor);
    }

    if(p.links?.length)
    {
        const imgLabels = { external: 'external.svg', demo: 'motion_play.svg', download: 'download.svg' };
        let container = createElement('div', ['project-card__badges']);
        p.links.forEach(e => {
            if(imgLabels[e.type])
            {
                let badgeWrapper = createElement('div', ['project-card__badge-wrapper']);
                let badge  = createElement('a', ['project-card__badge']);
                let img = createElement('img');
                let tooltip = createElement('span', ['project-card__badge-tooltip']);
                img.src = `assets/icons/${imgLabels[e.type]}`;
                // iconRef.title = e.type;
                tooltip.innerText = e.type.charAt(0).toUpperCase() + e.type.slice(1);
                Object.assign(badge, { href: e.url, target: "_blank" });
                badge.appendChild(img);
                badgeWrapper.appendChild(tooltip);
                badgeWrapper.appendChild(badge);
                container.appendChild(badgeWrapper);
            }
        });
        media.prepend(container);
    }

    [title, subtitle].forEach(e => titles.appendChild(e));
    [img].forEach(e => media.prepend(e));
    [titles, overview].forEach(e => body.appendChild(e));
    [body, media].forEach(e => widget.prepend(e));
    p.htmlBlock = widget;

    return widget
}

/**
 * Hide non-active projects.
 */
function visualizeActiveProjects()
{
    let seeAll = document.getElementById('projects-toggle');
    let projects = projectManager.projects;
    let activeProjects = projectManager.getActiveProjects();
    const isSubset = (activeProjects.length < projects.length);

    seeAll.style.display = isSubset ? 'inline-block' : 'none';

    projects.forEach(p =>
    {
        if (!p.htmlBlock) return;

        const active = activeProjects.includes(p);
        p.htmlBlock.style.display = active ? 'block' : 'none';
    });
}

/**
 * Clear and refill the projects section.
 */
function populateProjects()
{
    let projectsSection = document.getElementById('projects-grid');
    projectsSection.innerHTML = "";

    let projects = projectManager.projects;

    projects.forEach(p =>
    {
        let widget = createProjectWidget(p)
        projectsSection.appendChild(widget);
    });
}

export { init };