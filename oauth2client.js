const {google} = require('googleapis');
const fs = require('fs');
const path = require('path');
const destroyer = require('destroyer');
const http = require('http');
const https = require('https')
const url = require('url')
const qs = require('querystring')
//const Buffer = require('buffer')

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

        this.createAuth();

        try{
            let paths = path.join(this.folderPath, 'token.json');
            fs.accessSync(paths);

            let data = fs.readFileSync(path.join(this.folderPath, 'token.json'));
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
            console.log(credentials)

            this.client_secret = credentials.web.client_secret;
            this.client_id = credentials.web.client_id;
            this.redirect_uris = credentials.web.redirect_uris;
            this.auth = new google.auth.OAuth2(this.client_id, this.client_secret, this.redirect_uris[0]);
            console.log(this.auth)

            this.auth.on('tokens', (token) => {
                if (token.refresh_token) {
                      let saveReToken = {
                            "refresh_token":token.refresh_token
                      }

                      fs.writeFile(path.join(this.folderPath, 'refresh_token.json'), JSON.stringify(saveReToken), (err) => {
                              if (err) return console.error(err);
                              console.log('Refresh Token stored to', path.join(this.folderPath, 'refresh_token.json'));
                      });
                      console.log(token.refresh_token);
                    }

                    if(token.access_token){
                        fs.writeFile(path.join(this.folderPath, 'token.json'), JSON.stringify(token), (err) => {
                              if (err) return console.error(err);
                              console.log('Token stored to', path.join(this.folderPath, 'token.json'));
                        });
                        console.log(token.access_token);
                    }
            });

        }catch(e){
            throw new Exception("No Credentials Exception");
            return console.error("Error when attempting to read from credentials file, authentication impossible");
        }

    }

    getNewToken() {
        const authorizeUrl = this.auth.generateAuthUrl({
            access_type: 'offline',
            scope: this.scopes,
            approval_prompt:'force'
        });

        console.log('Authorize this app by visiting this url: ', authorizeUrl);

        const server = http.createServer((req, res) => {
            if (req.url.indexOf('/oauth2callback') > -1) {
                const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
                const code = qs.get('code');

                this.auth.getToken(code, (err, token) => {
                    if (err){
                        throw err;
                        return console.error('Error while trying to retrieve access token\n', err);
                    }

                    this.auth.setCredentials(token);
                    console.log(token);
                });
                console.log(this.auth)

                res.end("Authentication complete, you can close the browser");
                server.close();
            }

        }).listen(3000, 'localhost');
    }

    getTokenByRe_token(){

        try{
            fs.accessSync(path.join(this.folderPath, 'refresh_token.json'));

            let data = fs.readFileSync(path.join(this.folderPath, 'refresh_token.json'));

            let {refresh_token} = JSON.parse(data);
            console.log(refresh_token)

            this.auth.setCredentials({
                refresh_token:refresh_token
            })
            console.log(this.auth)

        }catch(e){
            console.error("Error when attempting to read form 'refresh_token.json'. Reverting to getting a new token");
            console.error(e)
            return this.getNewToken();
        }

    }
};

module.exports = OAuth2Client
