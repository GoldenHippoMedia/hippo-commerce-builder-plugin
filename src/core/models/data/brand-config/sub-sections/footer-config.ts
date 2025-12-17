import { BuilderIOFieldTypes } from '@core/models/types'

export const createFooterConfig = (): BuilderIOFieldTypes => {
  return {
    name: 'footer',
    '@type': '@builder.io/core:Field',
    friendlyName: 'Footer',
    type: 'object',
    defaultCollapsed: true,
    subFields: [
      {
        name: 'footerType',
        friendlyName: 'Type',
        type: 'select',
        enum: ['BASIC', 'MEGA', 'NONE'],
        defaultValue: 'BASIC',
        defaultCollapsed: true,
      },
    ],
  }
}
