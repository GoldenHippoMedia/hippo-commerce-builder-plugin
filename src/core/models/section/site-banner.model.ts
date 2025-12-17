import { ModelShape } from '@core/models/types'

export const siteBannerModel = (editUrl: string): ModelShape => {
  return {
    name: 'banner',
    kind: 'component',
    displayName: 'Banner / Announcement',
    helperText: 'Banners / Announcements to display on your website',
    contentTitleField: undefined,
    fields: [
      {
        name: 'position',
        friendlyName: 'Banner Position',
        type: 'select',
        enum: ['Above Header', 'Below Header'],
        defaultValue: 'Above Header',
        helperText: 'Select where this banner should appear on the page',
        defaultCollapsed: true,
      },
    ],
    editingUrlLogic: 'return `' + editUrl + '/builder-banner-section?builder.preview=true&builder.frameEditing=true`',
  }
}
