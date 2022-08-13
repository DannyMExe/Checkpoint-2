const express = require('express');
const router = express.Router();
const todos = require('../models/express-models/todos');
module.exports = router;

// write your routes here. Feel free to split into multiple files if you like.
router.get('/', (req, res, next) => {
    res.send(todos.listPeople());
});

router.get('/:name/tasks', async(req, res, next) => {
    if(req.query.status){
        const tasks = todos.list(req.params.name)
        let test = req.query.status === 'complete' ? tasks.filter(task => task.complete === true) : tasks.filter(task => task.complete === false);
        res.send(test)
    } else {
    try {
    const user = req.params.name;
    const users = todos.listPeople();
    if(await users.find(name => name === user)===undefined){
        res.sendStatus(404);
    } else {
    res.send(todos.list(user));
    }
    } catch (err) {
        next(err);
    }
}
});

router.post('/:name/tasks', (req, res, next) => {
    if(req.body.content===''){
        res.sendStatus(400);
    } else {
        todos.add(req.params.name, req.body)
        res.status(201).send(req.body);
    }
    });

router.put('/:name/tasks/:index', (req, res, next) => {
        todos.complete(req.params.name, req.params.index)
        res.sendStatus(200);
});

router.delete('/:name/tasks/:index', (req, res, next) => {
    todos.remove(req.params.name, req.params.index)
    res.sendStatus(204);
});
