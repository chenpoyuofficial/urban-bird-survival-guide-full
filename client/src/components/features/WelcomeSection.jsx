import { forwardRef } from 'react'

const WelcomeSection = forwardRef(function WelcomeSection(
  {
    title,
    subtitleLines = [],
    description,
    image,
    imageAlt = '',
    imageSizeClassName = '',
    imageOverlay,
    outerGapClassName = 'gap-6',
    innerGapClassName = 'gap-10',
    minHeightClassName = 'min-h-screen',
    className = '',
  },
  ref,
) {
  return (
    <section
      ref={ref}
      className={`flex ${minHeightClassName} w-full scroll-mt-28 flex-col items-center overflow-hidden px-6 ${outerGapClassName} ${className}`}
    >
      <div className={`flex flex-col items-center text-center text-ink pt-4 ${innerGapClassName}`}>
        <h1 className="text-[40px] font-bold leading-none ">{title}</h1>
        <div className="flex flex-col items-center gap-3 text-2xl font-medium">
          {subtitleLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        {description && (
          <p className="w-[366px] max-w-full text-base leading-[1.3] tracking-[0.32px]">
            {description}
          </p>
        )}
      </div>
      <div className={`relative shrink-0 ${imageSizeClassName}`}>
        <img src={image} alt={imageAlt} className="block h-full w-full object-cover" />
        {imageOverlay}
      </div>
    </section>
  )
})

export default WelcomeSection
