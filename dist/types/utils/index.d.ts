import { BuilderContent } from '@builder.io/sdk';
import { BlogComment, PageDetails, ValidationIssue, ValidationWarning } from './utils.interfaces';
import { IProduct } from '@services/commerce-api/types';
declare class Utils {
    static parsePages(pages: BuilderContent[]): PageDetails[];
    static errorDetails(error: ValidationIssue | ValidationWarning): ErrorDetails;
    static parseBlogComments(comments: (BuilderContent & Record<string, any>)[]): BlogComment[];
    static getProductFromCatalog(slug: string, catalog: IProduct[]): IProduct | undefined;
    private static getPdpInfo;
    private static formatProductCategories;
    private static formatProductUseCases;
    private static formatProductTags;
    private static formatProductIngredients;
}
export default Utils;
export interface ErrorDetails {
    message: string;
    errorType: 'General' | 'Blog' | 'Product' | 'SEO';
    severity: 'issue' | 'warning';
}
