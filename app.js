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
            <td>${todo.date}</td>
            <td><a href="#" class="btn btn-danger btn-sm far fa-trash-alt delete m-1"></a>
            <a href="#" class="btn btn-secondary btn-sm far fa-edit edit m-1"></a></td>
        `;
        if(document.querySelector('.alert-for-fields')){
            document.querySelector('.alert-for-fields').remove();
        }
        list.appendChild(row);
    }

    static actionOnTodo(elem){
        console.log("UI -> deleteTodo -> elem", elem)
        console.log("----------")
        if(elem.classList.contains('delete')){
            elem.parentElement.parentElement.remove();
            //remove Todo from storage
            Store.removeTodo(elem.parentElement.parentElement.children[0].textContent);

            //alert delete
            UI.showAlerts('Todo removed', 'info');
        }else if(elem.classList.containe('edit')){

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

    static addTodo(todo){
        const todos = Store.getTodos();
        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));
        console.log(localStorage.getItem('todos'))

    }

    static removeTodo(id){
        console.log("Store -> removeTodo -> name", name)
        const todos = Store.getTodos();
        todos.forEach((todo, index)=>{
            if(todo.taskId == id){
                todos.splice(index, 1);
            }
        })
        localStorage.setItem('todos',JSON.stringify(todos));
    }

    static getTaskId(){
        const todos = Store.getTodos();
        return todos.length+1
    }
}

// Events : Display Todos
document.addEventListener('DOMContentLoaded', UI.displayTodos);

// Events : Add a Todo
document.querySelector('#todo-form').addEventListener('submit',(event)=>{
    //prevent actual submit
    event.preventDefault();

    //Get form values
    const taskId = Store.getTaskId();
    const task = document.querySelector('#task').value;
    const description = document.querySelector('#description').value;
    const priority = document.querySelector('#priority').value;
    const date = document.querySelector('#date').value;

    //validations

    if(!task || !description || !priority || !date){
        UI.showAlerts('Fill in all fields','danger');
    }else{

        // Instanceiate Todo
        const todo = new Todo(taskId, task, description, priority, date);
        //Add Todo to UI
        UI.addTodoToList(todo);

        //Add Todo to store
        Store.addTodo(todo);
    
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