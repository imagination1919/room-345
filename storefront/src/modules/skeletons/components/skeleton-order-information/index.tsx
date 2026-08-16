import SkeletonCartTotals from "@modules/skeletons/components/skeleton-cart-totals"

const SkeletonOrderInformation = () => {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-10 border-b border-ui-border-base">
        <div className="flex flex-col">
          <div className="w-32 h-4 bg-ui-bg-subtle mb-4"></div>
          <div className="w-2/6 h-3 bg-ui-bg-subtle"></div>
          <div className="w-3/6 h-3 bg-ui-bg-subtle my-2"></div>
          <div className="w-1/6 h-3 bg-ui-bg-subtle"></div>
        </div>
        <div className="flex flex-col">
          <div className="w-32 h-4 bg-ui-bg-subtle mb-4"></div>
          <div className="w-2/6 h-3 bg-ui-bg-subtle"></div>
          <div className="w-3/6 h-3 bg-ui-bg-subtle my-2"></div>
          <div className="w-2/6 h-3 bg-ui-bg-subtle"></div>
          <div className="w-1/6 h-3 bg-ui-bg-subtle mt-2"></div>
          <div className="w-32 h-4 bg-ui-bg-subtle my-4"></div>
          <div className="w-1/6 h-3 bg-ui-bg-subtle"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-10">
        <div className="flex flex-col">
          <div className="w-32 h-4 bg-ui-bg-subtle mb-4"></div>
          <div className="w-2/6 h-3 bg-ui-bg-subtle"></div>
          <div className="w-3/6 h-3 bg-ui-bg-subtle my-4"></div>
        </div>

        <SkeletonCartTotals />
      </div>
    </div>
  )
}

export default SkeletonOrderInformation
