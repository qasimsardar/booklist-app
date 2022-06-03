//Task Class: Represents a Task
class Task{
    constructor(task, client, des, priority){
        this.taskName = task;
        this.client = client;
        this.des = des;
        this.priority = priority;
    }
}

//UI Class: Handles the UI tasks

class UI{
    static displayTasks(){

        const tasks = Store.getTasks();

        tasks.forEach((task) => UI.addTaskToList(task));
    }

    static addTaskToList(task){
        const list = document.getElementById('task-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${task.taskName}</td>
            <td>${task.client}</td>
            <td>${task.des}</td>
            <td>${task.priority}</td>
            <td><a href="#" class="btn btn-success btn-sm delete"><i class="fa-solid fa-circle-check"></i></a></td>
        `;

        list.appendChild(row);
    }

    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#task-form');

        container.insertBefore(div, form);

        // Vanish in 3 sec
        setTimeout(() => document.querySelector('.alert').remove(), 3000)
    }

    static clearFields(){
        document.getElementById('task-name').value = '';
        document.getElementById('client').value = '';
        document.getElementById('des').value = '';
        document.getElementById('priority').value = '';
    }

    static deleteTask(el){
        if (el.classList.contains('delete')){
            el.parentElement.parentElement.remove();

            //Remove from storage
            UI.removeTasks(el.parentElement.previousElementSibling.textContent)

            //Show success message
            UI.showAlert('Task Removed', 'success')
        }
    }

}

//Store Class: Handles Storage

class Store{
    static getTasks(){
        let tasks;
        if (localStorage.getItem('tasks') === null){
            tasks = [];
        }
        else{
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }

        return tasks;
    }
    static addTasks(task){
        const tasks = Store.getTasks();
        tasks.push(task);

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    static removeTasks(taskName){
        const tasks = Store.getTasks();

        tasks.forEach((task, index) => {
            if (task.taskName === taskName){
                tasks.splice(index, 1);
            }
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

//Event: Display Tasks

document.addEventListener('DOMContentLoaded', UI.displayTasks);

//Event: Add a Task
document.getElementById('task-form').addEventListener('submit', (e) => {

    //prevent actual submit
    e.preventDefault();

    //Get form values
    const taskName = document.getElementById('task-name').value;
    const client = document.getElementById('client').value;
    const des = document.getElementById('des').value;
    const priority = document.getElementById('priority').value;

    //validate
    if (taskName === '' || client === '' || des === '' || priority === ''){
        UI.showAlert('Please fill in all fields', 'danger')
    }
    else{
        //Instantiate task
        const task = new Task(taskName, client, des, priority);

        //Add task to UI
        UI.addTaskToList(task);

        //Add task to store
        Store.addTasks(task);

        //Show success message
        UI.showAlert('Task Added', 'success')

        //Clear Fields
        UI.clearFields();
    }

    
});


//Event: Remove a Task

document.getElementById('task-list').addEventListener('click', (e) => {
    UI.deleteTask(e.target);
});