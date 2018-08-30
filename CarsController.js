/**
 * Created by Wael-52236988 on 23/08/2018.
 */

var express =require('express');
var parser=require('body-parser');
var path = require('path');
var app = express();
app.set('view engine','ejs');
app.use(parser.urlencoded({extended:false}));
app.use(parser.json());
app.set('views',path.join(__dirname,'./views'));

//default
app.get('/',function (req,res) {
    //order th id's
    var request1 = require('request');
    urlCustom='http://localhost:3022/reorderIdOfCars/';
    var options1= {
        url:urlCustom,
        method: 'GET'
    };
    request1(options1,function (error,response,body) {
console.log("Ordered ID")
    });

    res.render('allCars',{msg:"Cars Manager ",datas:[]});
});

//get car by id
app.post('/getCarByid', function (req, res) {
    var  i = req.body.cid;
    var request = require('request');
    var urlCustom='http://localhost:3022/cars/'+i;
    console.log("url requested --------- > ",urlCustom);
    var options = {
        url:urlCustom,
        method: 'GET'
    };
    request(options, function(error, response, body) {
        var  jsonData = JSON.parse(body);
        var car=[];
        console.log("API result --------- > ",jsonData['recordset']);
        car=jsonData['recordset'];
        var ml="";
            if (car.length===0) {
                ml= "The car with the id : "+i+"   does not exist";
            } else {
                ml=  "Car Number  :  "+i+"   ";
            }
        res.render('allCars', {msg:ml,datas:car}
        );
    });
})
//get all cars
app.post('/getAllCars',function (req,res) {
    var request = require('request');
    urlCustom='http://localhost:3022/cars/';
    var options= {
        url:urlCustom,
        method: 'GET'
    };
    request(options,function (error,response,body) {
        var jsonData= JSON.parse(body);
        var allCars=[];
        for (var i = 0; i < jsonData['recordset'].length; i++) {
            allCars[i]= jsonData['recordset'][i];
        }
        // console.log(jsonData['recordset'])
        res.render('allCars',{msg:"Cars Manager",datas:allCars});
    })
})
//delete car
app.post('/deleteCar', function (req, res) {
    var i= JSON.parse(req.body.idToDelete);
    console.log("gonna delete here",i);

    var request = require('request');
    var urlCustom='http://localhost:3022/cars/'+i;
    console.log("url requested --------- > ",urlCustom);

    var options = {
        url:urlCustom,
        method: 'DELETE'
    };
    request(options, function(error, response, body) {
        var  jsonData = JSON.parse(body);
        res.render('allCars',
            {msg:("The car number " +i+" is deleted successfully!"),datas:[]}
        );
    });
})

//edit car by id
app.post('/editCar', function (req, res) {

    var  i = req.body.idToEdit;
    console.log(i);
    var request = require('request');
    var urlCustom='http://localhost:3022/cars/'+i;
    console.log("url requested --------- > ",urlCustom);
    var options = {
        url:urlCustom,
        method: 'GET'
    };
    request(options, function(error, response, body) {
        var  jsonData = JSON.parse(body);
        var car=[];
        console.log("API result --------- > ",jsonData['recordset']);
        car=jsonData['recordset'];
        console.log("to be edited :-------------->",car[0]);

        res.render('Edit', {msg:"editing a car ",data:car[0]}
        );
    });

})

//Save edited car
app.post('/saveEditedCar',function (req,res) {

    var  id =req.body.IDname ;
   var mpg=req.body.MPGname;
   var cyl=req.body.CYLname;
    var eng=req.body.ENGname;
    var wgt=req.body.WGTname;
    var request = require('request');
    var urlCustom='http://localhost:3022/car/'+id+'/'+mpg+'/'+cyl+'/'+eng+'/'+wgt;
    console.log("url requested --------- > ",urlCustom);
    var options = {
        url:urlCustom,
        method: 'PUT'
    };
    request(options, function(error, response, body) {
console.log("saved");
        res.render('allCars', {msg:"edited successfully ",datas:[]}
        );
    });

})

//addCar
app.get('/addCar',function (req,res) {
    console.log("have to add");
    res.render('Add', {msg:"adding a car ",data:[]} );
})

//Save added car
app.post('/saveAddedCar',function (req,res) {

    var mpg=req.body.MPGname;
    var cyl=req.body.CYLname;
    var eng=req.body.ENGname;
    var wgt=req.body.WGTname;
    console.log("?????",mpg,'---',cyl,'---',eng,'---',wgt);
    var request = require('request');
    var urlCustom='http://localhost:3022/car/'+mpg+'/'+cyl+'/'+eng+'/'+wgt;
    console.log("url requested --------- > ",urlCustom);
    var options = {
        url:urlCustom,
        method: 'POST'
    };
    request(options, function(error, response, body) {
        console.log("saved");
        res.render('allCars', {msg:"added successfully ",datas:[]}
        );
    });
})


/*
//show formChart
app.get('/chart',function (req,res){
    var  i = req.body.idCC;
    console.log(i);
    res.render('chart', {
            msg:"choose a car"
            ,MPG:0
            ,CYL: 0
            ,ENG: 0
            ,WGT:0,cars:[]
        }
    );

});*/
//show chart with get
app.get('/Charts',function (req,res) {


    var request = require('request');
    var urlCustom='http://localhost:3022/cars/';
    console.log("url requested --------- > ",urlCustom);
    var options = {
        url:urlCustom,
        method: 'GET'
    };
    request(options, function(error, response, body) {
        var  jsonData = JSON.parse(body);
        var car=[];
        console.log("API result ----- > ",jsonData['recordset']);
        car=jsonData['recordset'];

        res.render('chart', {
            msg:"cars"
            ,MPG: 0
            ,CYL: 0
            ,ENG: 0
            ,WGT:0
            ,ID:0
            ,cars:car}
        );



    });
})


//show chart page from cars page
app.post('/goToCharts',function (req,res) {


    var request = require('request');
    var urlCustom='http://localhost:3022/cars/';
    console.log("url requested --------- > ",urlCustom);
    var options = {
        url:urlCustom,
        method: 'GET'
    };
    request(options, function(error, response, body) {
        var  jsonData = JSON.parse(body);
        var car=[];
        console.log("API result ----- > ",jsonData['recordset']);
        car=jsonData['recordset'];

        res.render('chart', {
            msg:"cars"
            ,MPG: 0
            ,CYL: 0
            ,ENG: 0
            ,WGT:0
            ,ID:0
            ,cars:car}
        );



    });
})



//get Chart By Id
app.post('/chartById',function (req,res) {
    var i= req.body.idCC;



   var request = require('request');
    var urlCustom='http://localhost:3022/cars/'+i;
    var options = {
        url:urlCustom,
        method: 'GET'
    };
    request(options, function(error, response, body) {
        var  jsonData = JSON.parse(body);
        var car=[];
       // console.log("API result ----- > ",jsonData['recordset']);
        car=jsonData['recordset'];

        var ml='Car number '+i;
        res.render('chart', {
                msg:ml
                ,MPG: car[0]['MPG']
                ,CYL: car[0]['CYL']
                ,ENG: car[0]['ENG']
                ,WGT:car[0]['WGT']
            ,ID:car[0]['ID']
            ,cars:[]}
        );
  });
})

app.listen(5656,function () {
    console.log('app is listening 5656');
})