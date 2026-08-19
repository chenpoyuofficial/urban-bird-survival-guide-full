import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/ui/Header'
import WelcomeSection from '../components/features/WelcomeSection'
import WelcomePageNav from '../components/features/WelcomePageNav'
import welcomeBoardImg from '../assets/welcome/welcome-board.png'
import welcomeMapImg from '../assets/welcome/welcome-map.png'
import welcomeChatImg from '../assets/welcome/welcome-chat.png'
import welcomeChatBadgeIcon from '../assets/welcome/welcome-chat-badge.svg'
import welcomeAlertImg from '../assets/welcome/welcome-alert.png'
import welcomeRegisterImg from '../assets/welcome/welcome-register.png'

const sections = [
  {
    key: 'board',
    title: '熱絡的文章討論',
    subtitleLines: ['高雄鳥友的專屬聚落', '分享每一次與羽毛朋友的驚喜相遇'],
    description:
      '不論是在衛武營拍到鳥友飛翔的英姿，還是在家門口撿到落巢小麻雀的驚慌，這裡有一群最懂鳥、最熱心的在地鳥友。發文、留言、交換心得，讓我們一起用文字紀錄港都最繽紛的翼下生態！',
    image: welcomeBoardImg,
    imageAlt: '討論區介紹插圖',
    imageSizeClassName: 'w-[568px] h-[310px]',
    className: 'pt-28'
  },
  {
    key: 'map',
    title: '即時的地圖資訊',
    subtitleLines: ['只要打開地圖', '城市裡的鳥類情報一目了然'],
    description:
      '哪裡的構樹果實熟了？哪裡正在修剪路樹需要注意？透過精準的 GPS 定位與多彩膠囊標籤，輕鬆掌握附近的救難、食物、資源與警示事件。因地制宜，讓你隨時化身守護城市野鳥的巡邏員。',
    image: welcomeMapImg,
    imageAlt: '地圖介紹插圖',
    imageSizeClassName: 'w-[588px] h-[320px]',
  },
  {
    key: 'chat',
    title: '輕鬆的親友聯繫',
    subtitleLines: ['藉由地緣結交新隊友', '讓賞鳥、救鳥的路上不再孤單'],
    description:
      '「手邊備有紙箱與毛巾，澄清湖附近需要支援請啾我！」設定你的常用棲地與個人簡介，一鍵發現身邊志同道合的附近鳥友。無論是交流攝影設備，還是緊急出動支援，最可靠的夥伴就在你身邊。',
    image: welcomeChatImg,
    imageAlt: '聊天室介紹插圖',
    imageSizeClassName: 'w-[550px] h-[300px]',
    imageOverlay: (
      <div className="absolute left-[249px] top-[61px] flex h-[41px] w-[65px] items-center justify-center rounded-full bg-[#f3dec3] p-2.5">
        <img src={welcomeChatBadgeIcon} alt="" className="h-[21px] w-[45px]" />
      </div>
    ),
  },
  {
    key: 'alert',
    title: '危險的緊急通報',
    subtitleLines: ['生命關鍵時刻', '全區長按，黃金救援秒速出動'],
    description:
      '遇到危急困難、或是需要重大野鳥救援？一鍵啟動 SOS 避難系統。系統會自動帶入你的精準經緯度與白話文地點，第一時間向你的 6 位黃金救援隊友直接發送通報。全螢幕橘色長按撤銷設計，慌亂中也能安心操作。',
    image: welcomeAlertImg,
    imageAlt: '警報介紹插圖',
    imageSizeClassName: 'w-[520px] h-[284px]',
  },
  {
    key: 'register',
    title: '事不宜遲，趕快加入',
    subtitleLines: ['張開雙翼團結萬名在地鳥友', '一起成為港都野鳥最強大的後盾'],
    image: welcomeRegisterImg,
    imageAlt: '立即註冊插圖',
    imageSizeClassName: 'w-[682px] h-[373px]',
    outerGapClassName: 'gap-[78px]',
    innerGapClassName: 'gap-[51px]',
    minHeightClassName: 'min-h-[calc(100vh-120px)]',
  },
]

function Welcome() {
  const navigate = useNavigate()
  const sectionRefs = useRef([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(entry.target)
            if (index !== -1) setActiveIndex(index)
          }
        })
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )

    sectionRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const scrollToSection = (index) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-md overflow-x-clip bg-paper">
      <div className="fixed inset-x-0 top-0 z-10">
        <Header
          actionIcon="login"
          actionLabel="登入"
          onActionClick={() => navigate('/login')}
          className="mx-auto max-w-md"
        />
      </div>

      {sections.map((section, index) => {
        const isLastSection = index === sections.length - 1
        return (
          <WelcomeSection
            key={section.key}
            ref={(el) => {
              sectionRefs.current[index] = el
            }}
            title={section.title}
            subtitleLines={section.subtitleLines}
            description={section.description}
            image={section.image}
            imageAlt={section.imageAlt}
            imageSizeClassName={section.imageSizeClassName}
            imageOverlay={
              isLastSection ? (
                <div className="absolute top-36 inset-0 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="flex size-[120px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-secondary pt-0.5 text-2xl font-bold leading-tight text-paper shadow-strong"
                  >
                    立即註冊
                  </button>
                </div>
              ) : (
                section.imageOverlay
              )
            }
            outerGapClassName={section.outerGapClassName}
            innerGapClassName={section.innerGapClassName}
            minHeightClassName={section.minHeightClassName}
            className={section.className}
          />
        )
      })}

      <div className="fixed inset-x-0 bottom-6 z-10">
        <WelcomePageNav
          count={sections.length}
          activeIndex={activeIndex}
          onDotClick={scrollToSection}
          onRegisterClick={() => navigate('/register')}
          showRegisterCta={activeIndex !== sections.length - 1}
          className="mx-auto max-w-md"
        />
      </div>
    </div>
  )
}

export default Welcome
