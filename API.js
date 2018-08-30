
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");

//define &configure app
var app = express();
// Body Parser Middleware
app.use(bodyParser.json());
//CORS Middleware

app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});
app.set('view engine', 'ejs');

app.use('./static',express.static('public'));




//connection string
var config = {
    server : 'localhost',
    user : 'TestingUser',
    password : '0000',
    database : 'TestingDb',

    options:{
        instanceName:"MSSQLSERVER"

    },
    port : 1433
};

//function to execute query
var executeQueryFunction= function (res,queryString) {
    sql.connect(config, function(err) {
        if (err) res.send(err);

        var request = new sql.Request();

        request.query(queryString, function (err, recordset) {
            if (err) {
                console.log("The Error is   : " + err);
                res.send(err);
            }
            else {
          res.send(recordset);
                sql.close();
            }
        });
    });
}



//tests server
app.get("/cb",function (req,res) {
    var query = "SELECT * FROM [cars] where [ID]=5";
   executeQueryFunction (res,query);
    console.log(result);
})

app.get("/hello",function (req,res) {
    res.send("hello I'm the server and I'm  prepared to put,delete,get and post");

})




//GET ALL
app.get("/cars", function(req , res){
    var query = "SELECT * FROM [cars]";
  executeQueryFunction (res, query);
    });


//GET BY ID
app.get("/cars/:ID", function(req , res){
    // let query = "SELECT * FROM [cars] where [ID]="+req.params.ID;
    var query = "sp_selectById "+req.params.ID;
    executeQueryFunction (res, query);
    //test api postman http://localhost:3022/cars
});

//ADD
app.post("/car/:MPG/:CYL/:ENG/:WGT", function(req , res){
     console.log("post issue");
    // var query = "INSERT INTO [cars]([MPG],[CYL],[ENG],[WGT]) VALUES
    // ("+req.body.MPG+","+req.body.CYL+","+req.body.ENG+","+req.body.WGT+")";
    var query = "INSERT INTO [cars]([MPG],[CYL],[ENG],[WGT]) VALUES ("+req.params.MPG+
        ","+req.params.CYL+
        ","+req.params.ENG+
        ","+req.params.WGT+")";
    executeQueryFunction (res, query);
    //test api postman  http://localhost:3022/post/5/5/5/5
});

//PUT
app.put('/car/:ID/:MPG/:CYL/:ENG/:WGT', function(req , res){

    var query = "UPDATE [cars] SET  [MPG]="+req.params.MPG+
        ",[CYL]="+req.params.CYL+
        ",[ENG]="+req.params.ENG+
        ",[WGT]="+req.params.WGT+
        "WHERE ID= "
        + req.params.ID;
    executeQueryFunction (res, query);
    console.log(JSON.stringify(req.params));
    //test api postman: http://localhost:3022/car/18/19667
});

//DELETE
app.delete("/cars/:ID", function(req , res){
   var query = " delete from [dbo].[cars] where  [ID]= "+req.params.ID;
    executeQueryFunction (res, query);

    //test api postman http://localhost:3022/cars/delete/5
});


//Reorder ID cars

app.get("/reorderIdOfCars", function(req , res){

    var query = " exec reorderID";
    executeQueryFunction (res, query);
    console.log("ordered");
    //test api postman http://localhost:3022/reorderIdOfCars
});




app.listen(3022);
console.log('listening at 3022');






