var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from './base-component';
import { validate } from '../util/validation';
import { autobind } from '../decorator/autobind';
import { projectState } from '../state/project-state';
export class ProjectInput extends Component {
    constructor() {
        super('project-input', 'app', true, 'user-input');
        this.titleInputElement = this.element.querySelector('#title');
        this.descriptionInputElement = this.element.querySelector('#description');
        this.pepoleInputElement = this.element.querySelector('#people');
        this.configure();
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this));
    }
    renderContent() { }
    gatherUserInput() {
        const enterTitle = this.titleInputElement.value;
        const enterDescription = this.descriptionInputElement.value;
        const enterPeople = this.pepoleInputElement.value;
        const titleValidatable = {
            value: enterTitle,
            required: true,
            minLength: 1
        };
        const descriptionValidatable = {
            value: enterDescription,
            required: true,
            minLength: 5
        };
        const peopleValidatable = {
            value: enterPeople,
            required: true,
            minLength: 1,
            min: 1,
            max: 5
        };
        if (!validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)) {
            alert('Invalid input, please try agian..');
            return;
        }
        else {
            return [enterTitle, enterDescription, +enterPeople];
        }
    }
    clearInput() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.pepoleInputElement.value = '';
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, descrip, people] = userInput;
            projectState.addProject(title, descrip, people);
            this.clearInput();
        }
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitHandler", null);
//# sourceMappingURL=project-input.js.map