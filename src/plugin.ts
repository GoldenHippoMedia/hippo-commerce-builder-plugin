import { Builder } from "@builder.io/sdk";
import appState, { ApplicationContext, Model } from "@builder.io/app-context";
import { pluginId } from "./constants";
import HippoModels, { ModelShape } from "./core/HippoModels";
import HippoCMSManager from "@application/HippoCMSManager";

interface OnSaveActions {
  updateSettings(partial: Record<string, any>): Promise<void>;
}

interface AppActions {
  triggerSettingsDialog(pluginId: string): Promise<void>;
}

function getModel(name: string, models: Model[]) {
  console.log("[GH] Retrieving Model", name);
  const match = models.find((model) => model.name === name);
  console.log(`[GH] Retrieved Model for ${name} --->`, match?.id);
  return match;
}

async function setHippoModels(currentState: ApplicationContext) {
  const editUrl = getEditUrl(currentState);
  const models = currentState.models.result;
  const ingredientModel = getModel(HippoModels.ingredientsModel.name, models);
  const categoryModel = getModel(HippoModels.categoryModel.name, models);
  const tagModel = getModel(HippoModels.productTagModel.name, models);
  const useCaseModel = getModel(HippoModels.useCaseModel.name, models);
  const ingredientModelId = await setModel(
    HippoModels.ingredientsModel,
    ingredientModel,
    currentState,
  );
  const categoryModelId = await setModel(
    HippoModels.categoryModel,
    categoryModel,
    currentState,
  );
  const tagModelId = await setModel(
    HippoModels.productTagModel,
    tagModel,
    currentState,
  );
  const useCaseModelId = await setModel(
    HippoModels.useCaseModel,
    useCaseModel,
    currentState,
  );
  if (
    !ingredientModelId ||
    !categoryModelId ||
    !useCaseModelId ||
    !tagModelId
  ) {
    return;
  }
  const productModelShape = HippoModels.productModel({
    ingredientsModelId: ingredientModelId,
    categoryModelId: categoryModelId,
    useCaseModelId: useCaseModelId,
    tagModelId: tagModelId,
  });
  const productModel = getModel(productModelShape.name, models);
  const productModelId = await setModel(
    productModelShape,
    productModel,
    currentState,
  );
  if (!productModelId) return;
  const productGroupModelShape = HippoModels.productGroupModel(productModelId);
  const productGroupModel = getModel(productGroupModelShape.name, models);
  const productGroupModelId = await setModel(
    productGroupModelShape,
    productGroupModel,
    currentState,
  );
  const bannerModel = getModel(HippoModels.siteBanner(editUrl).name, models);
  const bannerModelId = await setModel(
    HippoModels.siteBanner(editUrl),
    bannerModel,
    currentState,
  );
  const blogCategoryModel = getModel(
    HippoModels.blogCategoryModel.name,
    models,
  );
  const blogCategoryModelId = await setModel(
    HippoModels.blogCategoryModel,
    blogCategoryModel,
    currentState,
  );
  if (!productGroupModelId || !bannerModelId || !blogCategoryModelId) return;
  const pageModelShape = HippoModels.pageModel({
    productModelId,
    productGroupModelId,
    categoryModelId,
    bannerModelId,
    blogCategoryModelId,
    editUrl,
  });

  const pageModel = getModel(pageModelShape.name, models);
  const pageModelId = await setModel(pageModelShape, pageModel, currentState);
  if (!pageModelId) return;
  const blogCommentModelShape = HippoModels.blogCommentModel(pageModelId);
  const blogCommentModel = getModel(blogCommentModelShape.name, models);
  if (blogCommentModel) {
    console.info(JSON.parse(JSON.stringify(blogCommentModel)));
  }
  const blogCommentModelId = await setModel(
    blogCommentModelShape,
    blogCommentModel,
    currentState,
  );
  const productGridConfigModelShape = HippoModels.productGridConfigModel({
    categoryId: categoryModelId,
    useCaseId: useCaseModelId,
    ingredientId: ingredientModelId,
    tagId: tagModelId,
  });
  const productGridConfigModel = getModel(
    productGridConfigModelShape.name,
    models,
  );
  const productGridConfigModelId = await setModel(
    productGridConfigModelShape,
    productGridConfigModel,
    currentState,
  );
  if (!productGridConfigModelId) return;
  const brandConfigModelShape = HippoModels.brandConfig(
    productGridConfigModelId,
    bannerModelId,
  );
  const brandConfigModel = getModel(brandConfigModelShape.name, models);
  const brandConfigModelId = await setModel(
    brandConfigModelShape,
    brandConfigModel,
    currentState,
  );
  const defaultWebsiteSectionModelShape =
    HippoModels.defaultWebsiteSection(editUrl);
  const defaultWebsiteSectionModel = getModel(
    defaultWebsiteSectionModelShape.name,
    models,
  );
  const defaultWebsiteSectionModelId = await setModel(
    defaultWebsiteSectionModelShape,
    defaultWebsiteSectionModel,
    currentState,
  );
  const audit = {
    productModelId: productModelId,
    groupModelId: productGroupModelId,
    ingredientsModelId: ingredientModelId,
    categoryModelId: categoryModelId,
    tagModelId: tagModelId,
    useCaseModelId: useCaseModelId,
    pageModelId: pageModelId,
    bannerModelId: bannerModelId,
    blogCommentModelId: blogCommentModelId,
    blogCategoryModelId: blogCategoryModelId,
    productGridConfigModelId: productGridConfigModelId,
    brandConfigModelId: brandConfigModelId,
    defaultWebsiteSectionModelId: defaultWebsiteSectionModelId,
  };
  console.info("[GH MODELS]", audit);
}

