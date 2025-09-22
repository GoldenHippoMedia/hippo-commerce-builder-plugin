import { BuilderContent } from '@builder.io/sdk';
import { BlogComment, PageDetails } from '@utils/utils.interfaces';
interface FetchContentRequest {
    modelName: string;
    limit: number;
    additionalParamsString?: string;
    bustCache: boolean;
}
declare class BuilderApi {
    private readonly authHeaders;
    private readonly apiKey;
    constructor(authHeaders: {
        [p: string]: string;
    }, apiKey: string);
    getPages(bustCache?: boolean): Promise<PageDetails[]>;
    getBlogComments(): Promise<BlogComment[]>;
    fetchContent(request: FetchContentRequest): Promise<BuilderContent[]>;
}
export default BuilderApi;
