import { Post } from '../model/post';

type AddPostParams = {
    moduleKey: string,
    title: string,
    content: string,
    description: string,
    authorId: number,
}
type ListPostsResp = {
    posts: Post[],
    pagination: {
        total: number,
        page: number,
        size: number,
    },
}

export {
    AddPostParams,
    ListPostsResp,
}