async function setModel(
  shape: ModelShape,
  current: Model | undefined,
  currentState: ApplicationContext,
): Promise<string | undefined> {
  const randomId = crypto.randomUUID().toString();
  try {
    // @ts-ignore
    await currentState.models.update({
      ...shape,
      id: current ? current.id : randomId,
    });
    const id = current ? current.id : randomId;
    console.log("[GH MODELS] Update Complete --->", shape.name, id);
    return id;
  } catch (e) {
    console.error(
      "Set Model Error",
      e instanceof Error
        ? {
            message: e.message,
            name: e.name,
            stack: e.stack,
          }
        : e,
    );
    console.error("Set Model Error Shape", shape.name, shape);
    // throw new Error('Unable to update model for model "' + shape.name + '"')
  }
  return current ? current.id : shape.name;
}

function getEditUrl(state: ApplicationContext): string {
  const pluginSettings =
    // @ts-expect-error not yet typed
    state.user.organization.value.settings.plugins?.get(pluginId);
  const editUrl = pluginSettings?.get("editUrl");
  return (editUrl as string) ?? "";
}

// Builder.register('editor.header', {
//   component: Header,
// })

Builder.register("plugin", {
  // id should match the name in package.json, which is why we grab it directly from the package.json
  id: pluginId,
  name: "Hippo Commerce",
  // a list of input definition that you might need to communicate with custom backend API
  settings: [
    {
      type: "select",
      enum: ["Gundry MD", "Dr. Marty", "Other"],
      name: "brand",
      friendlyName: "Brand",
      helperText:
        "Select your brand. If you select 'Other', provide your brand under the advanced settings.",
      required: true,
    },
    {
      type: "text",
      name: "editUrl",
      friendlyName: "Development Site URL",
      helperText: "Provide the URL to your development site.",
      required: true,
    },
    {
      type: "text",
      name: "apiUrl",
      friendlyName: "API URL",
      helperText: "Provide the URL to your instance of the Hippo Commerce API.",
      required: true,
    },
    {
      type: "text",
      name: "apiUser",
      friendlyName: "API User",
      helperText: "Provide your Hippo Commerce API User.",
      required: true,
    },
    {
      type: "password",
      name: "apiPassword",
      friendlyName: "API Password",
      helperText: "Provide your Hippo Commerce API Password.",
      required: true,
    },
    {
      type: "text",
      name: "otherBrand",
      friendlyName: "Custom Brand",
      helperText:
        "Provide your brand exactly as it is configured in your Hippo Commerce API.",
      required: false,
      advanced: true,
    },
  ],
  // Modify the save button text
  ctaText: "Save Changes",
  // If we need to make a request to validate anything, we could do it here.
  async onSave(actions: OnSaveActions) {
    console.info("onSave", actions);
    // update plugin setting
    await actions.updateSettings({
      hasConnected: true,
    });
    await setHippoModels(appState as ApplicationContext);
    // @ts-expect-error types are not complete
    await appState.dialogs.alert("Hippo Commerce settings saved.");
  },
});

Builder.register(
  "app.onLoad",
  async ({ triggerSettingsDialog }: AppActions) => {
    const pluginSettings = // @ts-expect-error types are not complete
      appState.user.organization.value.settings.plugins?.get(pluginId);
    const hasConnected = pluginSettings?.get("hasConnected");
    const brand = pluginSettings?.get("brand");
    const apiUser = pluginSettings?.get("apiUser");
    const apiPassword = pluginSettings?.get("apiPassword");
    const apiUrl = pluginSettings?.get("apiUrl");
    const editUrl = pluginSettings?.get("editUrl");
    if (
      !hasConnected ||
      !brand ||
      !apiUser ||
      !apiPassword ||
      !apiUrl ||
      !editUrl
    ) {
      await triggerSettingsDialog(pluginId);
    }
  },
);

Builder.register("appTab", {
  name: "Hippo Home",
  path: "hippo-home",
  component: HippoCMSManager,
  icon: "https://cdn.builder.io/api/v1/image/assets%2Fcf992cf7343c4ca182a884e9a45f394e%2F0c959f294e7f420f903a00143fe92dc3",
});
