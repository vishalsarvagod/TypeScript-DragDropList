



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

//ProjectList Class

class ProjectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element : HTMLElement;
    constructor(private type: 'active' | 'finished'){
        this.templateElement = <HTMLTemplateElement>document.getElementById('project-list')!;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        const importNode = document.importNode(this.templateElement.content,true);
        this.element = importNode.firstElementChild as HTMLFormElement;
        this.element.id = `${this.type}-projects`;
        this.attach();
        this.renderContent();
    }
    private renderContent(){
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase()+' PROJECTS';
    }
    private attach(){
        this.hostElement.insertAdjacentElement('beforeend',this.element);
    }
}

//ProjectInput Class
class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement : HTMLDivElement;
    element : HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLTextAreaElement;
    pepoleInputElement: HTMLInputElement;
    constructor(){
        this.templateElement = <HTMLTemplateElement>document.getElementById('project-input')!;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        const importNode = document.importNode(this.templateElement.content,true);
        this.element = importNode.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';
        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLTextAreaElement;
        this.pepoleInputElement = this.element.querySelector('#people') as HTMLInputElement;
        this.configure();
        this.attach();
    }
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
            console.log(title,descrip,people);
            this.clearInput();
        }
    }
    private configure(){
        this.element.addEventListener('submit',this.submitHandler.bind(this));
    }
    private attach(){
        this.hostElement.insertAdjacentElement('afterbegin',this.element);
    }
}

const prjInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');