import { Model } from '@builder.io/app-context';
import { Omit } from '@material-ui/core';
import { PageModelFactoryProps } from './models/page.model';
export interface ProductFilterModels {
    categoryId: string;
    useCaseId: string;
    ingredientId: string;
    tagId: string;
}
declare class BuilderIOCMSHelper {
    private headerOptions;
    private headerConfig;
    private footerConfig;
    private featureConfig;
    private supportConfig;
    private pageConfig;
    private cookieConfig;
    private generalConfig;
    productGridConfigModel(models: ProductFilterModels): ModelShape;
    brandConfig(gridFilterModelId: string, bannerModelId: string): ModelShape;
    defaultWebsiteSection(editUrl: string): ModelShape;
    siteBanner(editUrl: string): ModelShape;
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
    pageModel(props: PageModelFactoryProps): ModelShape;
    blogCommentModel(pageModelId: string): ModelShape;
    blogCategoryModel: ModelShape;
}
declare const _default: BuilderIOCMSHelper;
export default _default;
export interface ModelShape extends Omit<Model, 'id' | 'fields'> {
    name: string;
    displayName: string;
    kind: 'data' | 'component' | 'page';
    helperText: string | undefined;
    contentTitleField: string | undefined;
    fields: BuilderIOFieldTypes[];
    editingUrlLogic?: string;
    hideFromUI?: boolean;
}
export type BuilderIOFieldTypes = BaseBuilderIOField | ListField | FileField | ReferenceField | ObjectField | NumberField | SelectField | UIBlockField;
export interface BaseBuilderIOField {
    '@type'?: '@builder.io/core:Field';
    name: string;
    friendlyName: string;
    required?: boolean;
    localized?: boolean;
    helperText?: string | undefined;
    defaultCollapsed: boolean;
    makeEntryTitle?: boolean;
    showIf?: string;
    hidden?: boolean;
    type: 'text' | 'longText' | 'html' | 'boolean' | 'color' | 'url' | 'timestamp' | 'uiBlocks' | 'map';
    defaultValue?: string | {
        '@type'?: string;
        Default?: string | number | boolean;
    };
    advanced?: boolean;
}
export interface FileField extends Omit<BaseBuilderIOField, 'type'> {
    type: 'file';
    showTemplatePicker?: boolean;
    allowedFileTypes: string[];
    copyOnAdd?: boolean;
}
export interface ReferenceField extends Omit<BaseBuilderIOField, 'type'> {
    type: 'reference';
    modelId: string;
    copyOnAdd: boolean;
    showTemplatePicker?: boolean;
}
export interface ListField extends Omit<BaseBuilderIOField, 'type'> {
    type: 'list';
    subFields: ReferenceField[] | BuilderIOFieldTypes[];
    showTemplatePicker?: boolean;
    copyOnAdd?: boolean;
}
export interface ObjectField extends Omit<BaseBuilderIOField, 'type' | 'defaultValue'> {
    type: 'object';
    subFields: BuilderIOFieldTypes[];
    defaultValue?: unknown;
}
export interface NumberField extends Omit<BaseBuilderIOField, 'type' | 'defaultValue'> {
    type: 'number';
    defaultValue: number | undefined;
}
export interface SelectField extends Omit<BaseBuilderIOField, 'type' | 'defaultValue'> {
    type: 'select';
    defaultValue?: string | {
        '@type'?: string;
        Default?: string | number | boolean;
    };
    enum: string[];
}
export interface UIBlockField extends Omit<BaseBuilderIOField, 'type' | 'defaultCollapsed' | 'friendlyName'> {
    type: 'uiBlocks';
    defaultCollapsed: boolean;
    copyOnAdd: boolean;
    friendlyName?: string;
}
