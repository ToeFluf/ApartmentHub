const {google} = require('googleapis')
const fs = require('fs')
const path = require('path')
const OAuth2 = require('./oauth2client.js')

function addTransaction(sheetId, updateValueArray){
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

    sheet.spreadsheets.values.get({"spreadsheetId":sheetId, "range":"Non Recurring!B1"}, (err, res)=>{
        if(err){
            return console.error(err)
        }
        console.log(res.data.values[0][0])
        var lastRow = parseInt(res.data.values[0][0]);

        let sendThis = {
            "valueInputOption":"USER_ENTERED",
            "data" : [
                {
                    "range":"Non Recurring!B1",
                    "majorDimension": "ROWS",
                    "values": [[(lastRow + updateValueArray.length)]]
                },
                {
                    "range":"Non Recurring!A" + (lastRow + 1) + ":E" + (lastRow + updateValueArray.length),
                    "majorDimension": "ROWS",
                    "values": updateValueArray
                }
            ]
        }
        sheet.spreadsheets.values.batchUpdate({"spreadsheetId":sheetId, "resource":sendThis}, (err, res)=>{
            if(err){
                return console.error(err)
            }
        })
    })
}

/*
class GoogleSheet{
    constructor(sheetID, oauthclient = null){
        var sheetId = sheetID;
        var credpath = path.join(__dirname, 'credentials');
        var scopes = [
          'https://www.googleapis.com/auth/spreadsheets'
        ];

        var oauth2client = oauthclient
        if(oauthclient == null){
            oauth2client = new OAuth2(credpath, scopes);
        }
        var auth = oauth2client.auth;

        var sheet = google.sheets({
            version:'v4',
            auth:auth
        });
        var ssData = {"sheets":[{}]};

        getSheetData();

        this.getSheetId = ()=>{return sheetId};
        this.getSheetNameArr = ()=>{return sheetNameArr};
        this.getAuth = ()=>{return auth};
        this.getAuthClient = ()=>{return oauth2client};
        this.getSheetObj = ()=>{return sheet};

        function getSheetData(){
            sheet.spreadsheets.get({spreadsheetId : sheetId},(err, res)=>{
                if(err){
                    console.log("error")
                    return console.error(err)
                }
                console.log(res.data.sheets);
                console.log(ssData.sheets[0])

                var tempJson = {};

                for(var i = 0; i < res.data.sheets.length; i++){
                    var tempJson = {};

                    tempJson.sheetName = res.data.sheets[i].properties.title;

                    console.log(tempJson.sheetName)

                    tempJson.values = new Promise((resolve, reject)=>{
                        var request = {
                                spreadsheetId:this.getSheetId(),
                                range:tempJson.sheetName+"!A1:L15",
                                majorDimension:'ROWS'
                        };
                        let sheet = this.getSheetObj();
                        sheet.spreadsheets.values.get(request, (err, res)=>{
                            if(err){
                                console.error('An error occured:\n', err)
                                return reject([err]);
                            }
                            var {status} = res;
                            if(status === 200){
                                console.log("Data Value Range Length: " + res.data.values.length)
                                return resolve(res.data.values)
                            }
                            else{
                                console.log("Status Code: " + statusCode);
                                return reject([err])
                            }
                        })
                    });
                    ssData.sheets.push(tempJson);

                }

                console.log(ssData);
            });
        }

    }

    addTransaction(){

    }
};
*/

//const SHEET_ID = '1In0y8L8Sq2hkPjwfWq9PFseEfXCAbMiuTGkMj9dtpsA';
//addTransaction(SHEET_ID, [[1,2,3,4,5,6],[1,2,3,4,5,6]])

module.exports = addTransaction
