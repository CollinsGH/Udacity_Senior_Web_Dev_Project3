/**
 * Created by arjunMitraReddy on 7/16/2016.
 */
import express from 'express';
import zlib from 'zlib';
import compression from 'compression';
import http from 'http';
import path from 'path';
import request from 'request';
import bodyParser from 'body-parser';
import googleImages from 'google-images';

var googleSearchClient = googleImages('009016416404207732107:2wk43t8zaiu', 'AIzaSyBH5LH7IXNyN4MAAdCMv0_3Q2dmHnnuiOo');

const compressor = compression({
    flush: zlib.Z_PARTIAL_FLUSH
});

export default class Server {

    constructor(port) {
        this._app = express();
        this._port = port;
        this._appServerUp = false;
        this._appServer = http.createServer(this._app);
        this._app.use(bodyParser.urlencoded({ extended: true }));
        this._app.use(bodyParser.json());
        this._serveStaticFiles();
        this._app.post('/getRest', (req, res) => {
            var query = req.body.query;
            var options = {
                url: `https://developers.zomato.com/api/v2.1/search?q=${query}`,
                headers: {'user-key': 'e17bde5f898716f61c1e997e5011d240'}
            };
            request(options, function(err, response, body) {
                if (!err && response.statusCode == 200) {
                    res.json(JSON.parse(body, null, 4));
                }
            })
        });

        this._app.post('/getReviews', (req, res) => {
            var id = req.body.restID;
            var options = {
                url: `https://developers.zomato.com/api/v2.1/reviews?res_id=${id}`,
                headers: {'user-key': 'e17bde5f898716f61c1e997e5011d240'}
            };
            request(options, function(err, response, body) {
                if (!err && response.statusCode == 200) {
                    res.json(JSON.parse(body, null, 4));
                }
            })
        });

        this._app.get('*', (req, res) => {
            res.sendFile(path.resolve(__dirname, '../public/index.html'));
        });

    }
    _serveStaticFiles() {
        this._app.use('/js', express.static('../public/js'));
        this._app.use('/styles', express.static('../public/styles'));
        this._app.use('/imgs', express.static('../public/imgs'));
        this._app.use('/fonts', express.static('../public/fonts'));
        this._app.use('/templates', express.static('../public/templates'));
        this._app.use('/bower_components', express.static('../../bower_components'));
    }
    _listen() {
        if (!this._appServerUp) {
            this._appServer.listen(process.env.PORT || this._port, _ => {
                console.log("\n\n ***** Server Listening on localhost:" + this._port + " ***** \n\n");
            });
            this._appServerUp = true;
        }
    }
}