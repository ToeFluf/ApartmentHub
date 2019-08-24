const {google} = require('googleapis');
const fs = require('fs');
const path = require('path');
const destroyer = require('destroyer');
const http = require('http');
const https = require('https')
const url = require('url')
const qs = require('querystring')

/**
* @brief Authorization class used to manage Google's OAuth2Client
* @member folderPath = path to credentials folderPath
* @member scopes = scopes to gain access to
* @member auth = !!!important!!! this holds the authorization object once completed, otherwise is null if something fails
**/

class OAuth2Client{
    constructor(credFolder, scopes){
        this.folderPath = credFolder;
        this.scopes = scopes;
        this.auth = null;

        this.createAuth();

        try{
            let paths = path.join(this.folderPath, 'token.json');
            console.log(paths);
            fs.accessSync(paths);

            fs.readFile(path.join(this.folderPath, 'token.json'), (err, data)=>{
                if(err){
                    console.error("An error occurred when trying to read token.json");
                    return err;
                }

                const token = JSON.parse(data);
                console.log(token)

                if(token.expiry_date <= Date.now()){
                    console.error("The token has expired, attempting to use a refresh token");
                    return this.getTokenByRe_token();
                }
                this.token = token;
                this.auth.setCredentials(token);
            })
        }catch(e){
            console.error("There is no token, attempting to use a refresh token");
            return this.getTokenByRe_token();
        }

    }

    createAuth(){

        try{
            fs.accessSync(path.join(this.folderPath, 'credentials.json'));

            let data = fs.readFileSync(path.join(this.folderPath, 'credentials.json'));
            const credentials = JSON.parse(data);

            this.client_secret = credentials.web.client_secret;
            this.client_id = credentials.web.client_id;
            this.redirect_uris = credentials.web.redirect_uris;
            this.auth = new google.auth.OAuth2(this.client_id, this.client_secret, this.redirect_uris[0]);

            this.auth.on('tokens', (tokens) => {
              if (tokens.refresh_token) {
                  fs.writeFile(path.join(this.folderPath, 'refresh_token.json'), JSON.stringify(token.refresh_token), (err) => {
                          if (err) return console.error(err);
                          console.log('Refresh Token stored to', path.join(this.folderPath, 'refresh_token.json'));
                  });
                console.log(tokens.refresh_token);
              }
              console.log(tokens.access_token);
            });

        }catch(e){
            throw new Exception("No Credentials Exception");
            return console.error("Error when attempting to read from credentials file, authentication impossible");
        }

    }

    getNewToken() {
        const authorizeUrl = this.auth.generateAuthUrl({
            access_type: 'offline',
            scope: this.scopes
        });

        console.log('Authorize this app by visiting this url:', authorizeUrl);

        const server = http.createServer((req, res) => {
            if (req.url.indexOf('/oauth2callback') > -1) {
                const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
                const code = qs.get('code');

                this.auth.getToken(code, (err, token) => {
                    if (err) return console.error('Error while trying to retrieve access token', err);
                    this.auth.setCredentials(token);
                    console.log(token);

                    fs.writeFile(path.join(this.folderPath, 'token.json'), JSON.stringify(token), (err) => {
                            if (err) return console.error(err);
                            console.log('Token stored to', path.join(this.folderPath, 'token.json'));
                    });
                });

                res.end("Authentication complete, you can close the browser");
                server.close();
            }

        }).listen(3000);
        destroyer(server)

    }

    getTokenByRe_token(){
        //console.log("Skipping refresh")
        //return this.getNewToken();

        try{
            fs.accessSync(path.join(this.folderPath, 'refresh_token.json'));

            fs.readFile(path.join(this.folderPath, 'refresh_token.json'), (err,data)=>{
                if(err){
                    console.error("Error when attempting to read form 'refresh_token.json'. Reverting to getting a new token");
                    return this.getNewToken();
                }

                let {refresh_token} = JSON.parse(data);
                console.log(refresh_token);

                let options = {
                    method: 'POST',
                    url: 'http://localhost:3000/oauth/token',
                    headers: {'content-type': 'application/x-www-form-urlencoded'},
                    form: {
                        grant_type: 'refresh_token',
                        client_id: this.client_id,
                        client_secret: this.client_secret,
                        refresh_token: refresh_token
                    }
                };

                const server = http.createServer((req, res)=>{
                    console.log(req);
                    res.end(200)

                }).listen(3000, 'localhost', ()=>{
                    console.log("Listening for refresh on localhost:3000")
                })

                try{
                    let req = http.request(options, (res) => {
                        console.log(res.body);
                        var {statusCode} = res;
                        console.log(res)
                        if(statusCode === 200){
                            this.token = res.body.token;
                            this.auth.setCredentials(this.token);

                            fs.writeFile(path.join(this.folderPath, 'token.json'), JSON.stringify(this.token), (err) => {
                                    if (err) return console.error(err);
                                    console.log('Token stored to', path.join(this.folderPath, 'token.json'));
                            });
                        }
                    });
                    req.on('error', (e)=>{
                         throw e;
                    })

                    req.end();
                }
                catch(e){
                     console.log("Something went wrong with the refresh token request");
                     return console.error(e)
                }

            });


        }catch(e){
            console.error("Error when attempting to read form 'refresh_token.json'. Reverting to getting a new token");
            return this.getNewToken();
        }
    }

};


module.exports = OAuth2Client
