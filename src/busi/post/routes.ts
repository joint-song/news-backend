import { Manager } from "./manager";
import { JsonPostRepo, PostRepo } from '../../repository/post';
import { Request, Response, Application } from 'express';

class PostRoutes {
    constructor(private sourceDataType: string, private sourceDataName: string) {
        if (!sourceDataType) {
            throw Error('must provide source data type');
        }
        if (!sourceDataName) {
            throw Error('must provide source data name');
        }
    }

    public registerRoutes(app: Application) {
        let repo: PostRepo;
        if (this.sourceDataType === 'json') {
            repo = new JsonPostRepo(this.sourceDataName);
        } else {
            throw Error('unsupported source data type: ' + this.sourceDataType);
        }
        const m = new Manager(repo);
        app.get('/posts', (req: Request, resp: Response) => {
            const module = req.query.module as string;
            const pageString = req.query.page as string;
            const page = parseInt(pageString);
            const sizeString = req.query.size as string;
            const size = parseInt(sizeString);
            if (!page || page <= 0) {
                resp.status(400).json({
                    "error": "非法的page",
                    "code": 400,
                })
                return;
            }
            if (!size || size < 0) {
                resp.status(400).json({
                    "error": "非法的size",
                    "code": 400,
                })
                return;
            }
            resp.status(200).json({
                "error": null,
                "code": 200,
                "data": m.listPosts(module, page, size),
            });
        });
        app.post('/post', (req: Request, resp: Response) => {
            let id = 0;
            try {
                const v = JSON.parse(req.body);
                if (parseInt(v.authorId) <= 0) {
                    throw Error('非法的用户id');
                }
                id = m.createPost(v);
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
        app.delete('/post', (req: Request, resp: Response) => {
            const idString = req.query.id as string || '';
            const id = parseInt(idString);
            if (id <= 0) {
                resp.status(404).json({
                    "error": "非法的id参数",
                    "code": 404,
                });
                return;
            }
            m.deletePost(id);
            resp.status(200).json({
                "code": 200,
            });
        })
        app.get('/post', (req: Request, resp: Response) => {
            const idString = req.query.id as string || '';
            const id = parseInt(idString);
            if (id <= 0) {
                resp.status(404).json({
                    "error": "非法的id参数",
                    "code": 404,
                });
                return;
            }
            const v = m.getPost(id);
            resp.status(200).json({
                "code": 200,
                "data": v,
            });
        })
    }
}

export {
    PostRoutes,
};