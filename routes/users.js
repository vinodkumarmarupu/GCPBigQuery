var express = require('express');
var router = express.Router();
var JOI = require('joi');
var joi = require('../schemas/joi.validation');
var BigQuery = require('@google-cloud/bigquery');


/* GET users listing using BigQuery. */
router.get('/retrive/bigQuery', function(req, res, next) {
    var id = req.query.machine_Name;
    var limit = req.query.limit;
    var offset = req.query.offset;
    var fields = req.query.fields;
    var sqlQuery = "";
    console.log(limit);
    if (limit == undefined && offset == undefined && fields == undefined) {
        console.log("only limit");
        sqlQuery = "SELECT * FROM dataset1.Devicedata WHERE machine_Name=" + "'" + id + "'"
    } else if (limit && offset && fields == undefined) {
        console.log("limit and offset");
        sqlQuery = "SELECT * FROM dataset1.Devicedata WHERE machine_Name=" + "'" + id + "' limit " + limit + " offset " + offset
    }
    /*else if(offset && limit == undefined){
    		 console.log("only offset");
     sqlQuery = "SELECT * FROM dataset1.Devicedata WHERE machine_Name="+"'"+id+"' offset "+offset 
    	 }*/
    else if (limit && fields) {
        console.log("else");
        sqlQuery = "SELECT " + fields + " FROM dataset1.Devicedata WHERE machine_Name= " + "'" + id + "' limit " + limit

    } else if (limit && fields && offset) {
        console.log("else");
        sqlQuery = "SELECT " + fields + " FROM dataset1.Devicedata WHERE machine_Name= " + "'" + id + "' limit " + limit + " offset " + offset

    } else if (fields) {
        console.log("else");
        sqlQuery = "SELECT " + fields + " FROM dataset1.Devicedata WHERE machine_Name= " + "'" + id + "'"

    } else {
        console.log("else");
        sqlQuery = "SELECT * FROM dataset1.Devicedata WHERE machine_Name= " + "'" + id + "' limit " + limit

    }

    //const sqlQuery = "SELECT "+fields+" FROM dataset1.Devicedata WHERE machine_Name="+"'"+id+"'limit "+limit+" offset "+offset
    //console.log(sqlQuery);
    // Instantiates a client
    const bigquery = BigQuery({
        projectId: 'superb-watch-172816',
        keyFilename: './MyProject-bbc9fa271136.json'
    });

    const options = {
        query: sqlQuery,
        useLegacySql: false // Use standard SQL syntax for queries.
    };

    // Runs the query
    bigquery
        .query(options)
        .then((results) => {
            const rows = results[0];
            // printResult(rows);
            // console.log("----"+ JSON.stringify(rows))
            joiValidation(rows, joi, function(response) {

                res.send(response);
            })
        })
        .catch((err) => {
            console.error('ERROR:', err);
            res.send(err)
        });
});

var joiValidation = function(response, joi, callback) {
    JOI.validate(JSON.stringify(response), joi, function(err, value) {

        if (err) {
            callback(err);
        } else {
            callback(value);
        }
    });
};

module.exports = router;