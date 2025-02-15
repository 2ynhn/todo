const todoTitle = document.getElementById('Ytitle');
const todoDetail = document.getElementById('Ydeploy');
const todoDate = document.getElementById('Ydate');
const todoUrl = document.getElementById('Yurl');
const addButton = document.getElementById('Ysubmit');
const todoList = document.getElementById('todo-list');
const loadButton = document.getElementById('load-button');
const fileInput = document.getElementById('file-input');
const saveButton = document.getElementById('save-button');
let todos = JSON.parse(localStorage.getItem('todos')) || [];
function generateId() {
    return Math.random().toString(36).substring(2, 15);
}
function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo) => {
        const li = document.createElement('li');
        li.classList.add('li');
        li.setAttribute('id', todo.id);
        li.innerHTML = `
            <p>
                <span class="date">${todo.date}</span>
                <span class="title">${todo.title}</span>
            </p>
            <p class="url">URL: ${todo.url}</p>
            <p class="deploy"><pre>${todo.detail}</pre></p>
            <button class="delete-button" data-id="${todo.id}">삭제</button>
        `;
        todoList.appendChild(li);
    });
}
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}
addButton.addEventListener('click', () => {
    const newTodo = {
        id: generateId(),
        title: todoTitle.value,
        detail: todoDetail.value,
        date: todoDate.value,
        url: todoUrl.value,
        enden: false, // 완료 여부 (기본값: false)
    };
    todos.push(newTodo);
    saveTodos();
    renderTodos();
    todoTitle.value = '';
    todoDetail.value = '';
    todoDate.value = '';
    todoUrl.value = '';
});
todoList.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-button')) {
        const id = event.target.dataset.id;
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
    }
});
loadButton.addEventListener('click', () => {
    fileInput.click();
});
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const loadedTodos = JSON.parse(e.target.result);
            todos = loadedTodos;
            saveTodos();
            renderTodos();
        } catch (error) {
            console.error('Error loading JSON file:', error);
            alert('Invalid JSON file.');
        }
    };
    reader.readAsText(file);
});
saveButton.addEventListener('click', () => {
    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todos }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Todos saved:', data);
    });
});

renderTodos();