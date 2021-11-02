const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mysql = require('mysql2');
const util = require('util');
const path= require('path');
const cors = require('cors');
const multer= require('multer');
const connection = require('express-myconnection');
const fs= require('fs');
const { resolveSoa } = require('dns');



//imagen mostrada 




const db = mysql.createPool({

    host: 'localhost',
    user: 'root',
    password: 'Admin12345..',
    database: 'opa',


});

db.getConnection((err, connection) => {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.');
      }
      if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has too many connections.');
      }
      if (err.code === 'ECONNREFUSED') {
        console.error('Database connection was refused.');
      }
    }
    
    if (connection) connection.release();
  
    return;
  });

  db.query = util.promisify(db.query);


app.use(cors());




//alamcena la imagen en la carpeta 
const storage= multer.diskStorage({

    destination: path.join(__dirname, '/imagenes'),

    filename: function(req,file,cb){
        cb(null,Date.now() +'-' + file.originalname)
    }
 
})

app.post('/imagenes',async (req, res) => {
    try{
        let upload = multer({storage:storage}).single('avatar');

        upload(req, res, function(err){

            if(!req.file){
                return res.send("seleccion algo")
            } else if (err instanceof multer.MulterError){
                return  res.send(err)
            } else if (err){
                return res.send(err);
            }

             let sql = "INSERT INTO  imagen (logo,name) VALUES (?,?)";


             db.query(sql, [req.file.filename,req.file.filename], (err, results) => { 
                  if (err) throw err;
			 	res.json({ success: 1 })  
             });

        });

    }catch (err) {console.log(err)}
    
});



app.get('/imagenes',async (req, res) => {
   
       
    let sql = "SELECT * FROM  imagen";
     db.query(sql, (err, rows) => { 
        if (err) throw err;

        

        const imagedir= fs.readdirSync(path.join(__dirname, '/dbimagenes'))
       
        res.json(imagedir)


        console.log(fs.readdirSync(path.join(__dirname, '/dbimagenes')))
			   
               

    });
 
    
});
































// imagenes 






app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/login", (req, res) => {

    const sqlGet = "SELECT * FROM login";
    db.query(sqlGet, (error, result) => {

        res.send(result);
    })
})

app.post('/lol',  (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
    const sqllol="SELECT * FROM login WHERE username = ? AND password = ?";

    db.query(sqllol, [username, password], (err, results) => {

        if (err) {

            res.send({err:err} );
        } else{

            if(results.length > 0){
                res.send(results)
            } else{

                res.send({message:"user / password no found"} );
            }
        }





    })



})




app.get("/get", (req, res) => {

    const sqlGet = "SELECT * FROM empleados";
    db.query(sqlGet, (error, result) => {

        res.send(result);
    })
})

app.post("/post", (req, res) => {

    const { first_name, last_name, company_id, email, phone } = req.body;
    const sqlInsert = "INSERT INTO empleados (first_name,last_name,company_id,email,phone) VALUES (?,?,?,?,?)";
    db.query(sqlInsert, [first_name, last_name, company_id, email, phone], (error, result) => {

        if (error) {
            console.log(error);
        }
    })

})


app.delete('/remove/:id', (req, res) => {

    const { id } = req.params;
    const sqlRemove = "DELETE FROM empleados WHERE id=?";
    db.query(sqlRemove, id, (error, result) => {

        if (error) {
            console.log(error);
        }
    })

})


app.get("/get/:id", (req, res) => {
    const { id } = req.params;
    const sqlGet = "SELECT * FROM empleados where id=?";
    db.query(sqlGet, id, (error, result) => {
        if (error) {

            console.log(error);
        }
        res.send(result);
    })
})

app.put("/update/:id", (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, company_id, email, phone } = req.body;
    const sqlUpdate = "UPDATE empleados SET first_name=?, last_name=?, company_id=?,email=?, phone=? WHERE id=?";
    db.query(sqlUpdate, [first_name, last_name, company_id, email, phone, id], (error, result) => {
        if (error) {

            console.log(error);
        }
        res.send(result);
    })
})

//Empresas 

app.get("/gete", (req, res) => {

    const sqlGet = "SELECT * FROM empresas";
    db.query(sqlGet, (error, result) => {

        res.send(result);
    })
})



app.post("/poste", (req, res) => {

    const { name, email, logo, website } = req.body;
    const sqlInsert = "INSERT INTO empresas (name,email,logo,website) VALUES (?,?,?,?)";
    db.query(sqlInsert, [name, email, logo, website], (error, result) => {

        if (error) {
            console.log(error);
        }
    })

})


app.delete('/removee/:id', (req, res) => {

    const { id } = req.params;
    const sqlRemove = "DELETE FROM empresas WHERE id=?";
    db.query(sqlRemove, id, (error, result) => {

        if (error) {
            console.log(error);
        }
    })

})


app.get("/gete/:id", (req, res) => {
    const { id } = req.params;
    const sqlGet = "SELECT * FROM empresas where id=?";
    db.query(sqlGet, id, (error, result) => {
        if (error) {

            console.log(error);
        }
        res.send(result);
    })
})



app.put("/updatee/:id", (req, res) => {
    const { id } = req.params;
    const { name, email, logo, website } = req.body;
    const sqlUpdate = "UPDATE empresas SET name=?, email=?, logo=?, website=? WHERE id=?";
    db.query(sqlUpdate, [name, email, logo, website, id], (error, result) => {
        if (error) {

            console.log(error);
        }
        res.send(result);
    })
})






app.listen(5000, () => {

    console.log("corriendo en el puerto 5000")

})