const {google} = require('googleapis')
const fs = require('fs')
const path = require('path')
const OAuth2 = require('./oauth2client.js')



class GoogleSheet{
    constructor(sheetId){
        var sheetID = sheetId;
        var credpath = path.join(__dirname, 'credentials');
        var scopes = [
          'https://www.googleapis.com/auth/spreadsheets'
        ];

        var oauth2client = new OAuth2("/home/dschmidt/Desktop/apartment-code/ApartmentHub/credentials", scopes);
        var auth = oauth2client.auth;
        var sheet = google.sheets({
            version:'v4',
            auth:auth
        });
        this.getSheetId = ()=>{return sheetID;}
        this.getAuth = ()=>{return auth;}
        this.getAuthClient = ()=>{return oauth2client;}
    }

    determineBalance(){

    }

    addTransaction(){

    }
};


const SHEET_ID = '1In0y8L8Sq2hkPjwfWq9PFseEfXCAbMiuTGkMj9dtpsA';
const gs = new GoogleSheet(SHEET_ID);
console.log(gs.getAuth())
console.log(gs.getAuthClient())
