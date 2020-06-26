//Component Base Class

export abstract class Component<T extends HTMLElement,U extends HTMLElement>{
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
