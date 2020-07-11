import { AddPostParams } from '../../dto/post';
import { PostRepo } from '../../repository/post';

class Manager {
    constructor(private repo: PostRepo) { }
    public listPosts(moduleKey: string, page: number, size: number) {
        return this.repo.list(moduleKey, page, size);
    }
    public createPost(p: AddPostParams): number {
        if (!p.authorId) {
            throw Error('must provide an valid author id');
        }
        if (!p.moduleKey) {
            throw Error('must provide module key');
        }
        if (!p.title) {
            throw Error('most provide title');
        }
        if (!p.content) {
            throw Error('must provide content');
        }
        return this.repo.createPost(p);
    }
    public deletePost(id: number) {
        this.repo.deletePost(id);
    }
    public getPost(id: number) {
        return this.repo.getPost(id);
    }
}

export {
    Manager,
};