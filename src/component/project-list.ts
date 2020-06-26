  //ProjectList Class

import { ProjectItem } from "./project-item.js";
import { Component } from "./base-component.js";
import { DragTarget } from "../models/drag-drop.js";
import { ProjectType, ProjectStatus } from "../models/project.js";
import { autobind } from "../decorator/autobind.js";
import { projectState } from "../state/project-state.js";

export class ProjectList extends Component<HTMLDivElement,HTMLElement>
implements DragTarget{
assignedProject : ProjectType[];

constructor(private type: 'active' | 'finished'){
    super('project-list','app',false,`${type}-projects`);
    this.assignedProject = [];
    
    this.configure();
    this.renderContent();
}
@autobind
dragOverHandler(event: DragEvent){
    if(event.dataTransfer && event.dataTransfer.types[0] ==='text/plain'){
        event.preventDefault();
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.add('droppable')
    }
   
}
@autobind
dropHandler(event: DragEvent){
    const prjId = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(prjId,this.type === 'active'? ProjectStatus.Active: ProjectStatus.Finished);
}
@autobind
dragLeaveHandler(_: DragEvent){
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable')
}
configure(){
    this.element.addEventListener('dragover',this.dragOverHandler);
    this.element.addEventListener('dragleave',this.dragLeaveHandler);
    this.element.addEventListener('drop',this.dropHandler);
    projectState.addListners((projects: ProjectType[])=>{
        const relevantProject = projects.filter(prj => {
            if(this.type ==='active'){
                return prj.status ===ProjectStatus.Active;
            }
            return prj.status ===ProjectStatus.Finished;
        });
        this.assignedProject = relevantProject;
        this.renderProjects();
    });
}
renderContent(){
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase()+' PROJECTS';
}

private renderProjects(){
    const listEl = document.getElementById(`${this.type}-projects-list`) as HTMLUListElement;
    listEl.innerHTML = '';
    for(const projItem of this.assignedProject){
        new ProjectItem(this.element.querySelector('ul')!.id,projItem);
    }
}
}