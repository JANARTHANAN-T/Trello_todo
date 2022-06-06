const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const { v4: uuidv4 } = require("uuid");
var mysql = require("mysql");
const connection = require("./database");
const app = express();
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const { ppid } = require("process");
const { CLIENT_FOUND_ROWS } = require("mysql/lib/protocol/constants/client");
const { render } = require("express/lib/response");

var mail;
var login=0;
var msg


app.get("/", (req, res) => {
    res.render("error",{login,msg});
});

app.get("/home", (req, res) => {
  const sql = `SELECT * FROM todo where email="${mail}"`;
  connection.query(sql, (err, rows, fields) => {
    if (err)
    {
        console.log(err.message);
        msg=err.message;
        res.redirect('/')
    } 
    else {
      console.log(rows);
      res.render("home", { rows,login });
    }
  });
});

app.get("/register", (req, res) => {
  res.render("register",{login});
});

app.post("/register", (req, res) => {
  let { name, email, number, password } = req.body;
  const sql = `INSERT INTO user(name,email,mobile,password) VALUES("${name}","${email}","${number}","${password}")`;
  connection.query(sql, (err, rows, fields) => {
    if (err) {
    console.log(err.message);
    msg=err.message;
    res.redirect('/')
    } 
    else {
      console.log(rows);
      res.redirect("/login");
    }
  });
});

app.get("/login", (req, res) => {
    login=0
  res.render("login",{login});
});

app.post("/login", (req, res) => {
  let { email, password } = req.body;
  var sql = `SELECT * FROM user where email="${email}" && password="${password}" `;
  connection.query(sql, (err, rows, fields) => {
    if (err)  {
        console.log(err.message);
        msg=err.message;
        res.redirect('/')
    }  else {
      mail = email;
      login=1;
      console.log(mail);
      res.redirect("/home");
    }
  });
});

app.get("/createtodo", (req, res) => {
  res.render("taskform",{login});
});

app.post("/createtodo", (req, res) => {
  let { name, description } = req.body;
  console.log(name, description, mail);
  const Id=Math.floor(1000* Math.random()*9000)
  const sql = `INSERT INTO todo(id,name,description,email) VALUES("${Id}","${name}","${description}","${mail}")`;
  connection.query(sql, (err, rows, fields) => {
    if (err)
    {
        console.log(err.message);
        msg=err.message;
        res.redirect('/')
    } 
    else {
      console.log(rows);
      res.redirect("/home");
    }
  });
});

app.get("/todo/:id", (req, res) => {
  let { id } = req.params;
  const sql = `SELECT * FROM task where todoid="${id}"`;
  connection.query(sql, (err, rows, fields) => {
    if (err)
    {
        console.log(err.message);
        msg=err.message;
        res.redirect('/')
    } 
    else {
      console.log(rows);
      res.render("todo", { rows, id, login });
    }
  });
});

app.post("/todo/:id", (req, res) => {
    let { id } = req.params;
    const sql = `DELETE FROM todo where id="${id}"`;
    connection.query(sql, (err, rows, fields) => {
        if (err)
        {
            console.log(err.message);
            msg=err.message;
            res.redirect('/')
        } 
      else {
        console.log(rows);
        res.redirect(`/home`);
      }
    });
  });

app.get("/createtask/:id", (req, res) => {
  const { id } = req.params;
  res.render("taskform1", { id, login });
});

app.post("/createtask/:id", (req, res) => {
  const { id } = req.params;
  let { name } = req.body;
  const Id=Math.floor(1000* Math.random()*9000)
  const sql = `INSERT INTO task(name,todoid,id) VALUES("${name}","${id}","${Id}")`;
  connection.query(sql, (err, rows, fields) => {
    if (err)
    {
        console.log(err.message);
        msg=err.message;
        res.redirect('/')
    } 
    else {
      console.log(rows);
      res.redirect(`/todo/${id}`);
    }
  });
});

app.post("/complete/:id1/:id2", (req, res) => {
    let { id1,id2 } = req.params;
    const sql = `UPDATE task SET status="Completed" where id="${id2}"`;
    connection.query(sql, (err, rows, fields) => {
        if (err)
    {
        console.log(err.message);
        msg=err.message;
        res.redirect('/')
    } 
      else {
        console.log(rows);
        res.redirect(`/todo/${id1}`);
      }
    });
  });

  app.post("/todo/:id1/:id2", (req, res) => {
    let { id1,id2 } = req.params;
    const sql = `DELETE FROM task where id="${id2}"`;
    connection.query(sql, (err, rows, fields) => {
        if (err)
    {
        console.log(err.message);
        msg=err.message;
        res.redirect('/')
    } 
      else {
        console.log(rows);
        res.redirect(`/todo/${id1}`);
      }
    });
  });

  app.get("/update/:id1/:id2", (req, res) => {
    const { id1,id2 } = req.params;
    const sql = `SELECT * FROM task where id="${id2}"`;
    connection.query(sql, (err, rows, fields) => {
        if (err)
    {
        console.log(err.message);
        msg=err.message;
        res.redirect('/')
    } 
      else {
        console.log(rows);
        res.render('update',{rows,id1,id2,login})
      }
    });
  });

  app.post("/update/:id1/:id2", (req, res) => {
    const { id1,id2 } = req.params;
    const {name,status}=req.body;
    const sql = `UPDATE task SET name="${name}", status="${status}"  where id="${id2}"`;
    connection.query(sql, (err, rows, fields) => {
        if (err)
    {
        console.log(err.message);
        msg=err.message;
        res.redirect('/')
    } 
      else {
        console.log(rows);
        console.log(id1,id2)
        res.redirect(`/todo/${id1}`);
      }
    });
  });




const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("Serving on port 8000");
});
