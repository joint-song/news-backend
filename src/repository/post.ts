import { Post } from '../model/post';
import { AddPostParams, ListPostsResp } from '../dto/post';
import { JsonRepo } from './json_repo';

interface PostRepo {
    list: (moduleKey: string, page: number, size: number) => ListPostsResp | undefined;
    createPost: (b: AddPostParams) => number;
    getPost: (id: number) => Post | undefined;
    deletePost: (id: number) => void;
}

type JsonData = {
    meta: {
        nextId: number,
    },
    posts: Post[],
}

class JsonPostRepo extends JsonRepo implements PostRepo {
    private data: JsonData;
    constructor(sourceDataDir: string) {
        super(sourceDataDir, "posts.data.json");
        const rawData = super.readJSONFile() || '{"meta": {"nextId": 1}, "posts": [], "indexes": []}';
        this.data = JSON.parse(rawData);
    }

    public list(moduleKey: string, page: number, size: number): ListPostsResp | undefined {
        if (page <= 0 || size <= 0) {
            return;
        }
        let from = (page-1)*size, to = page*size;
        let posts = this.data.posts;
        if (moduleKey) {
            posts = this.data.posts.filter(v => v.moduleKey === moduleKey);
        }
        if (posts.length < from) {
            return;
        }
        if (posts.length < to-1) {
            to = posts.length-1;
        }
        const ret: ListPostsResp = {
            posts: [],
            pagination: {
                total: posts.length,
                page,
                size,
            },
        };
        for (let i = 0; i < posts.length; i++) {
            const p = posts[i];
            if (i >= from && i <= to) {
                ret.posts.push(p);
            }
        }
        return ret;
    }

    public createPost(b: AddPostParams): number {
        const newId = this.newId();
        const time = new Date();
        this.data.posts.push({
            id: newId,
            moduleKey: b.moduleKey,
            title: b.title,
            content: b.content,
            description: b.description,
            authorId: b.authorId,
            createdAt: time,
            updatedAt: time,
        });
        super.writeFile(JSON.stringify(this.data));
        return newId;
    }

    public deletePost(id: number) {
        const b = this.data.posts.find(v => v.id === id);
        if (!b) {
            return;
        }
        this.data.posts = this.data.posts.filter(v => v.id !== id);
        super.writeFile(JSON.stringify(this.data));
    }

    public getPost(id: number): Post | undefined {
        return this.data.posts.find(v => v.id === id);
    }

    private newId(): number {
        const k = this.data.meta.nextId;
        this.data.meta.nextId++;
        return k;
    }
}

export {
    PostRepo,
    JsonPostRepo,
}