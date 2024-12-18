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
    let seeAll = document.getElementById('projects-see-all');

    // Close the dropdown if the user clicks outside of it
    window.addEventListener("click", function (event)
    {
        if (!event.target.classList.contains('dropdown-header'))
        {
            document.querySelectorAll('.dropdown-menu').forEach(menu =>
            {
                menu.style.maxHeight = '0px';
            });
        }
    });

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

function createDropDown(headerText, tags, type)
{
    const container = createElement('div', ['dropdown-container']);
    const header = createElement('div', ['dropdown-header'], headerText);
    const menu = createElement('div', ['dropdown-menu']);
    header.addEventListener('click', () => toggleDropdown(menu));
    tags.forEach(t =>
    {
        const tag = createElement('div', ['project-tag'], t.name);
        tag.addEventListener('click', () => handleTagClick(t, type));
        menu.appendChild(tag);
    });
    [header, menu].forEach(e => container.appendChild(e));
    container.appendChild(header);
    container.appendChild(menu);
    return container;
}

function toggleDropdown(dropdown)
{
    const closed = (
        dropdown.style.maxHeight == '0px' ||
        dropdown.style.maxHeight == 0
    );
    dropdown.style.maxHeight = closed ? dropdown.scrollHeight + 'px' : '0px';
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
    let content = createElement('div', ['project-content']);
    let previewContainer = createElement('div', ['project-preview-container']);
    if (p.projectLink)
    {
        previewContainer.addEventListener('click', () =>
            window.open(p.projectLink, "_blank")
        );
    }
    let preview = createElement('img', ['project-preview']);
    preview.src = p.imagePath;
    let titleContainer = createElement('div', ['project-title-block']);
    let title = createElement('h3', [], p.title);
    let subtitle = createElement('h4', ['project-subtitle'], p.subtitle);
    let description = createElement(
        'p', ['project-description'], p.description
    );
    let tagsContainer = createElement('div', ['flex-row-center']);
    let skillsDropdown = createDropDown('Skill Tags', p.skills, 'skill');
    let categoriesDropdown = createDropDown(
        'Project Types', p.categories, 'category'
    );
    [title, subtitle].forEach(e => titleContainer.appendChild(e));
    [preview, titleContainer].forEach(e => previewContainer.appendChild(e));
    [skillsDropdown, categoriesDropdown].forEach(e =>
        tagsContainer.appendChild(e)
    );
    [description, tagsContainer].forEach(e => content.appendChild(e));
    [previewContainer, content].forEach(e => widget.appendChild(e));
    p.htmlBlock = widget;

    return widget
}

/**
 * Hide non-active projects.
 */
function visualizeActiveProjects()
{
    let seeAll = document.getElementById('projects-see-all');
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
    let projectsSection = document.getElementById('projects-container');
    projectsSection.innerHTML = "";

    let projects = projectManager.projects;

    projects.forEach(p =>
    {
        let widget = createProjectWidget(p)
        projectsSection.appendChild(widget);
    });
}

export { init };