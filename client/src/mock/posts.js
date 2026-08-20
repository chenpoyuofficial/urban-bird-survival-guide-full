// 假模式（連不到伺服器）用的固定展示資料
// tag/boardName 需對齊真實的固定清單（PostTag enum、4 個固定看板），避免展示跟真實系統矛盾的內容
export const mockRecommendedPosts = [
  {
    id: 'post-1',
    authorName: '愛吃櫻桃的小綠',
    createdAt: '2 小時前',
    tag: '注意',
    boardName: '生存指南',
    title: '亞灣區某新蓋大樓玻璃帷幕反射太強，經過請減速繞道！',
    excerpt:
      '今天早上沿著輕軌線飛過亞灣區那幾棟新大樓時，差點撞上高空大片落地窗，海天一色的反射真的太逼真了...。請南高雄的大家互相提醒家族成員，特別是剛學飛的幼鳥，經過那一帶盡量貼近公園樹冠層，安全第一！',
    likeCount: 596,
    commentCount: 42,
    likedByMe: false,
  },
  {
    id: 'post-2',
    authorName: '衛武營的阿強',
    createdAt: '20 分鐘前',
    tag: '揪團',
    boardName: '日常分享',
    title: '週末美術館生態池「雀躍穀物」野餐大會，高捷直達有人要跟嗎？',
    excerpt:
      '約好幾隻老朋友這週末在美術館生態池辦野餐大會，現場會有穀物分享跟賞鳥導覽，高捷直達生態園區站，走路五分鐘就到，還有位置歡迎揪團！',
    likeCount: 56,
    commentCount: 15,
    likedByMe: true,
  },
  {
    id: 'post-3',
    authorName: '澄清湖翠鳥哥',
    createdAt: '昨天',
    tag: '好康',
    boardName: '覓食情報',
    title: '澄清湖後門私人果園的桑椹熟透了，根本吃不完！',
    excerpt:
      '低調分享！澄清湖後山小路進去的那片私人果園，最近紫黑色的桑椹掉了一地，果肉甜到不行而且完全沒有農藥。今天早上我和家族成員去那裡吃到肚子圓滾滾才飛得動，趁果農還沒來採收，大家趕快衝一波！',
    likeCount: 954,
    commentCount: 88,
    likedByMe: false,
  },
  {
    id: 'post-4',
    authorName: '柴山老白頭',
    createdAt: '5 小時前',
    tag: '閒聊',
    boardName: '日常分享',
    title: '今天在西子灣被猴子搶走嘴邊的麵包屑，氣死我了！',
    excerpt:
      '大家評評理！我好不容易在中山大學長椅下發現一塊剛掉落的波羅麵包屑，才剛準備開動，旁邊的獼猴竟然一巴掌就把整塊奪走。現在的猴子連鳥類的點心都要搶了嗎？有沒有北高雄的鳥友要一起組隊去討公道？',
    likeCount: 2234,
    commentCount: 176,
    likedByMe: false,
  },
]
