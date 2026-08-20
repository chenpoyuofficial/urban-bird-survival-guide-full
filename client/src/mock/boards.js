import raisingChicksImg from '../assets/boards/raising-chicks.jpg'
import survivalGuideImg from '../assets/boards/survival-guide.jpg'
import dailySharingImg from '../assets/boards/daily-sharing.jpg'
import foragingInfoImg from '../assets/boards/foraging-info.jpg'

// 真實看板只有這 4 個固定清單（見 CLAUDE.md），name 需跟後端 seed 資料一致，
// 圖片是純前端展示用素材，資料庫沒有這個欄位
export const boardImagesByName = {
  育雛資訊: raisingChicksImg,
  生存指南: survivalGuideImg,
  日常分享: dailySharingImg,
  覓食情報: foragingInfoImg,
}

// 假模式（連不到伺服器）用的固定展示資料
export const mockBoards = [
  { id: 'raising-chicks', title: '育雛資訊', image: raisingChicksImg, heat: '2.2k', postCount: 95 },
  { id: 'survival-guide', title: '生存指南', image: survivalGuideImg, heat: '1.3k', postCount: 64 },
  { id: 'daily-sharing', title: '日常分享', image: dailySharingImg, heat: '5.7k', postCount: 258 },
  { id: 'foraging-info', title: '覓食情報', image: foragingInfoImg, heat: '0.6k', postCount: 35 },
]
