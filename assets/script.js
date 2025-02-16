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

// users by config.json
let config, users, masterId, activeUser;

(async function(){
await fetch('/masterUserId')
    .then(response => response.json())
    .then(data => {
        if (data.masterId) {
            masterId = data.masterId;
            console.log('Master ID:', masterId);
            loadTodoData(masterId);
        } else {
            renderTodos(todos);
        }
    });

await fetch('./assets/config.json')
    .then(response => response.json())
    .then(config => {
        if (config && config.users && Array.isArray(config.users)) {
            // users를 사용하여 탭 생성 및 이벤트 처리
            users = config.users;            
            usersInit(users);

            // theme css를 적용
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = `./assets/${config.theme}.css`; // 테마에 맞는 CSS 파일 로드
            document.head.appendChild(link);
        }
    })
})();

async function usersInit(users) {
    const tabs = document.querySelector('.tabs');
    users.forEach(user => {
      if (user.active) {
        const tab = document.createElement('button');
        tab.classList.add('tab');
        tab.dataset.userId = user.id;
        tab.textContent = user.name;
        tabs.appendChild(tab);    
        tab.addEventListener('click', () => {
          const userId = tab.dataset.userId;
          loadTodoData(userId);
        });
        if (user.id == masterId) {
            tab.classList.add('active');
        }
      }
    });
}

async function currentTabInit(userId) {
    const tabButtons = document.querySelectorAll('.tab');
    tabButtons.forEach(t => {
        console.log(userId, tabButtons)
        t.classList.remove('active');
        if (t.dataset.userId == userId) {
            t.classList.add('active');
        }
    });
}

async function loadTodoData(userId) {
    try {
        const response = await fetch(`./data/${userId}.json`);
        const todoData = await response.json();
        activeUser = userId;    // activeUser = userId;
        renderTodos(todoData);
        currentTabInit(userId);
    } catch (error) {
        console.error('Error loading todo data:', error);
    }
}

function generateId() {
    return Math.random().toString(36).substring(2, 15);
}
function renderTodos(todos) {
    todoList.innerHTML = '';
    if (todos.length === 0) {
        todoList.innerHTML = '<p>No todo found.</p>';
        return;
    }
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.dataset.index = index;   // 데이터셋에 index 저장 (수정 시 활용)
        li.classList.add('li');
        li.setAttribute('id', todo.id);
        if(masterId === activeUser){   // master 유저 인 경우
            li.innerHTML = `
                <p class="date-title">
                    <span class="date">${todo.date}</span>
                    <span class="title">${todo.title}</span>
                </p>
                <p class="functions">
                    <a href="${todo.url}" class="url" title="${todo.url}" target="_blank">url</a>
                    <button class="edit-button" data-id="${todo.id}">수정</button>
                    <button class="delete-button" data-id="${todo.id}">삭제</button>
                </p>
                <div class="deploy"><pre>${todo.detail}</pre></div>
            `;
            const editButton = li.querySelector('.edit-button');
            editButton.addEventListener('click', () => {
                li.innerHTML = `
                    <input type="date" class="edit-date" value="${todo.date}">
                    <input type="text" class="edit-title" value="${todo.title}">
                    <textarea class="edit-detail">${todo.detail}</textarea>
                    <input type="checkbox" class="edit-ended" ${todo.ended ? 'checked' : ''}>
                    <input type="text" class="edit-url" value="${todo.url}">
                    <button class="save-button">Save</button>
                    <button class="cancel-button">Cancel</button>
                `;
                // Save 버튼 클릭 이벤트
                const saveButton = li.querySelector('.save-button');
                saveButton.addEventListener('click', () => {
                    const editID = li.getAttribute('id');
                    const editDate = li.querySelector('.edit-date').value;
                    const editTitle = li.querySelector('.edit-title').value;
                    const editDetail = li.querySelector('.edit-detail').value;
                    const editEnded = li.querySelector('.edit-ended').checked;
                    const editUrl = li.querySelector('.edit-url').value;

                    todos[index] = { // todos 업데이트
                        id: editID,
                        date: editDate,
                        title: editTitle,
                        detail: editDetail,
                        ended: editEnded,
                        url: editUrl
                    };

                    saveTodos(todos); // 서버에 저장
                    renderTodos(todos); // 화면 다시 렌더링
                });

                // Cancel 버튼 클릭 이벤트
                const cancelButton = li.querySelector('.cancel-button');
                cancelButton.addEventListener('click', () => {
                    renderTodos(todos); // 원래 상태로 되돌리기
                });
            });

            // Delete 버튼 클릭 이벤트
            const deleteButton = li.querySelector('.delete-button');
            deleteButton.addEventListener('click', () => {
                todos.splice(index, 1); // todos 삭제
                saveTodos(todos); // 서버에 저장
                renderTodos(todos); // 화면 다시 렌더링
            });
        } else {    // member 유저 인 경우 view만 제공공
            li.innerHTML = `
                <p class="date-title">
                    <span class="date">${todo.date}</span>
                    <span class="title">${todo.title}</span>
                </p>
                <p class="functions">
                    <a href="${todo.url}" class="url" title="${todo.url}" target="_blank">url</a>
                </p>
                <div class="deploy"><pre>${todo.detail}</pre></div>
            `;
        }
        
        todoList.appendChild(li);
    });
}
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    saveButton.click();
}
addButton.addEventListener('click', () => {
    const newTodo = {
        id: generateId(),
        title: todoTitle.value,
        detail: todoDetail.value,
        date: todoDate.value,
        url: todoUrl.value,
        ended: false, // 완료 여부 (기본값: false)
    };
    todos.push(newTodo);
    saveTodos();
    renderTodos(todos);
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
        renderTodos(todos);
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
            renderTodos(todos);
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

// UI 
document.getElementById('Ydate').valueAsDate = new Date();