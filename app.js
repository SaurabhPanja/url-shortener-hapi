'use strict';

const Hapi = require('@hapi/hapi');
//env variable config
const dotenv = require('dotenv');
dotenv.config()

//database connectivity

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/urlShortner', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => console.log("Connected"));

const ShortUrl = require('./models/shortUrl')

const start = async () => {

    const server = Hapi.server({
        port: process.env.PORT,
        host: 'localhost'
    });

    await server.register(require('@hapi/vision'));

    server.views({
        engines: {
            ejs: require('ejs')
        },
        relativeTo: __dirname,
        path: 'views'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: async (request, h) => {
            let allUrls = await ShortUrl.find()
            return await h.view('index', { allUrls: allUrls })
        }
    });

    server.route({
        method: 'POST',
        path: '/',
        handler: async (request, h) => {
            let fullUrl = request.payload['full-url'];

            await ShortUrl.create({
                fullUrl: fullUrl
            }, (err) => {
                if (err) {
                    console.log(err)
                }
            });

            return h.redirect('/')
        }
    });

    server.route({
        method: 'GET',
        path: '/{shortUrl}',
        handler: async (request, h) => {
            let params_url = request.params.shortUrl 

            //exception
            if(params_url === "favicon.ico"){
                return h.redirect("/")  
            }

            const shortUrl = await ShortUrl.findOne({ shortUrl: params_url });

            shortUrl.count++;
            shortUrl.save()
            return await h.redirect(shortUrl.fullUrl)
        }
    })

    await server.start();
};

start();
