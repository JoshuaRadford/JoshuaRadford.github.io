class ProjectManager
{
    projects;

    async loadProjects()
    {
        try
        {
            this.projects = await this.fetchProjectsFromJson();
        }
        catch (error)
        {
            console.error('Failed to load projects:', error);
        }

        this.projects.forEach(p =>
        {
            p.sortSkillsByType = this.sortSkillsByType;
            p.active = false;
        });
    }

    async fetchProjectsFromJson()
    {
        let projects = [];
        await fetch('assets/misc/projects.json').then(response =>
        {
            if (!response.ok)
            {
                throw new Error("Failed to fetch project data");
            }
            return response.json();
        }).then(data =>
        {
            data.forEach(p =>
            {
                projects.push(p);
            });
        }).catch(error =>
        {
            console.error("Error loading project data:", error);
        });
        return projects;
    }

    activateAllProjects()
    {
        this.projects.forEach(p =>
        {
            p.active = true;
        });
    }

    getActiveProjects()
    {
        let activeProjects = [];
        this.projects.forEach(p =>
        {
            if (p.active)
            {
                activeProjects.push(p);
            }
        });
        return activeProjects;
    }

    getProjectsBySkill(skillName)
    {
        let projectsWithSkill = [];
        this.projects.forEach(p =>
        {
            p.skills.forEach(s =>
            {
                if (s.name === skillName)
                {
                    projectsWithSkill.push(p);
                    return;
                }
            });
        });
        return projectsWithSkill;
    }

    getProjectsByCategory(categoryName)
    {
        let projectsWithCategory = [];
        this.projects.forEach(p =>
        {
            p.categories.forEach(c =>
            {
                if (c.name === categoryName)
                {
                    projectsWithCategory.push(p);
                    return;
                }
            });
        });
        return projectsWithCategory;
    }

    sortSkillsByType = () =>
    {
        this.skills.sort(function (a, b)
        {
            if (a.category < b.category) return -1;
            if (a.category > b.category) return 1;
            return 0;
        });
    }
}

export { ProjectManager };