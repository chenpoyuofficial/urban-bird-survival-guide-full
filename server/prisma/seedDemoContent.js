// 一次性的展示用資料腳本：建立 30 個使用者、100 篇文章、隨機分佈的讚。
// 跟 seed.js（固定看板清單）分開，因為這裡是「展示內容」而非「必須存在的固定資料」，
// 不具備 upsert 冪等性——重複執行會再新增 100 篇文章（使用者則是 upsert，不會重複建立）。
import 'dotenv/config'
import bcrypt from 'bcrypt'
import prisma from '../lib/prisma.js'

const SALT_ROUNDS = 10
const DEMO_PASSWORD = 'password123'
const POST_COUNT = 100
const USER_COUNT = 30
const TAGS = ['注意', '好康', '閒聊', '求助', '心得', '目擊', '揪團', '交易', '提問', '公告']

const NICKNAMES = [
  '柴山老白頭', '澄清湖翠鳥哥', '衛武營的阿強', '愛吃櫻桃的小綠', '旗津海風麻雀',
  '西子灣夕陽鷺鷥', '蓮池潭夜鷺姐', '美術館生態池常客', '鳥松濕地巡邏員', '援中港的黑冠麻鷺',
  '洲仔濕地觀察日誌', '愛河沿岸綠繡眼', '中山大學後山鳥仔', '港灣生態公園值日生', '大東的樹鵲頭目',
  '高雄都會公園導覽鳥', '軍艦路的老鷹眼', '凹仔底賞鳥仔', '半屏山五色鳥', '本館路珠頸斑鳩',
  '龍崎夜巡貓頭鷹', '大樹果園翠鳥', '橋頭糖廠伯勞鳥', '田寮月世界候鳥', '茄萣濕地黑面琵鷺迷',
  '彌陀漁港鸕鶿觀察員', '永安鹽田水鳥控', '興達港夕陽組', '林園海岸線巡守', '梓官漁港覓食隊',
]

const LOCATIONS = [
  '澄清湖', '蓮池潭', '旗津海岸', '西子灣', '柴山', '衛武營都會公園', '美術館生態池',
  '中山大學校園', '高雄都會公園', '鳥松濕地', '援中港濕地', '港灣生態公園', '愛河沿岸',
  '洲仔濕地', '大東文化藝術中心',
]

const SPECIES = [
  '麻雀', '白頭翁', '五色鳥', '翠鳥', '夜鷺', '小白鷺', '紅嘴黑鵯', '大捲尾',
  '綠繡眼', '樹鵲', '珠頸斑鳩', '黑冠麻鷺', '灰鶺鴒', '紅尾伯勞', '領角鴞',
]

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

function randomPastDate(maxDaysAgo) {
  const now = Date.now()
  const offsetMs = Math.random() * maxDaysAgo * 24 * 60 * 60 * 1000
  return new Date(now - offsetMs)
}

