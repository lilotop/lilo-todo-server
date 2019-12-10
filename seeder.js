let fs = require('fs');
let mongoose = require('mongoose');
let colors = require('colors');
let dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

let Todo = require('./models/Todo');

// connect to db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(()=> {
    console.log('Connected to DB');
});

console.log('Reading INPUT file');
// read json files
let todos = JSON.parse(fs.readFileSync(`${__dirname}/demo/todos.json`,'utf-8'));

console.log('Done reading INPUT files');

// import
let importData = async() => {
    try {
        await Todo.create(todos);
        console.log('Data imported.'.green.inverse);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
let deleteData = async() => {
    try {
        await Todo.deleteMany();
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
