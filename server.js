const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.post('/save', (req, res) => {
    console.log(req.body);
    const todos = req.body.todos;
    const dataDir = './data';
    // data 디렉토리가 없는 경우 생성
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }
    fs.writeFile('./data/todos.json', JSON.stringify(todos), (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error saving todos' });
        } else {
            res.json({ message: 'Todos saved successfully' });
        }
    });
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});