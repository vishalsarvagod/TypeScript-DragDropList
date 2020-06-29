import { Dragable } from '../models/drag-drop';
import { ProjectType } from '../models/project';
import { Component } from './base-component';
import { autobind } from '../decorator/autobind';

//Project Item Class
 export class ProjectItem extends Component<HTMLUListElement,HTMLLIElement>
 implements Dragable{
  private project : ProjectType;
  get persons(){
     if(this.project.people === 1){
         return '1 Person';
     }
     else{
         return `${this.project.people} persons`; 
     }
  }
  constructor(hostId:string,projects:ProjectType){
      super('single-project',hostId,false,projects.id);
      this.project = projects;
      this.configure();
      this.renderContent();
  }
  @autobind
  dragStartHandler(event: DragEvent){
     event.dataTransfer!.setData('text/plain',this.project.id);
     event.dataTransfer!.effectAllowed = "move";
  }
  dragEndHandler(_:DragEvent){
     console.log('DragEnd');
  }
  configure(){
      this.element.addEventListener('dragstart',this.dragStartHandler);
      this.element.addEventListener('dragend',this.dragEndHandler);
  }
  renderContent(){
      this.element.querySelector('h2')!.textContent = this.project.title;
      this.element.querySelector('h3')!.textContent = this.persons +' assigned';
      this.element.querySelector('p')!.textContent = this.project.description;
  }
}
