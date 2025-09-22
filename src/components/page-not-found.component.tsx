import React from 'react'
import { HiOutlineExclamationTriangle, HiOutlineHome } from 'react-icons/hi2'
import { AppTabState, PageOption } from '@application/AppCore'
import { useObserver } from 'mobx-react'

interface Props {
  state: AppTabState
  className?: string
}

const PageNotFound: React.FC<Props> = ({ state, className = '' }) => {
  return useObserver(() => (
    <div className={`bg-base-100 flex items-center justify-center px-4 ${className}`}>
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="mb-8">
          <HiOutlineExclamationTriangle className="h-24 w-24 text-warning mx-auto mb-4" />
          <div className="text-6xl font-bold text-base-content mb-2">404</div>
          <div className="text-xl font-semibold text-base-content/80">Page Not Found</div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <p className="text-base-content/60 mb-4">
            {`Sorry, the page you're looking for doesn't exist or has been moved.`}
          </p>
          <p className="text-sm text-base-content/50">
            {`It's possible it's still under construction. However, if you see
            this error frequently, please notify your administrator.`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => state.setPage(PageOption.HOME)} className="btn btn-primary gap-2">
            <HiOutlineHome className="h-4 w-4" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  ))
}

export default PageNotFound
