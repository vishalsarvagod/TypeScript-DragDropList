


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
        if(enterTitle.trim().length ===0 ||
            enterDescription.trim().length ===0 ||
            enterPeople.trim().length ===0){
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