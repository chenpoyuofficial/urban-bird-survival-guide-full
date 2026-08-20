import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/ui/Header'
import BottomNavBar from '../components/ui/BottomNavBar'
import IconButton from '../components/ui/IconButton'
import Fab from '../components/ui/Fab'
import MapPin from '../components/ui/MapPin'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import LoginRequiredNotice from '../components/ui/LoginRequiredNotice'
import MapFilterBar from '../components/features/MapFilterBar'
import mapBackground from '../assets/map/map-background.png'
import { mockNavItems, navRoutes } from '../mock/navItems'
import { useAuth } from '../context/AuthContext'

const FILTER_CATEGORIES = [
  { key: 'rescue', label: '救難', icon: 'e911_emergency', severity: 'danger' },
  {
    key: 'food',
    label: '食物',
    icon: 'fork_spoon',
    severity: 'normal',
    subTags: [
      { key: 'fruit', label: '果實', icon: 'nutrition' },
      { key: 'seed', label: '種子', icon: 'wheat' },
      { key: 'human-food', label: '人類食物', icon: 'fastfood' },
    ],
  },
  {
    key: 'warning',
    label: '警示',
    icon: 'emergency_home',
    severity: 'warning',
    subTags: [
      { key: 'construction', label: '工事', icon: 'precision_manufacturing' },
      { key: 'noise', label: '噪音', icon: 'brand_awareness' },
      { key: 'predator', label: '掠食者', icon: 'skull' },
    ],
  },
  {
    key: 'resource',
    label: '資源',
    icon: 'eco',
    severity: 'normal',
    subTags: [
      { key: 'nest', label: '安全巢洞', icon: 'grass' },
      { key: 'water', label: '乾淨水源', icon: 'water_drop' },
    ],
  },
]

// left/top are raw px offsets within the map image's native 1380x969 coordinate space
// (the image now renders unscaled via max-w-none, so px maps 1:1 — no % needed)
const mockPins = [
  { key: 'pin-1', category: 'rescue', icon: 'e911_emergency', severity: 'danger', left: 99, top: 104 },
  { key: 'pin-2', category: 'noise', icon: 'brand_awareness', severity: 'warning', left: 146, top: 360 },
  { key: 'pin-3', category: 'nest', icon: 'grass', severity: 'normal', left: 245, top: 564 },
  { key: 'pin-4', category: 'nest', icon: 'grass', severity: 'normal', left: 230, top: 400 },
  { key: 'pin-5', category: 'predator', icon: 'skull', severity: 'warning', left: 277, top: 236 },
  { key: 'pin-6', category: 'water', icon: 'water_drop', severity: 'normal', left: 347, top: 120 },
]

function Map() {
  const navigate = useNavigate()
  const { status } = useAuth()
  const [selectedMains, setSelectedMains] = useState(() => new Set())
  const [selectedSubs, setSelectedSubs] = useState({})

  if (status === 'loading') {
    return <LoadingSpinner />
  }

  if (status === 'guest') {
    return (
      <div className="flex flex-col min-h-screen bg-paper pb-24 pt-28 max-w-md mx-auto px-6 overflow-x-clip">
        <div className="fixed inset-x-0 top-0 z-10">
          <Header actionLabel="" className="mx-auto max-w-md" />
        </div>
        <LoginRequiredNotice onLoginClick={() => navigate('/login')} />
        <div className="fixed inset-x-0 bottom-0 z-10 w-full">
          <BottomNavBar
            items={mockNavItems}
            activeKey="map"
            onItemClick={(key) => navRoutes[key] && navigate(navRoutes[key])}
            className="mx-auto max-w-md"
          />
        </div>
      </div>
    )
  }

  const toggleMain = (category) => {
    setSelectedMains((prev) => {
      const next = new Set(prev)
      if (next.has(category.key)) {
        next.delete(category.key)
      } else {
        next.add(category.key)
        if (category.subTags) {
          setSelectedSubs((prevSubs) => ({
            ...prevSubs,
            [category.key]: new Set(category.subTags.map((tag) => tag.key)),
          }))
        }
      }
      return next
    })
  }

  const toggleSub = (mainKey, subKey) => {
    const nextSubs = new Set(selectedSubs[mainKey]);
    nextSubs.has(subKey)
      ? nextSubs.delete(subKey)
      : nextSubs.add(subKey);
    setSelectedSubs({ ...selectedSubs, [mainKey]: nextSubs });
    if (nextSubs.size === 0) {
      const nextMains = new Set(selectedMains);
      nextMains.delete(mainKey);
      setSelectedMains(nextMains);
    }
  }

  const activeCategories = new Set()
  FILTER_CATEGORIES.forEach((category) => {
    if (!selectedMains.has(category.key)) return
    if (!category.subTags) {
      activeCategories.add(category.key)
      return
    }
    ;(selectedSubs[category.key] ?? new Set()).forEach((subKey) => activeCategories.add(subKey))
  })

  const visiblePins =
    activeCategories.size === 0
      ? mockPins
      : mockPins.filter((pin) => activeCategories.has(pin.category))

  return (
    <div className="mx-auto flex h-screen max-w-md flex-col overflow-hidden bg-paper pb-[72px] pt-24">
      <div className="fixed inset-x-0 top-0 z-10">
        <div className="mx-auto max-w-md">
          <Header actionIcon="navigation" actionLabel="定位導航"/>
          <div className="overflow-scroll scrollbar-hide">
            <MapFilterBar
              categories={FILTER_CATEGORIES}
              selectedMains={selectedMains}
              selectedSubs={selectedSubs}
              onToggleMain={toggleMain}
              onToggleSub={toggleSub}
              className='py-2 px-2'
            />
          </div>
        </div>
      </div>
      
      <div className="relative flex-1 overflow-scroll scrollbar-hide">
        <img
          src={mapBackground}
          alt=""
          className="max-w-none"
        />
        {visiblePins.map((pin) => (
          <MapPin
            key={pin.key}
            icon={pin.icon}
            severity={pin.severity}
            position="absolute"
            className="-translate-x-1/2 -translate-y-full"
            style={{ left: `${pin.left}px`, top: `${pin.top}px` }}
            onClick={() => console.log('open pin', pin.key)}
          />
        ))}

        

        
      </div>
      
      <div className="fixed inset-x-0 bottom-0 z-10 w-full">
        <div className="mx-auto max-w-md flex flex-col">
          <div className="flex flex-col self-end items-center gap-4 pr-4 pb-4">
            <IconButton icon="explore" ariaLabel="定向" onClick={() => console.log('orient')} />
            <IconButton icon="my_location" ariaLabel="定位" onClick={() => console.log('locate')} />
            <Fab ariaLabel="新增回報" />
          </div>
          <BottomNavBar
            items={mockNavItems}
            activeKey="map"
            onItemClick={(key) => navRoutes[key] && navigate(navRoutes[key])}
            onSosClick={() => console.log('sos')}
          />
        </div>
      </div>
    </div>
  )
}

export default Map