const TEMPLATES = {
  育雛資訊: [
    ({ loc, sp }) => ({
      title: `${loc}發現一窩${sp}幼鳥，求前輩指點怎麼顧`,
      content: `今天在${loc}散步時發現樹洞裡有一窩剛孵化的${sp}寶寶，爸媽好像還在附近覓食，想請問有經驗的鳥友，這種情況要不要幫忙介入，還是靜靜觀察就好？`,
    }),
    ({ loc, sp }) => ({
      title: `${sp}媽媽在${loc}築巢了，附近的大家幫忙注意一下`,
      content: `這幾天注意到有隻${sp}媽媽在${loc}靠近步道的灌木叢裡築巢，麻煩經過的鳥友放慢速度、保持距離，育雛期真的很需要安靜的環境。`,
    }),
    ({ loc, sp }) => ({
      title: `${loc}的${sp}幼鳥學飛失敗掉到地上，該怎麼處理？`,
      content: `剛剛在${loc}看到一隻還沒長齊羽毛的${sp}幼鳥掉在草地上，附近有貓出沒讓我很擔心，先用紙箱暫時安置起來，有沒有人知道接下來該送去哪裡？`,
    }),
    ({ loc, sp }) => ({
      title: `${loc}的${sp}巢又孵出新的一批了`,
      content: `去年在${loc}顧過的那窩${sp}，今年又回來原地築巢孵蛋了，這幾天陸續聽到雛鳥叫聲，看來又要開始輪班巡邏、提醒大家別靠太近的日子了。`,
    }),
  ],
  生存指南: [
    ({ loc, sp }) => ({
      title: `${loc}那一帶對${sp}來說不太安全，經過請小心`,
      content: `最近${loc}那一帶施工，噪音跟粉塵都不小，看到好幾隻${sp}都飛得比平常慌張，建議大家經過時放慢速度，也提醒剛學飛的幼鳥盡量繞路。`,
    }),
    ({ loc, sp }) => ({
      title: `${loc}的落地窗反光太強，已經有${sp}撞上去了`,
      content: `${loc}那棟新蓋的玻璃帷幕大樓，這幾天目擊到至少兩隻${sp}疑似因為反光誤判方向撞上去，希望大家互相提醒家族成員，經過時盡量貼近樹冠層飛行。`,
    }),
    ({ loc, sp }) => ({
      title: `提醒：${loc}最近野貓變多，${sp}要多注意`,
      content: `這禮拜在${loc}巡邏時發現野貓數量明顯變多，已經有目擊到追逐${sp}幼鳥的情況，建議這陣子夜間或清晨經過的鳥友格外小心，能結伴同行更好。`,
    }),
    ({ loc, sp }) => ({
      title: `${loc}風大的季節到了，${sp}飛行要注意`,
      content: `這個季節${loc}的風特別強，尤其是傍晚時段，看到不少${sp}被吹得東倒西歪，建議這陣子盡量避開開闊地帶，貼著建築物或樹叢邊緣移動比較省力也安全。`,
    }),
  ],
  日常分享: [
    ({ loc, sp }) => ({
      title: `今天在${loc}被${sp}搶走食物，氣死我了`,
      content: `大家評評理！我好不容易在${loc}找到一塊麵包屑，才剛準備開動，旁邊一隻${sp}竟然一口就叼走了，現在的鳥是不是都學會搶劫了？`,
    }),
    ({ loc, sp }) => ({
      title: `${loc}的${sp}今天心情特別好，一直在唱歌`,
      content: `早上經過${loc}，聽到一隻${sp}從天亮一直唱到現在，聲音超好聽，忍不住停下來錄了一段影片，想跟大家分享今天這麼美好的開場。`,
    }),
    ({ loc, sp }) => ({
      title: `跟${loc}的${sp}鄰居混熟了，牠現在會主動打招呼`,
      content: `住在${loc}附近久了，跟一隻常出沒的${sp}混熟了，牠現在看到我都會歪頭叫兩聲，感覺像在跟老朋友打招呼一樣，鳥友們也有類似的經驗嗎？`,
    }),
    ({ loc, sp }) => ({
      title: `在${loc}目睹${sp}洗澡洗得超投入`,
      content: `今天路過${loc}的小水窪，看到一隻${sp}在裡面洗澡洗得渾然忘我，水花濺得到處都是，圍觀了快十分鐘捨不得走，太療癒了。`,
    }),
  ],
  覓食情報: [
    ({ loc, sp }) => ({
      title: `${loc}後山的果樹熟了，${sp}都聚過去了`,
      content: `低調分享！${loc}後山那幾棵野果樹最近結實累累，已經吸引一大群${sp}天天報到，果肉甜、農藥少，趁還沒被採收完大家快去，記得留一些給其他鳥友。`,
    }),
    ({ loc, sp }) => ({
      title: `${loc}固定會有人灑穀物，${sp}都知道時間`,
      content: `發現${loc}靠近涼亭那一區，每天下午固定會有阿伯灑穀物餵鳥，附近的${sp}已經摸清楚時間，快到點就會集合，覓食效率超高，推薦給大家。`,
    }),
    ({ loc, sp }) => ({
      title: `${loc}的水域這陣子小魚小蝦特別多`,
      content: `這幾天在${loc}岸邊觀察，發現水裡的小魚小蝦數量明顯變多，難怪最近${sp}都愛往那一帶跑，覓食成功率看起來很高，推薦給還在苦惱去哪覓食的大家。`,
    }),
    ({ loc, sp }) => ({
      title: `提醒：${loc}那邊的人類食物碎屑不太健康`,
      content: `雖然${loc}常有遊客留下麵包、洋芋片碎屑，但這些調味過的食物對${sp}的腸胃負擔不小，還是建議大家多往草地、樹叢找天然食物，比較安全長久。`,
    }),
  ],
}

async function getBoards() {
  const boards = await prisma.board.findMany()
  if (boards.length === 0) {
    throw new Error('看板清單是空的，請先執行 npm run seed 建立固定看板')
  }
  return boards
}

async function seedUsers() {
  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, SALT_ROUNDS)
  const users = []
  for (let i = 0; i < USER_COUNT; i++) {
    const email = `demo${String(i + 1).padStart(2, '0')}@example.com`
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: hashedPassword,
        nickname: NICKNAMES[i],
        habitat: pick(LOCATIONS),
      },
    })
    users.push(user)
  }
  return users
}

async function seedPosts(users, boards) {
  const boardsByName = Object.fromEntries(boards.map((b) => [b.name, b]))
  const postsData = []

  for (let i = 0; i < POST_COUNT; i++) {
    const boardName = pick(Object.keys(TEMPLATES))
    const board = boardsByName[boardName]
    const templateFn = pick(TEMPLATES[boardName])
    const { title, content } = templateFn({ loc: pick(LOCATIONS), sp: pick(SPECIES) })
    const author = pick(users)

    postsData.push({
      title,
      content,
      tag: pick(TAGS),
      boardId: board.id,
      authorId: author.id,
      createdAt: randomPastDate(45),
    })
  }

  await prisma.post.createMany({ data: postsData })
  return prisma.post.findMany({ orderBy: { createdAt: 'desc' }, take: POST_COUNT })
}

async function seedLikes(users, posts) {
  const likeRows = []
  for (const post of posts) {
    const likerCount = Math.floor(Math.random() * 21) // 0~20 個人按讚
    const likers = pickN(users, likerCount)
    for (const liker of likers) {
      likeRows.push({ postId: post.id, userId: liker.id })
    }
  }
  await prisma.like.createMany({ data: likeRows, skipDuplicates: true })
  return likeRows.length
}

async function main() {
  const boards = await getBoards()
  const users = await seedUsers()
  console.log(`使用者：${users.length} 位（帳號 demo01@example.com ~ demo${USER_COUNT}@example.com，密碼皆為 ${DEMO_PASSWORD}）`)

  const posts = await seedPosts(users, boards)
  console.log(`文章：${posts.length} 篇`)

  const likeCount = await seedLikes(users, posts)
  console.log(`讚：${likeCount} 筆（隨機分佈在這批文章上）`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
