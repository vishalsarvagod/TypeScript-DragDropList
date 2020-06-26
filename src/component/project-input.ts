import { Component } from './base-component.js';
import { Validatable,validate }  from '../util/validation.js';
import { autobind } from '../decorator/autobind.js';
import { ProjectState,projectState } from '../state/project-state.js';
//ProjectInput Class
export class ProjectInput extends Component<HTMLDivElement,HTMLFormElement>{  
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
