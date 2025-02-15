const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const config = JSON.parse(fs.readFileSync('./assets/config.json', 'utf8'));
const users = config.users;
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/todo/:userId', (req, res) => {
    const userId = req.params.userId;
    const filePath = `./data/${userId}.json`;  
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        res.status(500).json({ error: 'Failed to load todo data.' });
        return;
      }
      res.json(JSON.parse(data));
    });
});

app.get('/masterUserId', (req, res) => {
    // config.json 파일에서 master role을 가진 user의 id를 찾습니다.
    const masterUser = users.find(user => user.role === 'master');
    if (masterUser) {
        res.json({ masterId: masterUser.id });
    } else {
        res.status(404).json({ message: 'Master user not found.' });
    }
});

app.post('/save', (req, res) => {
    console.log(req.body);
    const todos = req.body.todos;
    const dataDir = './data';
    // data 디렉토리가 없는 경우 생성
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }
    const masterUser = users.find(user => user.role === 'master');
    if(masterUser){
        const fileName = `${masterUser.id}.json`;
        const filePath = `${dataDir}/${fileName}`;
        fs.writeFile(filePath, JSON.stringify(todos, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Error saving todos' });
            } else {
                res.json({ message: 'Todos saved successfully' });
            }
        });
    } else {
        res.status(404).json({ message: 'Master user not found.' });
    }
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});