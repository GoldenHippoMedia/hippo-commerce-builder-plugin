import { BuilderContent, BuilderElement, Component } from '@builder.io/sdk'

import { ApplicationContext, BuilderUser, Model } from '@builder.io/app-context'

type Content = BuilderContent | ContentModel

/**
 * Content model is a wrapped content JSON obejct with some
 * additional methods and a few other differences
 */
interface ContentModel extends BuilderContent {
  // Data is a mobx observable Map and not a plain object for content models
  data: Map<string, any>

  /**
   * If this is a model representing a page, this is the URL
   * assigned to it
   */
  url?: string

  /**
   * A flattened list, good for doing operations on all layers in a builer
   * page or content
   *
   * @example
   *    context.designerState.editingContentModel.allBlocks.forEach(block => {
   *      // Do some operation on all layers, e.g.
   *      if (block.component?.name === 'image') {
   *        block.component.options.set('lazy', true)
   *      }
   *    })
   */
  allBlocks?: BuilderElement[]
}

interface HttpCacheValue<ValueType = any> {
  loading: boolean
  value?: ValueType
  error?: any
}

interface BuilderOrg {
  collectionName: string
  initialized: boolean
  loading: boolean
  autoSave: boolean
  autoUpdate: boolean
  patchUpdates: boolean
  hasDocument: boolean
  value: {
    id: string
    createdDate: number
    name: string
    roles: {
      id: string
      name: string
      description: string
      options: { [key: string]: boolean }
      models: string
      projects: string
    }[]
    loadPlugins: string[]
    parentOrganization: string
    settings: {
      plugins: {
        toJSON: () => Record<string, any>
      }
    }
    siteUrl: string
    subscription: string
    type: string
    kind: string
  }
}

export interface ExtendedApplicationContext extends ApplicationContext {
  createContent(modelName: string, data: Partial<BuilderContent>): Promise<BuilderContent>
  user: {
    id: string
    displayName: string
    email: string
    photoURL: string
    uid: string
    emailVerified: boolean
    getUser(id: string): Promise<BuilderUser | null>
    listUsers(): Promise<BuilderUser[]>
    authHeaders: { [key: string]: string }
    apiKey: string
    can(permissionType: 'editCode' | 'admin' | 'editDesigns' | 'createContent'): boolean
    /**
     * Log the current user out
     */
    signOut(): void
    organizations: BuilderOrg[]
    currentOrganization: string
    data: {
      displayName: string
      email: string
      phoneNumber: null
      photoURL: string | null
      uid: string
      emailVerified: boolean
    }
    settings: {
      signupDate: number
      organizations: string[]
      roles: Record<string, string>
      jobFunctions?: string[]
      techStack: string[]
      name: string
      authProvider: string
      lastActiveTime: number
      hasCompletedOnboarding: boolean
      experiments: Record<string, boolean>
    }
  }
  httpCache: {
    /**
     * Fetch content from an API with basic caching, e.g. for react rerenders
     */
    get<ResponseType = any>(url: string, options?: RequestInit): HttpCacheValue<ResponseType>
  }
  dialogs: {
    /** Show a simple prompt dialog asking for a text input */
    prompt(options: {
      title?: string
      text?: string
      confirmText?: string
      cancelText?: string
      placeholderText?: string
      defaultValue?: string
    }): Promise<string>
    alert(text: string, title?: string): Promise<null>
  }
  models: {
    result: Model[]
    /**
     * Sync your model updates to the backend (create, edit)
     */
    update(model: Model): Promise<void>
    /**
     * Delete this model for good from the DB
     */
    remove(model: Model): Promise<void>
  }
  content: {
    /**
     * Sync the content entry to the backend (create, edit)
     */
    update(content: Content): Promise<void>
    /**
     * Delete this content entry for good from the DB
     */
    remove(content: Content): Promise<void>
  }
  designerState: {
    editingContentModel: ContentModel | null
    draggingInItem: BuilderElement | Component | string | null
    undo(): Promise<void>
    redo(): Promise<void>
    canUndo: boolean
    canRedo: boolean
    xrayMode: boolean
    editingIframeRef: null | HTMLIFrameElement
    artboardSize: {
      width: number
    }
  }
  builderComponents: Component[]
  contentEditorPage: {
    fullScreenIframe: boolean
    contentEditingMode: boolean
  }
  globalState: {
    /**
     * Show and hide global blocking "Loading..." spinner
     */
    showGlobalBlockingLoading(message?: string): void
    hideGlobalBlockingLoading(): void
    /**
     * Open a dialog
     *
     * @example
     *   const close = globalState.openDialog(
     *      <div onClick={() => close()}>
     *        Hello!
     *      </div>
     *   )
     * @returns a promise that resolves to a function to close the dialogs
     */
    openDialog(element: JSX.Element): Promise<() => void>
  }
  location: {
    /**
     * Navigate to a new URL
     *
     * @example location.go('/content')
     */
    go(relativeUrl: string): void

    /**
     * Current url path, e.g. /content/foobar
     */
    pathname: string
  }
  config: {
    darkMode: boolean
  }
}
