import { ModelShape, ProductFilterModels } from '@core/models/types'
import { productModel } from '@core/models/data/product.model'
import { productGroupModel } from '@core/models/data/product-group.model'
import { categoryModel } from '@core/models/data/product-category.model'
import { ingredientsModel } from '@core/models/data/product-ingredients.model'
import { productTagModel } from '@core/models/data/product-tag.model'
import { useCaseModel } from '@core/models/data/product-use-case.model'
import { productGridConfigModel } from '@core/models/data/product-grid-config.model'
import { blogCategoryModel } from '@core/models/data/blog-category.model'
import { blogCommentModel } from '@core/models/data/blog-comment.model'
import { brandConfigModel } from '@core/models/data/brand-config/brand-config.model'
import { defaultWebsiteSectionModel } from '@core/models/section/default-website-section.model'
import { siteBannerModel } from '@core/models/section/site-banner.model'
import { pageModelFactory, PageModelFactoryProps } from '@core/models/page/page.model'

class BuilderIOCMSHelper {
  // Product models
  productModel(request: {
    ingredientsModelId: string
    categoryModelId: string
    tagModelId: string
    useCaseModelId: string
  }): ModelShape {
    return productModel(request)
  }

  productGroupModel(productModelId: string): ModelShape {
    return productGroupModel(productModelId)
  }

  ingredientsModel = ingredientsModel
  categoryModel = categoryModel
  productTagModel = productTagModel
  useCaseModel = useCaseModel

  // Grid config model
  productGridConfigModel(models: ProductFilterModels): ModelShape {
    return productGridConfigModel(models)
  }

  // Brand config model
  brandConfig(gridFilterModelId: string, bannerModelId: string): ModelShape {
    return brandConfigModel(gridFilterModelId, bannerModelId)
  }

  // Section models
  defaultWebsiteSection(editUrl: string): ModelShape {
    return defaultWebsiteSectionModel(editUrl)
  }

  siteBanner(editUrl: string): ModelShape {
    return siteBannerModel(editUrl)
  }

  // Page model
  pageModel(props: PageModelFactoryProps): ModelShape {
    return pageModelFactory(props)
  }

  // Blog models
  blogCommentModel(pageModelId: string): ModelShape {
    return blogCommentModel(pageModelId)
  }

  blogCategoryModel = blogCategoryModel
}

export default new BuilderIOCMSHelper()
