import { ProjectType, ProjectStatus } from "../models/project.js";

// Project State Management
  type Listner<T> = (item: ProjectType[])=>void;

  class State<T> {
      protected listners: Listner<T>[] = [];
      addListners(listnersFn: Listner<T>){
          this.listners.push(listnersFn);
      }
  }
  
  export class ProjectState extends State<ProjectType>{
     
      private projects: ProjectType[] = [];
      private static instance : ProjectState;
      private constructor(){
          super();
      }
      static getInstance(){
          if(this.instance){
              return this.instance;
          }
          this.instance = new ProjectState();
          return this.instance;
      }
     
      addProject(title: string,description: string, numPeople: number){
          const newProject = new ProjectType(
              Math.random().toString(),
              title,
              description,
              numPeople,
              ProjectStatus.Active
          );
          this.projects.push(newProject);
          this.updateListners();
      }
      moveProject(projectId: string, newStatus: ProjectStatus){
          const project = this.projects.find(prj =>prj.id === projectId);
          if(project && project.status !== newStatus){
              project.status = newStatus;
              this.updateListners();
          }
      }
      private updateListners(){
          for(const listnersFn of this.listners){
              listnersFn(this.projects.slice());
          }
      }
  }
  
  export const projectState = ProjectState.getInstance();