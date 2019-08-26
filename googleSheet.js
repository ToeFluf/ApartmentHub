const {google} = require('googleapis')
const fs = require('fs')
const path = require('path')
const OAuth2 = require('./oauth2client.js')

class GoogleSheet{
    constructor(sheetID){
        var sheetId = sheetID;
        var credpath = path.join(__dirname, 'credentials');
        var scopes = [
          'https://www.googleapis.com/auth/spreadsheets'
        ];

        var oauth2client = new OAuth2(credpath, scopes);
        var auth = oauth2client.auth;

        var sheet = google.sheets({
            version:'v4',
            auth:auth
        });
        var sheetNameArr = [];
        getSheetIds()

        this.sheetId = ()=>{return sheetId};
        this.getSheetNameArr = ()=>{return sheetNameArr};
        this.getAuth = ()=>{return auth};
        this.getAuthClient = ()=>{return oauth2client};
        this.getSheetObj = ()=>{return sheet};

        function getSheetIds(){
            sheet.spreadsheets.get({spreadsheetId : sheetId},(err, res)=>{
                if(err){
                    console.log("error")
                    return console.error(err)
                }
                console.log(res.data.sheets)
                for(var i = 0; i < res.data.sheets.length; i++){
                    sheetNameArr.push(res.data.sheets[i].properties.title);
                }
                return console.log(sheetNameArr);
            });
        }

    }

    determineBalance(){

    }

    addTransaction(){

    }
};


const SHEET_ID = '1In0y8L8Sq2hkPjwfWq9PFseEfXCAbMiuTGkMj9dtpsA';
const gs = new GoogleSheet(SHEET_ID);
var sheet = gs.getSheetObj();
var sheetArr = gs.getSheetNameArr();
console.log(sheet)
console.log(sheetArr)
