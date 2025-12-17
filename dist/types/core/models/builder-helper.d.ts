import { ModelShape, ProductFilterModels } from '@core/models/types';
import { PageModelFactoryProps } from '@core/models/page/page.model';
declare class BuilderIOCMSHelper {
    productModel(request: {
        ingredientsModelId: string;
        categoryModelId: string;
        tagModelId: string;
        useCaseModelId: string;
    }): ModelShape;
    productGroupModel(productModelId: string): ModelShape;
    ingredientsModel: ModelShape;
    categoryModel: ModelShape;
    productTagModel: ModelShape;
    useCaseModel: ModelShape;
    productGridConfigModel(models: ProductFilterModels): ModelShape;
    brandConfig(gridFilterModelId: string, bannerModelId: string): ModelShape;
    defaultWebsiteSection(editUrl: string): ModelShape;
    siteBanner(editUrl: string): ModelShape;
    pageModel(props: PageModelFactoryProps): ModelShape;
    blogCommentModel(pageModelId: string): ModelShape;
    blogCategoryModel: ModelShape;
}
declare const _default: BuilderIOCMSHelper;
export default _default;
