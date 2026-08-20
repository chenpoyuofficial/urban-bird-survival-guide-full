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

// [board][tag] -> 產生 {title, content} 的函式，確保生成的標籤跟文章內容語氣一致
// （之前版本 board 跟 tag 是各自獨立隨機抽的，會出現「求助」標籤配「公告」語氣內容的錯亂）
const TEMPLATES = {
  育雛資訊: {
    注意: ({ loc, sp }) => ({
      title: `提醒：${loc}的${sp}巢附近最近有貓出沒`,
      content: `這幾天在${loc}巡邏時發現野貓在${sp}築巢的灌木叢附近徘徊，育雛中的家庭風險比較高，麻煩經過的鳥友多留意，看到貓的話也麻煩幫忙驅離一下。`,
    }),
    好康: ({ loc, sp }) => ({
      title: `${loc}發現超安全的育雛地點，分享給大家`,
      content: `這一窩${sp}把巢築在${loc}人煙稀少、又有樹冠遮蔽的角落，觀察了幾天完全沒有遊客或野貓靠近，把這個地點分享給正在找育雛地點的鳥友參考。`,
    }),
    閒聊: ({ loc, sp }) => ({
      title: `${loc}的${sp}寶寶今天第一次張開眼睛，太療癒了`,
      content: `顧了快一週，今天終於看到${loc}那窩${sp}寶寶睜開眼睛的瞬間，毛都還沒長齊、搖搖晃晃的樣子萌到不行，忍不住想跟大家分享這個小確幸。`,
    }),
    求助: ({ loc, sp }) => ({
      title: `${loc}發現一窩${sp}幼鳥，求前輩指點怎麼顧`,
      content: `今天在${loc}散步時發現樹洞裡有一窩剛孵化的${sp}寶寶，爸媽好像還在附近覓食，想請問有經驗的鳥友，這種情況要不要幫忙介入，還是靜靜觀察就好？`,
    }),
    心得: ({ loc, sp }) => ({
      title: `${loc}的${sp}巢又孵出新的一批了`,
      content: `去年在${loc}顧過的那窩${sp}，今年又回來原地築巢孵蛋了，這幾天陸續聽到雛鳥叫聲，看來又要開始輪班巡邏、提醒大家別靠太近的日子了，整理一下去年的經驗給新手參考。`,
    }),
    目擊: ({ loc, sp }) => ({
      title: `目擊${loc}的${sp}媽媽叼蟲子回巢餵食`,
      content: `難得拍到${loc}那隻${sp}媽媽叼著一整條蟲子飛回巢裡餵食的畫面，雛鳥們搶著張嘴的樣子超級可愛，分享給大家看看育雛的日常。`,
    }),
    揪團: ({ loc, sp }) => ({
      title: `${loc}要組巡邏隊保護${sp}育雛期，一起來`,
      content: `${loc}這一帶最近${sp}育雛的家庭變多了，想揪幾位鳥友輪流巡邏、提醒路過的人放輕腳步，有興趣的話留言喊一聲，排個班表出來。`,
    }),
    交易: ({ loc, sp }) => ({
      title: `多的${sp}巢材要送人，在${loc}附近面交`,
      content: `之前幫忙整理${loc}步道時收集了一些乾草跟細枝，原本想搭個人工巢架結果沒用到，想送給有需要幫${sp}佈置育雛環境的鳥友，面交地點在${loc}附近。`,
    }),
    提問: ({ loc, sp }) => ({
      title: `請問${loc}的${sp}幼鳥這樣正常嗎？`,
      content: `觀察${loc}那窩${sp}幼鳥好幾天了，發現其中一隻體型明顯比其他手足小很多，這樣算正常的發育差異嗎？有沒有前輩能幫忙解答一下。`,
    }),
    公告: ({ loc, sp }) => ({
      title: `${loc}育雛季開始了，提醒大家經過放輕腳步`,
      content: `每年這個時候${loc}都會有不少${sp}進入育雛期，公告提醒最近會經過那一帶的鳥友，盡量放輕腳步、保持距離，讓育雛家庭有安靜的環境。`,
    }),
  },
  生存指南: {
    注意: ({ loc, sp }) => ({
      title: `提醒：${loc}最近野貓變多，${sp}要多注意`,
      content: `這禮拜在${loc}巡邏時發現野貓數量明顯變多，已經有目擊到追逐${sp}幼鳥的情況，建議這陣子夜間或清晨經過的鳥友格外小心，能結伴同行更好。`,
    }),
    好康: ({ loc, sp }) => ({
      title: `${loc}在推安全宣導活動，${sp}都能拿反光貼紙`,
      content: `發現${loc}服務中心最近在推鳥類安全宣導，有提供免費的反光貼紙可以貼在玻璃帷幕上，減少${sp}誤撞的機會，需要的鳥友可以去領一下。`,
    }),
    閒聊: ({ loc, sp }) => ({
      title: `聊聊${loc}的${sp}都怎麼躲避危險`,
      content: `這陣子在${loc}觀察${sp}躲避車輛跟野貓的方式，發現牠們路線都摸得很熟練，繞遠路也不嫌麻煩，蠻佩服這種生存智慧的，來跟大家聊聊。`,
    }),
    求助: ({ loc, sp }) => ({
      title: `${loc}的${sp}好像受傷了，該怎麼幫忙？`,
      content: `剛剛在${loc}看到一隻${sp}單腳懸空、飛行也不太穩，感覺是受傷了，附近車流量不小讓我很擔心，有沒有人知道該聯絡哪個單位協助？`,
    }),
    心得: ({ loc, sp }) => ({
      title: `整理在${loc}觀察${sp}躲避危險的心得`,
      content: `這陣子固定在${loc}觀察，整理了一些${sp}躲避危險的小心得：牠們特別會利用樹冠層跟建築物陰影移動，分享給剛開始關注鳥類安全的鳥友參考。`,
    }),
    目擊: ({ loc, sp }) => ({
      title: `目擊${loc}的落地窗反光太強，已經有${sp}撞上去了`,
      content: `${loc}那棟新蓋的玻璃帷幕大樓，這幾天目擊到至少兩隻${sp}疑似因為反光誤判方向撞上去，希望大家互相提醒家族成員，經過時盡量貼近樹冠層飛行。`,
    }),
    揪團: ({ loc, sp }) => ({
      title: `${loc}安全巡邏揪團，一起提醒${sp}注意危險`,
      content: `想在${loc}固定時段組個安全巡邏小隊，順便提醒路過的${sp}家族哪裡有施工、哪裡車多，有興趣輪班的鳥友歡迎留言，一起分擔巡邏時段。`,
    }),
    交易: ({ loc, sp }) => ({
      title: `多的反光貼紙要送給需要的鳥友，在${loc}附近`,
      content: `上次領太多反光貼紙，用不完想分享出去，貼在窗戶上可以減少${sp}誤撞的意外，可以在${loc}附近面交，需要的鳥友留言。`,
    }),
    提問: ({ loc, sp }) => ({
      title: `請問${loc}這個工地對${sp}會有影響嗎？`,
      content: `${loc}最近開始施工，噪音跟粉塵都不小，想請問有經驗的鳥友，這種長期工程對${sp}的棲息會有什麼影響嗎？要不要幫忙留意什麼？`,
    }),
    公告: ({ loc, sp }) => ({
      title: `${loc}道路工程公告，提醒${sp}與鳥友注意安全`,
      content: `公告一下，${loc}下週開始有道路施工，重機具進出頻繁，提醒這一帶的${sp}家族跟常來賞鳥的鳥友這陣子經過要格外小心。`,
    }),
  },
  日常分享: {
    注意: ({ loc, sp }) => ({
      title: `${loc}最近${sp}數量變多，開車經過要注意`,
      content: `這陣子${loc}的${sp}數量明顯變多，常常一群一群在馬路邊覓食，開車經過那一帶的話麻煩放慢速度，別嚇到牠們也別發生意外。`,
    }),
    好康: ({ loc, sp }) => ({
      title: `${loc}的${sp}告訴我一個超棒的曬太陽地點`,
      content: `跟著一隻常出沒的${sp}亂走，結果被牠帶到${loc}一個超舒服的曬太陽角落，沒什麼人、風又不會太大，分享給大家這個私房小地點。`,
    }),
    閒聊: ({ loc, sp }) => ({
      title: `${loc}的${sp}今天心情特別好，一直在唱歌`,
      content: `早上經過${loc}，聽到一隻${sp}從天亮一直唱到現在，聲音超好聽，忍不住停下來錄了一段影片，想跟大家分享今天這麼美好的開場。`,
    }),
    求助: ({ loc, sp }) => ({
      title: `${loc}的${sp}一直跟著我，該拿牠怎麼辦`,
      content: `這幾天在${loc}散步都會有一隻${sp}跟前跟後，甚至會停在我肩膀附近，雖然很可愛但有點不知所措，有沒有類似經驗的鳥友能分享一下該怎麼應對？`,
    }),
    心得: ({ loc, sp }) => ({
      title: `跟${loc}的${sp}鄰居混熟了的心得`,
      content: `住在${loc}附近久了，跟一隻常出沒的${sp}混熟了，牠現在看到我都會歪頭叫兩聲，感覺像在跟老朋友打招呼一樣，整理一下這陣子跟牠培養默契的小心得。`,
    }),
    目擊: ({ loc, sp }) => ({
      title: `目擊${loc}的${sp}互相理毛，太甜了`,
      content: `今天在${loc}看到兩隻${sp}停在同一根樹枝上互相理毛，一副感情很好的樣子，圍觀了好一陣子捨不得走，趕快拍下來跟大家分享。`,
    }),
    揪團: ({ loc, sp }) => ({
      title: `${loc}賞鳥兼野餐揪團，順便看${sp}`,
      content: `想約幾位鳥友這週末去${loc}野餐兼賞鳥，聽說最近${sp}很活躍，現場輕鬆聊天就好，不用帶太專業的裝備，有興趣的留言揪一下。`,
    }),
    交易: ({ loc, sp }) => ({
      title: `多的鳥食要換${loc}在地小吃，有鳥友要換嗎`,
      content: `手邊多了一大包沒用完的鳥食，想換一些${loc}在地的小吃來吃吃看，有常在${loc}餵${sp}的鳥友想交換的話歡迎留言喔。`,
    }),
    提問: ({ loc, sp }) => ({
      title: `請問${loc}這隻${sp}是什麼品種啊？`,
      content: `今天在${loc}拍到一隻長相有點特別的${sp}，跟平常看到的顏色不太一樣，想請教一下有沒有鳥友知道這是什麼品種或是特殊的個體？`,
    }),
    公告: ({ loc, sp }) => ({
      title: `${loc}鳥友聚會公告，歡迎${sp}愛好者參加`,
      content: `公告一下，這個月的鳥友聚會辦在${loc}，會分享最近拍到的${sp}照片跟觀察心得，時間地點稍後補上，歡迎有興趣的大家一起來認識新朋友。`,
    }),
  },
  覓食情報: {
    注意: ({ loc, sp }) => ({
      title: `提醒：${loc}那邊的人類食物碎屑不太健康`,
      content: `雖然${loc}常有遊客留下麵包、洋芋片碎屑，但這些調味過的食物對${sp}的腸胃負擔不小，還是建議大家多往草地、樹叢找天然食物，比較安全長久。`,
    }),
    好康: ({ loc, sp }) => ({
      title: `${loc}後山的果樹熟了，${sp}都聚過去了`,
      content: `低調分享！${loc}後山那幾棵野果樹最近結實累累，已經吸引一大群${sp}天天報到，果肉甜、農藥少，趁還沒被採收完大家快去，記得留一些給其他鳥友。`,
    }),
    閒聊: ({ loc, sp }) => ({
      title: `看${sp}在${loc}覓食覓得很認真，太可愛了`,
      content: `蹲在${loc}角落看${sp}翻找落葉找蟲吃看了快半小時，那個專注的樣子真的很療癒，忍不住想跟大家分享今天這個悠閒的下午。`,
    }),
    求助: ({ loc, sp }) => ({
      title: `${loc}最近覓食好像變少了，有推薦的地方嗎？`,
      content: `這陣子觀察${loc}的${sp}好像比較難找到食物，草地看起來也比較乾枯，想請問大家有沒有附近推薦的覓食地點可以分享？`,
    }),
    心得: ({ loc, sp }) => ({
      title: `分享在${loc}觀察${sp}覓食的心得`,
      content: `蹲點${loc}一段時間，整理了一些${sp}覓食習慣的心得：牠們特別偏好清晨跟傍晚出來活動，草地邊緣比開闊處更容易找到食物，分享給大家參考。`,
    }),
    目擊: ({ loc, sp }) => ({
      title: `目擊${sp}在${loc}叼到一條超大蚯蚓`,
      content: `今天在${loc}目擊一隻${sp}使盡全力從土裡拉出一條超長的蚯蚓，拔河的畫面太生動了，最後成功吃到的樣子超有成就感，分享給大家看。`,
    }),
    揪團: ({ loc, sp }) => ({
      title: `${loc}覓食踏青揪團，順便觀察${sp}`,
      content: `想約鳥友這週去${loc}踏青，順便觀察${sp}的覓食路線，一起紀錄一下這個季節牠們都在吃什麼，有興趣的留言揪一下時間。`,
    }),
    交易: ({ loc, sp }) => ({
      title: `請問${loc}的食物還有剩嗎？我想交換看看`,
      content: `聽說有鳥友固定在${loc}放置給${sp}吃的穀物，手邊剛好有多的葵花籽，想問問看能不能交換一些，或是一起分攤放置的物資。`,
    }),
    提問: ({ loc, sp }) => ({
      title: `請問${loc}這個季節${sp}都吃什麼？`,
      content: `想請教常在${loc}觀察的鳥友，這個季節${sp}主要都吃些什麼？是野果比較多還是昆蟲比較多，想幫牠們多準備一些天然食物來源。`,
    }),
    公告: ({ loc, sp }) => ({
      title: `${loc}果實季開始了，公告給覓食情報看板`,
      content: `公告一下，${loc}的野果季節正式開始，這陣子會吸引大量${sp}聚集覓食，喜歡觀察覓食畫面的鳥友可以留意這幾週的動態。`,
    }),
  },
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
    const tag = pick(TAGS)
    const board = boardsByName[boardName]
    const templateFn = TEMPLATES[boardName][tag]
    const { title, content } = templateFn({ loc: pick(LOCATIONS), sp: pick(SPECIES) })
    const author = pick(users)

    postsData.push({
      title,
      content,
      tag,
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
