import { Manager } from "./manager";
import { JsonBannerRepo, BannerRepo } from '../repository/banner';
import { Request, Response, Application } from 'express';

class AllRoutes {
    constructor(private sourceDataType: string, private sourceDataName: string) {
        if (!sourceDataType) {
            throw Error('must provide source data type');
        }
        if (!sourceDataName) {
            throw Error('must provide source data name');
        }
    }

    public registerRoutes(app: Application) {
        let repo: BannerRepo;
        if (this.sourceDataType === 'json') {
            repo = new JsonBannerRepo(this.sourceDataName);
        } else {
            throw Error('unsupported source data type: ' + this.sourceDataType);
        }
        const m = new Manager(repo);
        app.get('/banners', (req: Request, resp: Response) => {
            resp.status(200).json({
                "error": null,
                "code": 200,
                "data": m.allBanners(),
            });
        });
        app.post('/banner', (req: Request, resp: Response) => {
            const err = m.addBanner(req.query['pic_address'] as string, req.query['module'] as string, req.query['target_address'] as string);
            if (!err) {
                resp.status(200).json({
                    "error": null,
                    "code": 200,
                    "data": "success",
                });
                return
            }
            resp.status(200).json({
                "error": err.message,
                "code": 500,
            })
        });
        app.delete('/banner', (req: Request, resp: Response) => {

        })
    }
}

export {
    AllRoutes,
};