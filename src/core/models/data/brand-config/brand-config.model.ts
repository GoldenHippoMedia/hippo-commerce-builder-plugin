import { ModelShape } from '@core/models/types'

import {
  createCookieConfig,
  createFeatureConfig,
  createFooterConfig,
  createGeneralConfig,
  createHeaderConfig,
  createPageConfig,
  createSupportConfig,
} from '@core/models/data/brand-config/sub-sections'

export const brandConfigModel = (gridFilterModelId: string, bannerModelId: string): ModelShape => {
  return {
    name: 'gh-brand-config',
    kind: 'data',
    displayName: 'Brand Configuration',
    helperText: 'Manage global features and settings for your website',
    contentTitleField: undefined,
    fields: [
      ...createGeneralConfig(bannerModelId),
      createHeaderConfig(),
      createFooterConfig(),
      createFeatureConfig(gridFilterModelId),
      createSupportConfig(),
      createPageConfig(),
      createCookieConfig(),
    ],
  }
}
