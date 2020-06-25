// 

// Project Type
enum ProjectStatus { Active,Finished};
class ProjectType{
    constructor(public id: string,
        public title: string,
        public description:string,
        public people: number,
        public status: ProjectStatus){

    }
}

// Project State Management
type Listner<T> = (item: ProjectType[])=>void;

class State<T> {
    protected listners: Listner<T>[] = [];
    addListners(listnersFn: Listner<T>){
        this.listners.push(listnersFn);
    }
}

class ProjectState extends State<ProjectType>{
   
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
        for(const listnersFn of this.listners){
            listnersFn(this.projects.slice());
        }
    }
}

const projectState = ProjectState.getInstance();

//Validation
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validatableInput : Validatable){
    let isValid = true;
    if(validatableInput.required){
        isValid = isValid && validatableInput.value.toString().trim().length !==0;
    }
    if(validatableInput.minLength != null && typeof validatableInput.value ==='string'){
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if(validatableInput.maxLength != null && typeof validatableInput.value ==='string'){
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if(validatableInput.min !=null && typeof validatableInput.value ==='number'){
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if(validatableInput.max !=null && typeof validatableInput.value ==='number'){
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }
    return isValid;
}

// Autobind decorator
function autobind(_:any,_2:string,descriptor: PropertyDescriptor){
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get(){
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}

//Component Base Class

abstract class Component<T extends HTMLElement,U extends HTMLElement>{
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element : U;

    constructor(templateId: string,
        hostElementId: string, 
        
        insertAtStart: boolean,
        newElementId?: string){
        this.templateElement = <HTMLTemplateElement>document.getElementById(templateId)!;
        this.hostElement = document.getElementById(hostElementId)! as T;

        const importNode = document.importNode(this.templateElement.content,true);
        this.element = importNode.firstElementChild as U;
        if(newElementId){
            this.element.id = newElementId;
        }  
        this.attach(insertAtStart);     
    }

    private attach(insertAtBeginning: boolean){
        this.hostElement.insertAdjacentElement(insertAtBeginning?'afterbegin':'beforeend',this.element);
    }

    abstract configure?():void;
    abstract renderContent(): void;
}

//Project Item Class
 class ProjectItem extends Component<HTMLUListElement,HTMLLIElement>{
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
     configure(){}
     renderContent(){
         this.element.querySelector('h2')!.textContent = this.project.title;
         this.element.querySelector('h3')!.textContent = this.persons +' assigned';
         this.element.querySelector('p')!.textContent = this.project.description;
     }
 }

//ProjectList Class

class ProjectList extends Component<HTMLDivElement,HTMLElement>{
    assignedProject : ProjectType[];

    constructor(private type: 'active' | 'finished'){
        super('project-list','app',false,`${type}-projects`);
        this.assignedProject = [];
        
        this.configure();
        this.renderContent();
    }
    
    configure(){
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

//ProjectInput Class
class ProjectInput extends Component<HTMLDivElement,HTMLFormElement>{  
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLTextAreaElement;
    pepoleInputElement: HTMLInputElement;

    constructor(){
        super('project-input','app',true,'user-input');

        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLTextAreaElement;
        this.pepoleInputElement = this.element.querySelector('#people') as HTMLInputElement;
        this.configure();
    }
    configure(){
        this.element.addEventListener('submit',this.submitHandler.bind(this));
    }
    renderContent(){}
    private gatherUserInput(): [string,string,number] | void{
        const enterTitle = this.titleInputElement.value;
        const enterDescription = this.descriptionInputElement.value;
        const enterPeople = this.pepoleInputElement.value;
        const titleValidatable : Validatable = {
            value: enterTitle,
            required: true,
            minLength: 1
        };
        const descriptionValidatable : Validatable ={
            value: enterDescription,
            required: true,
            minLength: 5

        }
        const peopleValidatable: Validatable = {
            value : enterPeople,
            required: true,
            minLength: 1,
            min: 1,
            max: 5
        }
        if(
            !validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable) 
        ){
                alert('Invalid input, please try agian..');
                return;
            }
            else{
                return [enterTitle,enterDescription,+enterPeople];
            }
    }
    private clearInput(){
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.pepoleInputElement.value ='';
    }
    @autobind
    private submitHandler(event: Event){
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if(Array.isArray(userInput)){
            const [title,descrip,people]= userInput;
            projectState.addProject(title,descrip,people);
           // console.log(title,descrip,people);
            this.clearInput();
        }
    }
}

const prjInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');