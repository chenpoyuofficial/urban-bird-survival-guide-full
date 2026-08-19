import { Fragment } from 'react';

function PaginationDots({ count, activeIndex, onDotClick, className = '' }) {
  return (
    <div className={`flex gap-1 items-center justify-center ${className}`}>
      {Array.from({ length: count }).map((_, index) => {
        const active = activeIndex === index
        return (
          <Fragment key={index}>

            <button
              type="button"
              onClick={() => onDotClick?.(index)}
              aria-label={`前往第 ${index + 1} 區塊`}
              aria-current={active}
              className={`flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full ${
                active ? 'bg-primary text-paper shadow-strong' : ''
              }`}
            >
              {active ? (
                <span className="text-xl font-bold">{index + 1}</span>
              ) : (
                <span className="flex pb-0.5 size-8 items-center justify-center rounded-full border-[3px] border-primary bg-paper text-base font-bold text-primary shadow-soft">
                  {index + 1}
                </span>
              )}
            </button>
            {index < count - 1 && <div className="h-0.5 w-7 shrink-0 rounded-full bg-primary" />}
          </Fragment>
        )
      })}
    </div>
  )
}

export default PaginationDots
