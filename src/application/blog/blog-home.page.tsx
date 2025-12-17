import React, { useMemo, useState } from 'react'
import {
  HiOutlineBookOpen,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineEye,
  HiOutlineGlobeAlt,
  HiOutlineInformationCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineTag,
  HiOutlineUser,
  HiOutlineXMark,
} from 'react-icons/hi2'
import { BlogDetails } from '@utils/utils.interfaces'
import { AppTabState } from '@application/AppCore'
import { PageTypes } from '@core/models/page/page.model'
import { useObserver } from 'mobx-react'
import LoadingSection from '@components/loading-section.component'

interface BlogHomePageProps {
  state: AppTabState
}

type FilterStatus = 'all' | 'valid' | 'invalid'
type SortField = 'title' | 'lastUpdated' | 'publicationDate'
type SortOrder = 'asc' | 'desc'

const BlogHomePage: React.FC<BlogHomePageProps> = ({ state }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('lastUpdated')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [selectedBlog, setSelectedBlog] = useState<BlogDetails | null>(null)

  const blogs = useMemo(() => {
    return state.pages.filter((p) => p.pageType === PageTypes.BLOG)
  }, [state.pages])

  // Get comment counts by blog ID
  const commentCounts = useMemo(() => {
    const counts: { [blogId: string]: number } = {}
    if (state.blogComments && Array.isArray(state.blogComments)) {
      state.blogComments.forEach((comment) => {
        counts[comment.blogId] = (counts[comment.blogId] || 0) + 1
      })
    }
    return counts
  }, [state.blogComments])

  // Extract unique categories
  const availableCategories = useMemo(() => {
    const categoryMap = new Map<string, string>()
    if (!blogs || !Array.isArray(blogs)) return []
    blogs.forEach((blog) => {
      if (blog?.blog?.categories && Array.isArray(blog.blog.categories)) {
        blog.blog.categories.forEach((cat) => {
          if (cat?.name) {
            categoryMap.set(cat.name, cat.name)
          }
        })
      }
    })

    return Array.from(categoryMap.values()).sort()
  }, [blogs])

  // Filter and sort blogs
  const filteredAndSortedBlogs = useMemo(() => {
    if (!blogs || !Array.isArray(blogs)) return []

    let filtered = [...blogs]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (blog) =>
          blog?.title?.toLowerCase().includes(term) ||
          blog?.description?.toLowerCase().includes(term) ||
          blog?.blog?.title?.toLowerCase().includes(term) ||
          blog?.blog?.snippet?.toLowerCase().includes(term),
      )
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((blog) => blog?.validationStatus === filterStatus)
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((blog) => blog?.blog?.categories?.some((cat) => cat?.name === selectedCategory))
    }

    // Sort blogs
    filtered.sort((a, b) => {
      if (!a || !b) return 0

      let comparison = 0
      let aDate, bDate
      switch (sortField) {
        case 'title':
          comparison = (a.title || '').localeCompare(b.title || '')
          break
        case 'lastUpdated':
          comparison = new Date(a.lastUpdated || 0).getTime() - new Date(b.lastUpdated || 0).getTime()
          break
        case 'publicationDate':
          aDate = a.blog?.publicationDate || a.lastUpdated
          bDate = b.blog?.publicationDate || b.lastUpdated
          comparison = new Date(aDate || 0).getTime() - new Date(bDate || 0).getTime()
          break
        default:
          return 0
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [blogs, searchTerm, filterStatus, selectedCategory, sortField, sortOrder])

  const getStatusCounts = () => {
    if (!blogs || !Array.isArray(blogs)) {
      return { all: 0, valid: 0, invalid: 0 }
    }

    return {
      all: blogs.length,
      valid: blogs.filter((b) => b?.validationStatus === 'valid').length,
      invalid: blogs.filter((b) => b?.validationStatus === 'invalid').length,
    }
  }

  const statusCounts = getStatusCounts()

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A'
    try {
      return new Date(date).toLocaleDateString()
    } catch {
      return 'N/A'
    }
  }

  const openBlogModal = (blog: BlogDetails) => {
    setSelectedBlog(blog)
  }

  const handleViewBlog = (blogId: string) => {
    setSelectedBlog(null)
  }

  const handleEditBlog = (blogId: string) => {
    setSelectedBlog(null)
  }

  return useObserver(() => (
    <div className={`bg-base-100 min-h-screen rounded-lg max-w-8xl mx-auto`}>
      {/* Header */}
      <div className="bg-base-200 p-6 border-b border-base-300 rounded-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <HiOutlineBookOpen className="h-8 w-8" />
              {state.brandDetails?.name} Blog Posts
            </h1>
            <div className="text-sm text-base-content/60">
              {filteredAndSortedBlogs.length} of {blogs?.length || 0} posts
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full pl-10"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium text-base-content/80 mb-1 block">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="select select-bordered select-sm"
                >
                  <option value="all">All Categories</option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <label className="text-sm font-medium text-base-content/80 mb-1 block">Sort By</label>
                <select
                  value={`${sortField}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-') as [SortField, SortOrder]
                    setSortField(field)
                    setSortOrder(order)
                  }}
                  className="select select-bordered select-sm"
                >
                  <option value="lastUpdated-desc">Recently Updated</option>
                  <option value="lastUpdated-asc">Oldest Updated</option>
                  <option value="publicationDate-desc">Recently Published</option>
                  <option value="publicationDate-asc">Oldest Published</option>
                  <option value="title-asc">Title A-Z</option>
                  <option value="title-desc">Title Z-A</option>
                </select>
              </div>

              {/* Status Filter Tabs */}
              <div>
                <label className="text-sm font-medium text-base-content/80 mb-1 block">Status</label>
                <div className="tabs tabs-boxed tabs-sm">
                  <button
                    className={`tab ${filterStatus === 'all' ? 'tab-active' : ''}`}
                    onClick={() => setFilterStatus('all')}
                  >
                    All ({statusCounts.all})
                  </button>
                  <button
                    className={`tab ${filterStatus === 'valid' ? 'tab-active' : ''}`}
                    onClick={() => setFilterStatus('valid')}
                  >
                    Valid ({statusCounts.valid})
                  </button>
                  <button
                    className={`tab ${filterStatus === 'invalid' ? 'tab-active' : ''}`}
                    onClick={() => setFilterStatus('invalid')}
                  >
                    Invalid ({statusCounts.invalid})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="max-w-7xl mx-auto p-6">
        {filteredAndSortedBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedBlogs.map((blog) => (
              <div
                key={blog.id}
                className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => openBlogModal(blog)}
              >
                {/* Blog Thumbnail */}
                <figure className="h-48 overflow-hidden bg-base-200 flex items-center justify-center">
                  {blog.thumbnail ? (
                    <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-base-content/30">
                      <HiOutlineBookOpen className="h-12 w-12 mb-2" />
                      <span className="text-xs">No Image</span>
                    </div>
                  )}
                </figure>

                <div className="card-body p-4">
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-2">
                    <div
                      className={`badge badge-sm capitalize ${
                        blog.validationStatus === 'valid' ? 'badge-success' : 'badge-error'
                      }`}
                    >
                      {blog.validationStatus === 'valid' ? (
                        <HiOutlineCheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <HiOutlineExclamationTriangle className="h-3 w-3 mr-1" />
                      )}
                      {blog.validationStatus}
                    </div>
                    {commentCounts[blog.id] > 0 && (
                      <div className="badge badge-outline badge-xs">{commentCounts[blog.id]} comments</div>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="card-title text-base line-clamp-2">{blog.title}</h2>

                  {/* Description */}
                  {blog.description && <p className="text-sm text-base-content/70 line-clamp-3">{blog.description}</p>}

                  {/* Categories */}
                  {blog.blog?.categories && blog.blog.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {blog.blog.categories.slice(0, 3).map((cat, index) => (
                        <div key={index} className="badge badge-outline badge-xs">
                          {cat.name}
                        </div>
                      ))}
                      {blog.blog.categories.length > 3 && (
                        <div className="badge badge-outline badge-xs">+{blog.blog.categories.length - 3}</div>
                      )}
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center justify-between mt-3 text-xs text-base-content/60">
                    <div className="flex items-center gap-1">
                      <HiOutlineCalendar className="h-3 w-3" />
                      {formatDate(blog.blog?.publicationDate || blog.lastUpdated)}
                    </div>
                    {blog.blog?.author && (
                      <div className="flex items-center gap-1">
                        <HiOutlineUser className="h-3 w-3" />
                        {blog.blog.author}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {state.loadingPages ? (
              <div className="text-center py-12">
                <HiOutlineBookOpen className="h-12 w-12 text-base-content/30 mx-auto mb-4" />
                <LoadingSection size={'sm'} />
                <p className="text-sm text-base-content/50">
                  {searchTerm || filterStatus !== 'all' || selectedCategory !== 'all'
                    ? 'No posts match the current filters. Try adjusting your search criteria.'
                    : 'No blog posts available to display.'}
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <HiOutlineBookOpen className="h-12 w-12 text-base-content/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-base-content/60 mb-2">No Blog Posts Found</h3>
                <p className="text-sm text-base-content/50">
                  {searchTerm || filterStatus !== 'all' || selectedCategory !== 'all'
                    ? 'No posts match the current filters. Try adjusting your search criteria.'
                    : 'No blog posts available to display.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Blog Details Modal */}
      {selectedBlog && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <HiOutlineInformationCircle className="h-5 w-5" />
                Blog Post Details
              </h3>
              <button onClick={() => setSelectedBlog(null)} className="btn btn-ghost btn-sm">
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Header with Image */}
              <div className="flex flex-col md:flex-row gap-4">
                {selectedBlog.thumbnail && (
                  <div className="flex-shrink-0">
                    <img
                      src={selectedBlog.thumbnail}
                      alt={selectedBlog.title}
                      className="w-48 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <div className="flex items-start gap-2 mb-2">
                    <h4 className="text-xl font-bold flex-grow">{selectedBlog.title}</h4>
                    <div
                      className={`badge capitalize ${
                        selectedBlog.validationStatus === 'valid' ? 'badge-success' : 'badge-error'
                      }`}
                    >
                      {selectedBlog.validationStatus}
                    </div>
                  </div>
                  {selectedBlog.description && <p className="text-base-content/80 mb-3">{selectedBlog.description}</p>}
                  {selectedBlog.blog?.snippet && (
                    <p className="text-sm text-base-content/70">{selectedBlog.blog.snippet}</p>
                  )}
                </div>
              </div>

              {/* Issues and Warnings */}
              {(selectedBlog.issues.length > 0 || selectedBlog.warnings.length > 0) && (
                <div className="space-y-3">
                  {selectedBlog.issues.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-error mb-2 flex items-center gap-1">
                        <HiOutlineExclamationTriangle className="h-4 w-4" />
                        Issues ({selectedBlog.issues.length})
                      </h5>
                      <ul className="space-y-1">
                        {selectedBlog.issues.map((issue, index) => (
                          <li key={index} className="text-sm text-error bg-error/10 p-2 rounded">
                            • {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedBlog.warnings.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-warning mb-2 flex items-center gap-1">
                        <HiOutlineExclamationTriangle className="h-4 w-4" />
                        Warnings ({selectedBlog.warnings.length})
                      </h5>
                      <ul className="space-y-1">
                        {selectedBlog.warnings.map((warning, index) => (
                          <li key={index} className="text-sm text-warning bg-warning/10 p-2 rounded">
                            • {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Categories */}
              {selectedBlog.blog?.categories && selectedBlog.blog.categories.length > 0 && (
                <div>
                  <h5 className="font-semibold mb-2 flex items-center gap-1">
                    <HiOutlineTag className="h-4 w-4" />
                    Categories
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedBlog.blog.categories.map((cat, index) => (
                      <div key={index} className="badge badge-primary badge-outline">
                        {cat.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold mb-2">Publication Info</h5>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-medium">Author:</span> {selectedBlog.blog?.author || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Published:</span> {formatDate(selectedBlog.blog?.publicationDate)}
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span> {formatDate(selectedBlog.lastUpdated)}
                    </div>
                    <div>
                      <span className="font-medium">Comments:</span> {commentCounts[selectedBlog.id] || 0}
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-2">Technical Details</h5>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-medium">Path:</span> {selectedBlog.path}
                    </div>
                    <div>
                      <span className="font-medium">Page Type:</span> {selectedBlog.pageType}
                    </div>
                    <div>
                      <span className="font-medium">SEO Title:</span> {selectedBlog.seoTitle}
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Link */}
              {selectedBlog.previewUrl && (
                <div>
                  <h5 className="font-semibold mb-2 flex items-center gap-1">
                    <HiOutlineGlobeAlt className="h-4 w-4" />
                    Preview
                  </h5>
                  <a
                    href={selectedBlog.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-primary text-sm"
                  >
                    {selectedBlog.previewUrl}
                  </a>
                </div>
              )}
            </div>

            <div className="modal-action">
              <div className="flex flex-wrap gap-2 flex-1">
                <button onClick={() => handleViewBlog(selectedBlog.id)} className="btn btn-primary btn-sm gap-1">
                  <HiOutlineEye className="h-4 w-4" />
                  View Blog
                </button>
                <button onClick={() => handleEditBlog(selectedBlog.id)} className="btn btn-secondary btn-sm gap-1">
                  <HiOutlineInformationCircle className="h-4 w-4" />
                  Edit Blog
                </button>
              </div>
              <button onClick={() => setSelectedBlog(null)} className="btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ))
}

export default BlogHomePage
