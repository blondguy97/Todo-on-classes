class DOM {
    constructor() {
    }

    query(selector) {
        return document.querySelector(selector)
    }

    create(type, textContent, ...classNames) {
        const item = document.createElement(type);
        item.textContent = textContent;
        item.classList.add(...classNames);

        return item;
    }
}

class LocalStorage {
    #keyName;
    constructor(keyName) {
        this.#keyName = keyName;
    }

    getItemFromStorage() {
        const items = localStorage.getItem(this.#keyName);

        if (items) {
            return JSON.parse(items);
        }
        else {
            return [];
        }
    }

    setItemToStorage(itemsList) {
        localStorage.setItem(this.#keyName, JSON.stringify(itemsList))
    }
}


class Item {
    constructor(id, text) {
        this.id = id;
        this.text = text;
    }
}

class TodoItem extends Item {
    constructor(id, text, completed) {
        super(id, text);
        this.completed = completed
    }
}


class TodoApp {
    constructor() {
        this.dom = new DOM();

        this.todosStorage = new LocalStorage('todos');

        this.todoList = this.todosStorage.getItemFromStorage();

        this.todoInput = this.dom.query('[data-add-todo-input]');
        this.todoContainer = this.dom.query('[data-add-todo-container]');
        this.todoBtn = this.dom.query('[data-todo-btn]');
        this.todoStats = this.dom.query('[data-todo-stats]');
        this.removeAll = this.dom.query('[data-remove-all]');
        this.noTasks = this.dom.query('[data-no-tasks]');


        this.bindEvents();
        this.render();
    }

    counterTasks() {
        const unfinishedTasks = this.todoList.filter(todo => {
            return !todo.completed;
        })

        return unfinishedTasks.length;
    }

    addTodo(text) {
        const newTodo = new TodoItem(Date.now(), text, false);

        this.todoList.push(newTodo);

        this.todosStorage.setItemToStorage(this.todoList);

        this.render();

    }

    removeTodo(id) {
        this.todoList = this.todoList.filter(todo => {
            return todo.id !== id
        });

        this.todosStorage.setItemToStorage(this.todoList);
        this.render()
    };

    toggleTodo(id) {
        const todo = this.todoList.find(todo => {
            return todo.id === id
        })

        if (todo) {
            todo.completed = !todo.completed;
            this.todosStorage.setItemToStorage(this.todoList);
            this.render()
        }
    }

    bindEvents() {
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === "Enter" && e.target.value.trim()) {
                this.addTodo(e.target.value.trim());
                this.todoInput.value = '';
            }
        })

        this.todoBtn.addEventListener('click', (e) => {
            if (this.todoInput.value.trim()) {
                this.addTodo(this.todoInput.value.trim());
                this.todoInput.value = '';

            }
        })

        this.removeAll.addEventListener('click', () => {
            this.todoList.length = 0;
            this.todosStorage.setItemToStorage(this.todoList);
            this.render();
        })


        this.todoContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-btn')) {
                const id = Number(e.target.dataset.id);
                this.removeTodo(id);
            }
            else if (e.target.classList.contains('todo-item')) {
                const id = Number(e.target.dataset.id);
                this.toggleTodo(id);
            }
        });
    };

    render() {
        this.todoContainer.innerHTML = '';

        this.todoList.forEach(todo => {

            const todoItem = this.dom.create('div', '', 'todo-item',);

            if (todo.completed) {
                todoItem.classList.add('completed')
            }

            todoItem.dataset.id = todo.id;

            const todoitemText = this.dom.create('span', todo.text)
            const removeBtn = this.dom.create('button', 'Удалить', 'remove-btn');
            removeBtn.dataset.id = todo.id;
            removeBtn.disabled = !todo.completed;


            todoItem.append(todoitemText);
            todoItem.append(removeBtn);
            this.todoContainer.append(todoItem);
        })

        if (!this.todoList.length) {
            this.noTasks.style.display = 'block';
        }
        else {
            this.noTasks.style.display = 'none';
        }


        this.todoStats.textContent = this.counterTasks()

        if (this.todoList.length) {
            this.removeAll.style.display = 'block';
        }
        else {
            this.removeAll.style.display = 'none';

        }

    }

}

new TodoApp()