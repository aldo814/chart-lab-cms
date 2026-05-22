import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'u9rob73z',
    dataset: 'production'
  },
  deployment: {
    appId: 'jyojvw6cvc5cf6t9ycba0voi',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  }
})
