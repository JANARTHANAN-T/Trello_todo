   
const mysql= require('mysql')

const mysqlConnection=mysql.createConnection({
    host:"127.0.0.1",
    user:"root",
    port:3306,
    password:"",
    database:"trello",
    connectionLimit:10
})


mysqlConnection.connect((err) =>{
    if(err) console.log(err.message)
    else console.log('Connected')
})

module.exports=mysqlConnection