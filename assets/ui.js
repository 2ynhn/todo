function findDetail(){
    const dom = `
        <div class="find-string">
            <input type="text" id="find_file_string" placeholder="내용 검색"> <button id="find_string">Find</button>
        </div>
    `;
}

function keywordInit(){
    const dom = `
        <div id="keywords"></div>
    `;
}

function toggleSide() {
    const buttons = document.querySelectorAll('.toggle-side');
    const side = document.querySelector('#side');
    buttons.forEach( (btn) => {
        btn.addEventListener('click', function(){
            if(side.classList.contains('expand')) {
                side.classList.remove('expand');
            } else {
                side.classList.add('expand');
            }
        });
    })
}


findDetail();
keywordInit();
toggleSide();