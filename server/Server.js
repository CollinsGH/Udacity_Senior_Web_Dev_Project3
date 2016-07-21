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
import Yelp from 'yelp';

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
            var query = req.body.query.replace(" ", '%2B');
            yelp.search({ term: 'restaurant', location: query })
                .then((data) => {
                    res.json(data);
                })
                .catch((err) => {
                    console.error(err);
                });
        });
        this._app.post('/getReviews', (req, res) => {
            var id = req.body.restID;

            yelp.business(id)
                .then(((data) => {
                    res.json(data);
                }));
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
var yelp = new Yelp({
    consumer_key: '3HyZbHykh_9ScFKaFRa8uA',
    consumer_secret: 'HMGYEnperxjJz_Pta11KjxJncmw',
    token: 'g3tEIcMeOxLFH6nkZJEpF_56c5NXUWDu',
    token_secret: '8R3naCTfgk_qjoyFCC4kte0VClk'
});