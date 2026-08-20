// 一次性腳本：對現有的展示用文章（npm run seed:demo 產生的那批）補上 100 則留言，
// 每篇文章隨機分配 0~5 則（刻意不平均），留言內容依「標籤 + 所屬看板主題」挑選對應的模板。
// 不會重新建立使用者/文章，跑在現有資料上；重複執行會再疊加 100 則留言。
import 'dotenv/config'
import prisma from '../lib/prisma.js'

const TOTAL_COMMENTS = 100
const MAX_PER_POST = 5
const BOARD_NAMES = ['育雛資訊', '生存指南', '日常分享', '覓食情報']

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomPastDate(maxDaysAgo) {
  const now = Date.now()
  const offsetMs = Math.random() * maxDaysAgo * 24 * 60 * 60 * 1000
  return new Date(now - offsetMs)
}

// [tag][boardName] -> 留言模板池，同時貼合標籤語氣與看板主題
const COMMENT_TEMPLATES = {
  注意: {
    育雛資訊: ['謝謝提醒，我家附近也有一窩，會多注意保護。', '已經在跟鄰居分享這個消息了，育雛期真的要特別小心。'],
    生存指南: ['太重要了，已經提醒家族成員要繞道。', '感謝分享，這種安全資訊真的要擴散出去。'],
    日常分享: ['看到這篇特地跑去看了一下，真的要小心。', '推，這種提醒對大家都很有幫助。'],
    覓食情報: ['原來這個地方要注意，謝謝提醒，不然差點就去了。', '有點嚇到，還好先看到這篇文章。'],
  },
  好康: {
    育雛資訊: ['太好康了，這種育雛資源真的很難得！', '感謝分享，趕快存起來備用。'],
    生存指南: ['這種安全資訊算好康吧，收藏起來。', '推推，這對新手真的很實用。'],
    日常分享: ['太好康了吧，我也要去試試看！', '這種好康資訊不分享真的可惜。'],
    覓食情報: ['這個覓食點也太讚了，感謝分享！', '已筆記，下次覓食就靠這篇了。'],
  },
  閒聊: {
    育雛資訊: ['看著小小的雛鳥心都融化了，太可愛了。', '育雛真的辛苦，幫爸媽加油！'],
    生存指南: ['看完覺得當一隻鳥也不容易，哈哈。', '推，這種日常提醒配上閒聊語氣剛剛好。'],
    日常分享: ['笑死，鳥類的日常真的很療癒。', '看了心情都變好了，謝謝分享。'],
    覓食情報: ['光用想的都覺得肚子餓了，哈哈。', '推一個，覓食的畫面也太可愛。'],
  },
  求助: {
    育雛資訊: ['我之前也遇過類似狀況，建議先靜靜觀察就好，別急著介入。', '推薦你去問問看在地鳥會，他們比較有經驗處理雛鳥狀況。'],
    生存指南: ['建議先保持距離觀察，真的有危險再考慮通報。', '加油，希望能順利解決，這種狀況真的需要幫忙。'],
    日常分享: ['這狀況我也遇過，後來就自然解決了，別太擔心。', '推，希望有更有經驗的鳥友能幫忙解答。'],
    覓食情報: ['可以試試看換個地點觀察，也許會有不同發現。', '推薦你問問看常在那邊的鳥友，應該會有答案。'],
  },
  心得: {
    育雛資訊: ['寫得很有感觸，育雛真的不容易，謝謝分享心得。', '同感，每次看到雛鳥平安長大都很感動。'],
    生存指南: ['很實用的心得，收藏起來以後用得到。', '感謝分享，這種第一手經驗最珍貴。'],
    日常分享: ['寫得真好，看完也想去走走了。', '同感，這種日常小確幸最療癒了。'],
    覓食情報: ['感謝分享心得，下次覓食就照這個方法試試。', '很受用，謝謝整理出來。'],
  },
  目擊: {
    育雛資訊: ['好精彩的目擊紀錄，能看到育雛過程真的很難得！', '太幸運了，這種畫面可遇不可求，謝謝分享。'],
    生存指南: ['這種目擊紀錄也提醒了大家潛在的風險，感謝分享。', '拍到這個畫面也太厲害了！'],
    日常分享: ['這目擊也太療癒了吧，謝謝分享。', '太可愛的畫面，忍不住多看好幾次。'],
    覓食情報: ['這種覓食畫面很珍貴，謝謝分享！', '光用想的都覺得肚子餓了，太生動了。'],
  },
  揪團: {
    育雛資訊: ['我要報名觀察活動，請問怎麼聯絡？', '揪團神速，這種育雛觀察一定要參加！'],
    生存指南: ['這種安全巡邏活動我要加入，感謝發起！', '可惜這次沒空，下次記得揪我！'],
    日常分享: ['我要參加！請問幾點集合？', '揪團速度太快了，馬上報名！'],
    覓食情報: ['這種覓食活動一定要跟，感謝揪團！', '有興趣，請問還有名額嗎？'],
  },
  交易: {
    育雛資訊: ['有興趣，請問育雛用品還在嗎？', '這個交易很划算，站內信給你。'],
    生存指南: ['想了解更多細節，請問怎麼聯絡？', '推一個，這種交易資訊很實用。'],
    日常分享: ['有興趣，麻煩站內信給我細節。', '這個交易很划算，推！'],
    覓食情報: ['請問食物還有剩嗎？我想交換看看。', '有興趣，站內信聯絡你。'],
  },
  提問: {
    育雛資訊: ['這個問題我也想知道，蹲一個解答。', '推薦去查查看相關資料，應該會有幫助。'],
    生存指南: ['好問題，期待有經驗的鳥友解答。', '我也很好奇，蹲留言區。'],
    日常分享: ['這個問題也太生活化了，哈哈，我也想知道。', '推，好奇解答是什麼。'],
    覓食情報: ['這個我也想知道，蹲一個答案。', '推薦問問看常去那邊覓食的鳥友。'],
  },
  公告: {
    育雛資訊: ['收到，感謝公告，會多注意育雛期的相關規定。', '了解，謝謝管理員辛苦整理。'],
    生存指南: ['收到，會轉告身邊的鳥友注意安全。', '感謝公告，這種資訊很重要。'],
    日常分享: ['收到，謝謝分享公告！', '了解，感謝整理。'],
    覓食情報: ['收到，會注意這個覓食公告的內容。', '感謝公告，很實用的資訊。'],
  },
}

