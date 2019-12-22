let fs = require('fs');
let mongoose = require('mongoose');
let colors = require('colors');
let dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

if(process.env.NODE_ENV !== 'development') {
    console.error('Not allowed to run this script outside development environment!'.bgRed);
    return;
}

let User = require('./models/User');
let Todo = require('./models/Todo');
let Project = require('./models/Project');

// connect to db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(()=> {
    console.log('Connected to DB');
});

console.log('Reading INPUT files');
// read json files
let users = JSON.parse(fs.readFileSync(`${__dirname}/demo/users.json`,'utf-8'));
let projects = JSON.parse(fs.readFileSync(`${__dirname}/demo/projects.json`,'utf-8'));
let todos = JSON.parse(fs.readFileSync(`${__dirname}/demo/todos.json`,'utf-8'));

console.log('Done reading INPUT files');

// import
let importData = async() => {
    try {
        await User.create(users);
        await Todo.create(todos);
        await Project.create(projects);
        console.log('Data imported.'.green.inverse);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
let deleteData = async() => {
    try {
        await User.deleteMany();
        await Todo.deleteMany();
        await Project.deleteMany();
        console.log('Data deleted!'.red.inverse);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

if(process.argv[2] === '-i'){
    importData();
}
if(process.argv[2] === '-d'){
    deleteData();
}

