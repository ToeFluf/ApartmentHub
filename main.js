const fs = require('fs')
const path = require('path')
const addTransaction = require('./googleSheet.js')
const process = require('process')


/*
    Command line args: google_sheet_id date store_name item_type amount purchaser
*/

/*process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});*/

if(process.argv.length != 8){
    return console.error("Invalid arg count");
}

//console.log(process.argv[2])
let val_arr = process.argv.splice(3)

addTransaction(process.argv[2], [val_arr])
console.log("\nTo look at the google sheet, go to:\nhttps://docs.google.com/spreadsheets/d/" + process.argv[2] + "/edit#gid=0\n");
// example command to access my google sheet, however requires view access to use.
//1Vii37qL4NF1NYZJ5dNCBL4Ya2bHdeghVMYkPyH7y2H4 11/6/1900 market groceries 20.00 me
