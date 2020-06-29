import { ProjectType, ProjectStatus } from "../models/project";
class State {
    constructor() {
        this.listners = [];
    }
    addListners(listnersFn) {
        this.listners.push(listnersFn);
    }
}
export class ProjectState extends State {
    constructor() {
        super();
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }
    addProject(title, description, numPeople) {
        const newProject = new ProjectType(Math.random().toString(), title, description, numPeople, ProjectStatus.Active);
        this.projects.push(newProject);
        this.updateListners();
    }
    moveProject(projectId, newStatus) {
        const project = this.projects.find(prj => prj.id === projectId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListners();
        }
    }
    updateListners() {
        for (const listnersFn of this.listners) {
            listnersFn(this.projects.slice());
        }
    }
}
export const projectState = ProjectState.getInstance();
//# sourceMappingURL=project-state.js.map