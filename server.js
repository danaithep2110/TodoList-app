const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const _ = require('lodash');
const cors = require('cors'); // ใช้เพื่ออนุญาตการเชื่อมต่อจากที่อยู่ IP ต่างๆ


const app = express();

app.use(cors()); // ใช้ CORS เพื่ออนุญาตการเชื่อมต่อจากพอร์ตที่ต่างกัน
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // ใช้รหัสผ่านของ MySQL root ของคุณที่นี่
    database: 'todo_list'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

app.post('/api/createtask', (req, res) => {
    const task = _.get(req, ['body', 'description']);

    try {
        if(task) {
            db.query('INSERT INTO tasks (description) VALUES(?)', [task], (err, resp) => {
                if(resp) {
                    return res.status(200).json({
                        RespCode: 200,
                        RespMessage: 'Success',
                        task: { id: resp.insertId, description: task, completed: false }
                    });
                } else {
                    console.log('ERR 2! : Bad SQL');
                    return res.status(400).json({
                        RespCode: 400,
                        RespMessage: 'Bad SQL',
                        Log: 2
                    });
                }
            });
        } else {
            console.log('ERR 1! : Invalid Request');
            return res.status(400).json({
                RespCode: 400,
                RespMessage: 'Invalid Request',
                Log: 1
            });
        }
    } catch (error) {
        console.log('ERR 0! : ', error);
        return res.status(400).json({
            RespCode: 400,
            RespMessage: 'Bad Request',
            Log: 0
        });
    }
});

app.get('/api/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, tasks) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json(tasks);
    });
});

app.delete('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    db.query('DELETE FROM tasks WHERE id = ?', [taskId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json({ message: 'Task deleted' });
    });
});

app.put('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    db.query('UPDATE tasks SET completed = ? WHERE id = ?', [req.body.completed, taskId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json({ message: 'Task updated' });
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});

module.exports = app;
