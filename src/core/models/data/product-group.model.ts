import { ModelShape } from '@core/models/types'

export const productGroupModel = (productModelId: string): ModelShape => {
  return {
    name: 'product-group',
    kind: 'data',
    displayName: 'Product Group',
    helperText: 'Groups products together for display purposes (e.g. flavors of a product)',
    contentTitleField: 'name',
    fields: [
      {
        name: 'displayName',
        friendlyName: 'Group Name',
        type: 'text',
        required: true,
        localized: true,
        defaultCollapsed: true,
      },
      {
        name: 'featuredImage',
        friendlyName: 'Featured Image',
        helperText: 'Displayed on the product card',
        type: 'file',
        showTemplatePicker: true,
        defaultCollapsed: true,
        allowedFileTypes: ['jpeg', 'png', 'svg', 'webp'],
      },
      {
        name: 'subHeading',
        friendlyName: 'Group Headline',
        type: 'text',
        localized: true,
        defaultCollapsed: true,
      },
      {
        name: 'gridTagline',
        defaultCollapsed: true,
        friendlyName: 'Grid Tagline',
        helperText:
          'By default, we use the Group Headline field. Use this to override the tagline when' +
          ' displayed on the product grid.',
        type: 'text',
        required: false,
        localized: true,
      },
      {
        name: 'shortDescription',
        friendlyName: 'Short Description',
        type: 'html',
        required: false,
        localized: true,
        defaultCollapsed: true,
      },
      {
        name: 'products',
        friendlyName: 'Products',
        type: 'list',
        required: true,
        defaultCollapsed: false,
        subFields: [
          {
            type: 'reference',
            modelId: productModelId,
            name: 'product',
            friendlyName: 'Product',
            copyOnAdd: false,
            required: true,
            defaultCollapsed: true,
          },
          {
            type: 'text',
            name: 'displayName',
            friendlyName: 'Display Name',
            helperText:
              '(Optional) Provide a custom label to display in the flavor selector for this product. If' +
              ' you do not provide a value, the product display name will be used instead.',
            required: true,
            defaultCollapsed: true,
            localized: true,
          },
          {
            type: 'boolean',
            name: 'isTrialSize',
            friendlyName: 'Trial Size?',
            helperText: 'Indicate if this product is the trial size option',
            required: false,
            defaultCollapsed: true,
          },
        ],
      },
      {
        name: 'selectionLabel',
        friendlyName: 'Option Selection Label',
        helperText: `Provide a label for the selection option (e.g. "Select your size") to use for this group`,
        type: 'text',
        localized: true,
        defaultCollapsed: true,
      },
      {
        name: 'hidden',
        friendlyName: 'Hide Group',
        type: 'boolean',
        required: false,
        localized: false,
        defaultCollapsed: true,
        helperText: 'When true, this group will not be displayed in product grids or search results for this locale',
      },
      {
        name: 'gh',
        friendlyName: 'Golden Hippo Integration Data',
        helperText: 'Stores integration data for Golden Hippo. Do not modify any of these values.',
        type: 'object',
        subFields: [
          {
            name: 'productionId',
            friendlyName: 'Production ID',
            type: 'text',
            required: true,
            localized: false,
            defaultCollapsed: true,
            helperText:
              'This is the unique identifier for this product group in the production environment. Do not modify' +
              ' this value.',
          },
          {
            name: 'slug',
            friendlyName: 'Page Slug',
            type: 'text',
            required: true,
            localized: false,
            defaultCollapsed: true,
            helperText: 'This is the URL slug for this product group.',
          },
        ],
        defaultCollapsed: true,
      },
      {
        name: 'groupType',
        friendlyName: 'Group Type',
        type: 'select',
        required: true,
        localized: false,
        defaultCollapsed: true,
        defaultValue: 'Flavor/Option Group',
        enum: ['Flavor/Option Group', 'Trial Group'],
        helperText: 'Internal name for the product group, used for identification in the CMS',
      },
      {
        name: 'name',
        friendlyName: 'Name',
        type: 'text',
        required: true,
        localized: false,
        defaultCollapsed: true,
        helperText: 'Internal name for the product group, used for identification in the CMS',
      },
    ],
  }
}
