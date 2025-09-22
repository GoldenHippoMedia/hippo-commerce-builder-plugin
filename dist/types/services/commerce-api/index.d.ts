import { IBrandSettings, IProduct } from './types';
import { HippoUser } from '@services/user-management';
declare class CommerceApi {
    private readonly brandName;
    private readonly headers;
    private readonly apiUrl;
    constructor(user: HippoUser);
    getBrandSettings(): Promise<IBrandSettings>;
    getProductFeed(): Promise<IProduct[]>;
    private buildHeaders;
    private buildRequestUrl;
}
export default CommerceApi;
