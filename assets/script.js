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
        } else {
            renderTodos(todos);
        }
    });

await fetch('./config.json')
    .then(response => response.json())
    .then(config => {
        if (config && config.users && Array.isArray(config.users)) {
            // users를 사용하여 탭 생성 및 이벤트 처리
            users = config.users;            
            usersInit(users);

            // theme css를 적용
            if(config.theme) {
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = `./assets/${config.theme}.css`; // 테마에 맞는 CSS 파일 로드
                document.head.appendChild(link);
            }
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
                tab.click();
            }
        }
    });
}

async function currentTabInit(userId) {
    const tabButtons = document.querySelectorAll('.tab');
    tabButtons.forEach(t => {
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
    todos.sort((a, b) => new Date(b.date) - new Date(a.date));  //sort by date

    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        let urlStr = ``;
        let endStr = ``;
        li.dataset.index = index;   // 데이터셋에 index 저장 (수정 시 활용)
        li.classList.add('li');
        li.setAttribute('id', todo.id);

        // deploy 파일 여부 확인
        var deployFiles;
        if(todo.detail || todo.deploy){
            deployFiles = '<button onclick="deployView(this);" class="deploy-file">Detail</button>';
        } else {
            deployFiles = '';
        }

        if(masterId === activeUser){   // master 유저 인 경우
            if(todo.url !== 'undefined' && todo.url){
                urlStr = `<a href="${todo.url}" class="url" title="${todo.url}" target="_blank">URL</a>`;
            }
            if(todo.ended !== true){
                endStr = `<button class="end-button" data-id="${todo.id}">Finish</button>`;
            } else {
                li.classList.add('ended');
            }
            
            li.innerHTML = `
                <p class="date-title">
                    <span class="date">${todo.date}</span>
                    <span class="title">${todo.title}</span>
                    ${deployFiles}
                    ${urlStr}
                </p>
                <p class="functions">
                    ${endStr}
                    <button class="edit-button" data-id="${todo.id}">Edit</button>
                    <button class="delete-button" data-id="${todo.id}">Delete</button>
                </p>
                <div class="deploy"><pre>${todo.detail}</pre></div>
            `;
            
            const editButton = li.querySelector('.edit-button');
            editButton.addEventListener('click', () => {
                li.classList.add('edit');
                li.innerHTML = `
                    <p class="date-title">
                        <input type="date" class="edit-date" value="${todo.date}">
                        <input type="text" class="edit-title" value="${todo.title}">
                        <input type="text" class="edit-url" value="${todo.url}">
                        <textarea class="edit-detail" rows="10">${todo.detail}</textarea>
                    </p>
                    <p class="functions">
                        <input type="checkbox" class="edit-ended" ${todo.ended ? 'checked' : ''}>
                        <button class="save-button" onclick="editSave()">Save</button>
                        <button class="cancel-button" onclick="editCancel()">Cancel</button>
                    </p>
                `;
            });
        } else {    // member 유저 인 경우 view만 제공공
            if(todo.url !== 'undefined' && todo.url){
                urlStr = `<a href="${todo.url}" class="url" title="${todo.url}" target="_blank">URL</a>`;
            } 
            li.innerHTML = `
                <p class="date-title">
                    <span class="date">${todo.date}</span>
                    <span class="title">${todo.title}</span>
                    ${deployFiles}
                    ${urlStr}
                </p>
                <p class="functions">
                </p>
                <div class="deploy"><pre>${todo.detail}</pre></div>
            `;
        }
        
        todoList.appendChild(li);
    });

    document.getElementById('Ydate').valueAsDate = new Date();

    // plugins init
    fetch('./config.json')
        .then(response => response.json())
        .then(config => {
            if (config && config.plugins && Array.isArray(config.plugins)) {
                const plugins = config.plugins;
                plugins.forEach(plugin => {
                    const oldScript = document.querySelector(`script[src="./assets/${plugin}"]`);
                    if (oldScript) {
                        oldScript.remove(); // 기존 script 삭제
                    }
                    const script = document.createElement('script');
                    script.src = `./assets/${plugin}`;
                    document.head.appendChild(script);
                });
            }
        })

}

// Save 버튼 클릭 이벤트
function editSave() {
    const li = document.querySelector('.li.edit');
    const index = li.dataset.index;
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
    saveTodos(); // 서버에 저장
    renderTodos(todos); // 화면 다시 렌더링
}; 

function editCancel(){
    saveTodos(); // 서버에 저장
    renderTodos(todos); // 원래 상태로 되돌리기
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
    if(!newTodo.title) {
        alert('제목을 입력해 주세요');
        return;
    }
    if(!newTodo.date) {
        alert('날짜가 없습니다. 리스트 맨 하단에 추가됩니다.');
    }
    todos.push(newTodo);
    saveTodos();
    renderTodos(todos);
    todoTitle.value = '';
    todoDetail.value = '';
    todoUrl.value = '';
});

todoList.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-button')) {
        var result = confirm("Want to delete?");
        if (result) {
            const id = event.target.dataset.id;
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
            renderTodos(todos);
        }
    }
});
todoList.addEventListener('click', (event) => {
    if (event.target.classList.contains('end-button')) {
        var result = confirm("Want to Finish?");
        if (result) {
            const id = event.target.dataset.id;
            const todo = todos.find(todo => todo.id === id);
            console.log(id)
            if (todo) {
                console.log(todo.ended)
                todo.ended = true;
                console.log(`ID: ${id} 완료 처리됨`, todo);
            }
            saveTodos();
            renderTodos(todos);
        }
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
        checkMotion();
    });
});

// UI 
function checkMotion(){
    const check = document.getElementById('save-check');
    check.classList.remove('motion');
    void check.offsetWidth;
    check.classList.add('motion');
}