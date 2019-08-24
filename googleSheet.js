const {google} = require('googleapis');
const fs = require('fs')
const path = require('path')
const OAuth2 = require('./oauth2client.js')

main();

function main(){
    const credpath = path.join(__dirname, 'credentials');
    const scopes = [
      'https://www.googleapis.com/auth/spreadsheets'
    ];

    let oauth2client = new OAuth2("/home/dschmidt/Desktop/apartment-code/ApartmentHub/credentials", scopes);
    var authorization = oauth2client.auth;
    console.log(authorization)
}
