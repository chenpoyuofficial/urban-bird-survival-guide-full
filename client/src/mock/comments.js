// 假模式（連不到伺服器）用的固定展示留言，依 mock 文章 id 分組
export const mockCommentsByPostId = {
  'post-1': [
    { id: 'comment-1-1', authorName: '柴山老白頭', createdAt: '1 小時前', content: '感謝提醒，這幾天真的要小心，昨天差點也撞上去！' },
    { id: 'comment-1-2', authorName: '澄清湖翠鳥哥', createdAt: '30 分鐘前', content: '已經跟家族成員說了，大家經過都會繞道。' },
  ],
  'post-2': [
    { id: 'comment-2-1', authorName: '愛吃櫻桃的小綠', createdAt: '10 分鐘前', content: '我要去！幾點集合？揪我揪我～' },
  ],
  'post-3': [
    { id: 'comment-3-1', authorName: '柴山老白頭', createdAt: '2 小時前', content: '謝謝分享，明天就去，希望還沒被採收完！' },
    { id: 'comment-3-2', authorName: '衛武營的阿強', createdAt: '1 小時前', content: '記得留一些給其他鳥友喔，別一次吃光光。' },
  ],
  'post-4': [],
  'post-5': [
    { id: 'comment-5-1', authorName: '援中港的黑冠麻鷺', createdAt: '2 小時前', content: '先別介入，靜靜觀察就好，父母通常都在附近。' },
  ],
}
