var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("component/base-component", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Component = void 0;
    class Component {
        constructor(templateId, hostElementId, insertAtStart, newElementId) {
            this.templateElement = document.getElementById(templateId);
            this.hostElement = document.getElementById(hostElementId);
            const importNode = document.importNode(this.templateElement.content, true);
            this.element = importNode.firstElementChild;
            if (newElementId) {
                this.element.id = newElementId;
            }
            this.attach(insertAtStart);
        }
        attach(insertAtBeginning) {
            this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element);
        }
    }
    exports.Component = Component;
});
define("util/validation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validate = void 0;
    function validate(validatableInput) {
        let isValid = true;
        if (validatableInput.required) {
            isValid = isValid && validatableInput.value.toString().trim().length !== 0;
        }
        if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
            isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
        }
        if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
            isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
        }
        if (validatableInput.min != null && typeof validatableInput.value === 'number') {
            isValid = isValid && validatableInput.value >= validatableInput.min;
        }
        if (validatableInput.max != null && typeof validatableInput.value === 'number') {
            isValid = isValid && validatableInput.value <= validatableInput.max;
        }
        return isValid;
    }
    exports.validate = validate;
});
define("decorator/autobind", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.autobind = void 0;
    function autobind(_, _2, descriptor) {
        const originalMethod = descriptor.value;
        const adjDescriptor = {
            configurable: true,
            get() {
                const boundFn = originalMethod.bind(this);
                return boundFn;
            }
        };
        return adjDescriptor;
    }
    exports.autobind = autobind;
});
define("models/project", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectType = exports.ProjectStatus = void 0;
    var ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = exports.ProjectStatus || (exports.ProjectStatus = {}));
    ;
    class ProjectType {
        constructor(id, title, description, people, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.people = people;
            this.status = status;
        }
    }
    exports.ProjectType = ProjectType;
});
define("state/project-state", ["require", "exports", "models/project"], function (require, exports, project_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.projectState = exports.ProjectState = void 0;
    class State {
        constructor() {
            this.listners = [];
        }
        addListners(listnersFn) {
            this.listners.push(listnersFn);
        }
    }
    class ProjectState extends State {
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
            const newProject = new project_js_1.ProjectType(Math.random().toString(), title, description, numPeople, project_js_1.ProjectStatus.Active);
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
    exports.ProjectState = ProjectState;
    exports.projectState = ProjectState.getInstance();
});
define("component/project-input", ["require", "exports", "component/base-component", "util/validation", "decorator/autobind", "state/project-state"], function (require, exports, base_component_js_1, validation_js_1, autobind_js_1, project_state_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectInput = void 0;
    class ProjectInput extends base_component_js_1.Component {
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
            if (!validation_js_1.validate(titleValidatable) ||
                !validation_js_1.validate(descriptionValidatable) ||
                !validation_js_1.validate(peopleValidatable)) {
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
                project_state_js_1.projectState.addProject(title, descrip, people);
                this.clearInput();
            }
        }
    }
    __decorate([
        autobind_js_1.autobind
    ], ProjectInput.prototype, "submitHandler", null);
    exports.ProjectInput = ProjectInput;
});
define("models/drag-drop", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("component/project-item", ["require", "exports", "component/base-component", "decorator/autobind"], function (require, exports, base_component_js_2, autobind_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectItem = void 0;
    class ProjectItem extends base_component_js_2.Component {
        constructor(hostId, projects) {
            super('single-project', hostId, false, projects.id);
            this.project = projects;
            this.configure();
            this.renderContent();
        }
        get persons() {
            if (this.project.people === 1) {
                return '1 Person';
            }
            else {
                return `${this.project.people} persons`;
            }
        }
        dragStartHandler(event) {
            event.dataTransfer.setData('text/plain', this.project.id);
            event.dataTransfer.effectAllowed = "move";
        }
        dragEndHandler(_) {
            console.log('DragEnd');
        }
        configure() {
            this.element.addEventListener('dragstart', this.dragStartHandler);
            this.element.addEventListener('dragend', this.dragEndHandler);
        }
        renderContent() {
            this.element.querySelector('h2').textContent = this.project.title;
            this.element.querySelector('h3').textContent = this.persons + ' assigned';
            this.element.querySelector('p').textContent = this.project.description;
        }
    }
    __decorate([
        autobind_js_2.autobind
    ], ProjectItem.prototype, "dragStartHandler", null);
    exports.ProjectItem = ProjectItem;
});
define("component/project-list", ["require", "exports", "component/project-item", "component/base-component", "models/project", "decorator/autobind", "state/project-state"], function (require, exports, project_item_js_1, base_component_js_3, project_js_2, autobind_js_3, project_state_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectList = void 0;
    class ProjectList extends base_component_js_3.Component {
        constructor(type) {
            super('project-list', 'app', false, `${type}-projects`);
            this.type = type;
            this.assignedProject = [];
            this.configure();
            this.renderContent();
        }
        dragOverHandler(event) {
            if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
                const listEl = this.element.querySelector('ul');
                listEl.classList.add('droppable');
            }
        }
        dropHandler(event) {
            const prjId = event.dataTransfer.getData('text/plain');
            project_state_js_2.projectState.moveProject(prjId, this.type === 'active' ? project_js_2.ProjectStatus.Active : project_js_2.ProjectStatus.Finished);
        }
        dragLeaveHandler(_) {
            const listEl = this.element.querySelector('ul');
            listEl.classList.remove('droppable');
        }
        configure() {
            this.element.addEventListener('dragover', this.dragOverHandler);
            this.element.addEventListener('dragleave', this.dragLeaveHandler);
            this.element.addEventListener('drop', this.dropHandler);
            project_state_js_2.projectState.addListners((projects) => {
                const relevantProject = projects.filter(prj => {
                    if (this.type === 'active') {
                        return prj.status === project_js_2.ProjectStatus.Active;
                    }
                    return prj.status === project_js_2.ProjectStatus.Finished;
                });
                this.assignedProject = relevantProject;
                this.renderProjects();
            });
        }
        renderContent() {
            const listId = `${this.type}-projects-list`;
            this.element.querySelector('ul').id = listId;
            this.element.querySelector('h2').textContent = this.type.toUpperCase() + ' PROJECTS';
        }
        renderProjects() {
            const listEl = document.getElementById(`${this.type}-projects-list`);
            listEl.innerHTML = '';
            for (const projItem of this.assignedProject) {
                new project_item_js_1.ProjectItem(this.element.querySelector('ul').id, projItem);
            }
        }
    }
    __decorate([
        autobind_js_3.autobind
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        autobind_js_3.autobind
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        autobind_js_3.autobind
    ], ProjectList.prototype, "dragLeaveHandler", null);
    exports.ProjectList = ProjectList;
});
define("app", ["require", "exports", "component/project-input", "component/project-list"], function (require, exports, project_input_js_1, project_list_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const prjInput = new project_input_js_1.ProjectInput();
    const activeProjectList = new project_list_js_1.ProjectList('active');
    const finishedProjectList = new project_list_js_1.ProjectList('finished');
});
//# sourceMappingURL=bundle.js.map