(function(){
    // 공통 함수수
    toggleSide();
    findDetail();
    keywordInit();
    dateColorize();

    // master, user 별 함수
    if (masterId == activeUser) {
        uptodate();
    } else {
    
    }
})();

// 다음날자로 변경
function uptodate(){
    const li = document.querySelectorAll('.li');
    li.forEach( (item) => {
        const upBtn = `
            <div class="fn-update"><button>Set to Next Day</button></div>
        `;
        item.insertAdjacentHTML("beforeend", upBtn);
        const btn = item.querySelector('.fn-update button');
        btn.addEventListener('click', function(){
            const thisID = item.getAttribute('id');
            const today = item.querySelector('.date').innerHTML;
            const nextday = new Date(today);
            nextday.setUTCDate(nextday.getUTCDate() + 1);
            const next = nextday.toISOString().substr(0,10);
            todos.map(function(a){
                if(a.id == thisID) {
                    a.date = next;
                }
            });
            saveTodos();
            window.location.reload();
        });
    });
}

// colorize date and Marking by {dateArr}
function dateColorize (){
    // get dates
    let dateArr = [];   // result [-3day, -2day, yesterday, today, tomorrow, +2day, +3day]
    const dateCalc = 86400000;    // 1 day is 86400000
    let dateSets_i = -3;
    while(dateSets_i < 4){      // before 3days ~ next 3day
        var yyyy, dd, mm;
        var dateTemp = new Date(new Date().getTime() + (dateCalc*dateSets_i));
        yyyy = dateTemp.getFullYear();
        mm = dateTemp.getMonth() + 1;
        dd = dateTemp.getDate();
        mm < 10 ? mm = '0' + mm : mm = mm;
        dd < 10 ? dd = '0' + dd : dd = dd;
        var curDate = yyyy + '-' + mm + '-' + dd;        
        dateArr.push(curDate);
        dateSets_i ++;
    };

    const lists = document.querySelectorAll('.li');
    let keywords = [];
    lists.forEach( (that) => {
        var date = that.querySelector('.date');
        var k = 0;
        while(k < dateArr.length){
            if(date.innerHTML === dateArr[k]){
                that.classList.add('day-in' + (k - 3));
                break;
            }
            k++;
        }

        // keywords 추출
        // var title = that.find('span.title');
        // if(title.text().indexOf('[') > -1 && title.text().indexOf(']') > -1 ) {
        //     var keywordOrigin = title.text().match(/\[.*\]/gi);
        //     keywordOrigin += '';
        //     var keyword = keywordOrigin.split('[').join('');
        //     keyword = keyword.split(']').join('');
        //     if(keyword.indexOf(',') > -1) {
        //         keyword = keyword.replace(/\s/g, '');
        //         var keys = keyword.split(',');
        //         keywords = keywords.concat(keys);
        //         keywords = keywords.filter((item, pos) => keywords.indexOf(item) === pos);
        //     } else if(keywords.indexOf(keyword) === -1) {
        //         keywords.push(keyword);	
        //     }

        //     // li에 keyword가 있으면 class추가
        //     for(var n = 0; n < keywords.length; n++){
        //         if(keywordOrigin.indexOf(keywords[n]) > -1) {
        //             that.addClass('key-' + n);
        //         }
        //     }
        // }
    });

}



// keywords 버튼 추가
// for(var j=0; j < keywords.length; j++){
//     $('<a href="#" class="keyword" key_value="key-' + j + '">' + keywords[j] + '</a>')
//     .appendTo($('#keywords'))
//     .bind('click', function(){
//         var that = $(this);
//         var keyclass = that.attr('key_value');
//         if(that.hasClass('active')){
//             that.removeClass('active');
//             $('.li.' + keyclass).removeClass('list-checked');
//         } else {
//             that.addClass('active');
//             $('.li.' + keyclass).addClass('list-checked');
//         }
//         return false;
//     });
// }

// // copy string lists
// $('.copy-lists .copy-string').bind('click', function(){
//     var string = $(this).text();
//     copycont(string);
// })

// // find string
// $('#find_string').bind('click', function(){
//     var query = $('#find_file_string').val();
//     findFiles(query);
// });





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


