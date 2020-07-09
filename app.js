// Todo class : Represents a Todo.

class Todo {
    constructor(taskId, task, description, priority, date){
        this.taskId = taskId
        this.task = task;
        this.description= description;
        this.priority = priority;
        this.date = date
    }
}

// UI class: Handle UI tasks

class UI {
    static  displayTodos() { 
        const myTodos = Store.getTodos();
        const todos = myTodos;
        todos.forEach((todo)=>{
            UI.addTodoToList(todo);
        })
    }

    static addTodoToList(todo){
        const list = document.querySelector('#todo-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${todo.taskId}</td>
            <td>${todo.task}</td>
            <td>${todo.description}</td>
            <td>${todo.priority}</td>
            <td>${todo.date.toLocaleString()}</td>
            <td style="text-align: center;"><a href="#" class="btn btn-danger btn-sm far fa-trash-alt delete m-1"></a>
            <a href="#" class="btn btn-secondary btn-sm far fa-edit edit m-1"></a>
            ${ todo.completed?'<input type="checkbox" class="btn completed text-success" checked style="width:20px;height:20px;" value="Bike">':'<input type="checkbox" class="btn completed" style="width:20px;height:20px;" value="Bike">'}</td>
        `;
        if(document.querySelector('.alert-for-fields')){
            document.querySelector('.alert-for-fields').remove();
        }
        list.appendChild(row);
    }

    static actionOnTodo(elem){
        if(elem.classList.contains('delete')){
            elem.parentElement.parentElement.remove();

            //remove Todo from storage
            Store.removeTodo(elem.parentElement.parentElement.children[0].textContent);

            //alert delete
            UI.showAlerts('Todo removed', 'info');
        }
        else if(elem.classList.contains('edit')){
            let elements = elem.parentElement.parentElement.children;
            let arrayOfFields = ["taskId", "task", "description", "priority", "date"]
            for(let i=1; i<elements.length-1; i++){
                if(elements[i].textContent.length){
                    document.querySelector(`#${arrayOfFields[i]}`).value = elements[i].textContent
                }
            }
            document.querySelector('.submitEdit').value = "Edit ToDo";
            Store.saveTaskId(elements[0].textContent)
        }
        else if (elem.classList.contains('completed')){
            Store.addToComplete(elem.parentElement.parentElement.children[0].innerHTML)
        }
    }

    static showAlerts(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className} alert-for-fields`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#todo-form');
        if(!document.querySelector('.alert-for-fields')){
            container.insertBefore(div, form);
        }
        //vanish in 3 seconds
        setTimeout(()=>{
            document.querySelector('.alert-for-fields').remove()
        },3000);
    }

    static clearFields(){
        document.querySelector('#task').value = '';
        document.querySelector('#description').value = '';
        document.querySelector('#priority').value = '';
        document.querySelector('#date').value = '';
    }

    static actionOnPriority(){
        let todos = Store.getTodos();
        if(todos.length >= 2){
            if(parseInt(todos[0].priority) < parseInt(todos[1].priority)){
                todos.sort((a,b)=> parseInt(b.priority)-parseInt(a.priority))
            }else{
                todos.sort((a,b)=> parseInt(a.priority)-parseInt(b.priority))
            }
        }
        Store.sortByPriority(todos)
    }
}

// Store class: handles storage

class Store{
    static getTodos(){
        let todos;
        if(!localStorage.getItem('todos')){
            todos = []
        }else{
            todos = JSON.parse(localStorage.getItem('todos'));
        }
        return todos;
    }

    static getCompleted(){
        let todos;
        if(!localStorage.getItem('completed')){
            todos = []
        }else{
            todos = JSON.parse(localStorage.getItem('completed'));
        }
        return todos;
    }

    static addTodo(todo, taskId){
        console.log("Store -> addTodo -> todo, taskId", todo, taskId)
        const todos = Store.getTodos();
        todo.completed = false;
        todos.push(todo);
        console.log("Store -> addTodo -> todos", todos)
        localStorage.setItem('todos', JSON.stringify(todos));
        localStorage.setItem('taskIdCount',parseInt(taskId)+1)
    }

    static removeTodo(id){
        const todos = Store.getTodos();
        todos.forEach((todo, index)=>{
            if(todo.taskId == id){
                todos.splice(index, 1);
            }
        })
        localStorage.setItem('todos',JSON.stringify(todos));
    }

    static getTaskId(){
        let taskIdCount = localStorage.getItem("taskIdCount") || 1
        return taskIdCount;
    }

    static saveTaskId(taskId){
        localStorage.setItem("toBeEditedTaskId",taskId);
    }

    static getSavedTaskId(){
        return localStorage.getItem("toBeEditedTaskId");
    }

    static editTodo(todo){
        let todos = Store.getTodos();
        todos.forEach((each, index)=>{
            if(each.taskId == todo.taskId){
                todo.completed = each.completed;
                delete todos[index]
                todos[index]=todo
            }
        })
        localStorage.setItem("todos",JSON.stringify(todos))
        setTimeout(()=>{
            document.querySelector('.alert-for-fields').remove()
            location.reload()
        },1000);
    }

    static addToComplete(taskId){
        let todos = Store.getTodos();
        if(todos.length){
            todos.map((each)=>{
                if(each["taskId"]==taskId){
                    each["completed"] = !each["completed"];
                }
            })
        }
        localStorage.setItem("todos",JSON.stringify(todos));
    }

    static sortByPriority(todos){
        localStorage.setItem("todos",JSON.stringify(todos))
        location.reload()
    }

    static removeSavedTaskId(){
        localStorage.removeItem("toBeEditedTaskId")
    }
}

// Events : Display Todos
document.addEventListener('DOMContentLoaded', UI.displayTodos);

// Events : Add a Todo
document.querySelector('#todo-form').addEventListener('submit',(event)=>{
    //prevent actual submit
    event.preventDefault();
    const isEdit = Store.getSavedTaskId()

    //Get form values
    let taskId;
    const task = document.querySelector('#task').value;
    const description = document.querySelector('#description').value;
    const priority = document.querySelector('#priority').value;
    const date = document.querySelector('#date').value;

    //validations

    if(!task || !description || !priority || !date){
        UI.showAlerts('Fill in all fields','danger');
    }
    else if(isEdit){
        taskId=isEdit;

        //Delete the saved taskId for editing
        Store.removeSavedTaskId()

        // Instanceiate Todo
        const todo = new Todo(taskId, task, description, priority, date);

        //Edit Todo to store
        Store.editTodo(todo, taskId);

        //alert success
        UI.showAlerts('Todo Edited', 'success');

        //clear fields
        UI.clearFields();
    }
    else{
        taskId = Store.getTaskId();

        // Instanciate Todo
        const todo = new Todo(taskId, task, description, priority, date);
        
        //Add Todo to UI
        UI.addTodoToList(todo);

        //Add Todo to store
        Store.addTodo(todo, taskId);
    
        //alert success
        UI.showAlerts('Todo Added', 'success');

        //clear fields
        UI.clearFields();
    }

})

// Event: Remove a Todo
document.querySelector('#todo-list').addEventListener('click',(e)=>{
    UI.actionOnTodo(e.target);
})

document.querySelector('#table-head').addEventListener('click',(e)=>{
    UI.actionOnPriority(e.target)
})