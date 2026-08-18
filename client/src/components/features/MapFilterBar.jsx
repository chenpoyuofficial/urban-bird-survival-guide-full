import FilterChip from '../ui/FilterChip'

function MapFilterBar({
  categories,
  selectedMains,
  selectedSubs,
  onToggleMain,
  onToggleSub,
  className = '',
}) {
  return (
    <div className={`flex items-end gap-2 overflow-x-auto scrollbar-hide ${className}`}>
      {categories.map((category) => (
        <div key={category.key} className="flex shrink-0 items-end gap-1">
          <FilterChip
            icon={category.icon}
            label={category.label}
            severity={category.severity}
            selected={selectedMains.has(category.key)}
            onClick={() => onToggleMain(category)}
          />
          {category.subTags && selectedMains.has(category.key) && (
            <div className="flex shrink-0 items-center gap-1">
              {category.subTags.map((tag) => (
                <FilterChip
                  key={tag.key}
                  size="sm"
                  icon={tag.icon}
                  label={tag.label}
                  severity={category.severity}
                  selected={(selectedSubs[category.key] ?? new Set()).has(tag.key)}
                  onClick={() => onToggleSub(category.key, tag.key)}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default MapFilterBar
