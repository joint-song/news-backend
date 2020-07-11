import { Manager } from "./manager";
import { JsonBannerRepo, BannerRepo } from '../../repository/banner';
import { Request, Response, Application } from 'express';

class BannerRoutes {
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
            let id = 0;
            try {
                id = m.addBanner(req.query['pic_address'] as string, req.query['module'] as string, req.query['target_key'] as string);
            } catch (error) {
                resp.status(200).json({
                    "error": error.message,
                    "code": 500,
                })
                return;
            }
            resp.status(200).json({
                "error": null,
                "code": 200,
                "data": id,
            });
        });
        app.delete('/banner', (req: Request, resp: Response) => {
            const idString = req.query.id as string || '';
            const id = parseInt(idString);
            if (id <= 0) {
                resp.status(404).json({
                    "error": "非法的id参数",
                    "code": 404,
                });
                return;
            }
            m.deleteBanner(id);
            resp.status(200).json({
                "code": 200,
            });
        })
    }
}

export {
    BannerRoutes,
};