function pickComment(tag, boardName) {
  const pool = COMMENT_TEMPLATES[tag]?.[boardName] ?? COMMENT_TEMPLATES.閒聊[boardName] ?? ['推一個！']
  return pick(pool)
}

async function main() {
  const users = await prisma.user.findMany({ where: { email: { startsWith: 'demo' } } })
  if (users.length === 0) {
    throw new Error('找不到展示用使用者，請先執行 npm run seed:demo')
  }

  const posts = await prisma.post.findMany({
    select: { id: true, tag: true, board: { select: { name: true } } },
  })
  if (posts.length === 0) {
    throw new Error('資料庫沒有文章，請先執行 npm run seed:demo')
  }

  // 把 100 則留言隨機分配到文章上，每篇最多 5 則，刻意不平均分配
  const commentCounts = new Array(posts.length).fill(0)
  let remaining = TOTAL_COMMENTS
  while (remaining > 0) {
    const idx = Math.floor(Math.random() * posts.length)
    if (commentCounts[idx] < MAX_PER_POST) {
      commentCounts[idx]++
      remaining--
    }
  }

  const commentsData = []
  posts.forEach((post, i) => {
    for (let j = 0; j < commentCounts[i]; j++) {
      commentsData.push({
        content: pickComment(post.tag, post.board.name),
        postId: post.id,
        authorId: pick(users).id,
        createdAt: randomPastDate(30),
      })
    }
  })

  await prisma.comment.createMany({ data: commentsData })

  const withComments = commentCounts.filter((c) => c > 0).length
  console.log(`留言：${commentsData.length} 筆，分佈在 ${withComments}/${posts.length} 篇文章上（每篇 0~${MAX_PER_POST} 則不等）`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
