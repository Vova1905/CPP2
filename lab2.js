const mongoose = require("mongoose");
const express = require("express");
const app = express();
const jsonParser = express.json();

const Schema = mongoose.Schema;
const taskScheme = new Schema({name: String, description: String, state: String}, {versionKey: false});
const Task_ = mongoose.model("Task", taskScheme);

const PORT = process.env.PORT || 3000;
app.use(express.static(__dirname + "/public"));

const localUrl = "mongodb://localhost:27017/tasksdb";
const mongoUrl = process.env.MONGODB_URI || localUrl;

mongoose.connect(mongoUrl, { useNewUrlParser: true }, function(err){
    if(err) return console.log(err);

    app.listen(PORT, function(){
        console.log(`App started on http://localhost:${PORT}`);
    });
});

app.get("/api/tasks", function(req, res){
    Task_.find({}, function(err, tasks){
        if(err) return console.log(err);
        res.send(tasks)
    });
});

app.get("/api/tasks/:id", function(req, res){
    const id = req.params.id;

    Task_.findOne({_id: id}, function(err, task){
        if(err) return console.log(err);
        res.send(task);
    });
});

app.post("/api/tasks", jsonParser, function (req, res) {
    if(!req.body) return res.sendState(400);

    const taskName = req.body.name;
    const taskDescription = req.body.description;
    const taskState = req.body.state;
    const task = new Task_({name: taskName, description: taskDescription, state: taskState});

    task.save(function(err){
        if(err) return console.log(err);
        res.send(task);
    });
});

app.delete("/api/tasks/:id", function(req, res){
    const id = req.params.id;

    Task_.findByIdAndDelete(id, function(err, task){

        if(err) return console.log(err);
        res.send(task);
    });
});

app.put("/api/tasks", jsonParser, function(req, res){
    if(!req.body) return res.sendState(400);

    const id = req.body.id;
    const taskName = req.body.name;
    const taskDescription = req.body.description;
    const taskState = req.body.state;
    const newTask = {description: taskDescription, name: taskName, state: taskState};

    Task_.findOneAndUpdate({_id: id}, newTask, {new: true}, function(err, task){
        if(err) return console.log(err);
        res.send(task);
    });
});
