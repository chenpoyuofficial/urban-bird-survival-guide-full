// 用資源 id 做確定性 hash，讓純展示用的假數字（熱度、讚數等）不會每次重新渲染就亂跳
export function hashToRange(str, min, max) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  }
  return min + (hash % (max - min + 1))
}
