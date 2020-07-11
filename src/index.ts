import express from 'express';
import { AllRoutes } from './banner/routes';
import env from './env/env';
import cors from 'cors';

// Create a new express app instance
const app = express();
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200,
}));

app.get('/status', function (req, res) {
    res.status(200).json({
        "timestamp": new Date().toString(),
        "status": "OK",
    });
});

(function () {
    if (!env.sourceDataName) {
        throw Error('provide SOURCE_DATA_NAME env');
    }
    if (env.storageType === undefined) {
        throw Error('provide SOURCE_DATA_TYPE env');
    }
    new AllRoutes(env.storageType, env.sourceDataName).registerRoutes(app);
})();

// app.settings
app.listen(3000, function () {
    console.log('App is listening on port 3000!');
});