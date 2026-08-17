# CLAUDE.md — urban-bird-survival-guide-full

本檔案為 Claude Code 在此 repo 內工作時的規範與上下文說明。

## 專案定位

純作品集（portfolio）用途，不追求真實上線營運，目標是展現求職所需的全端能力。
本專案為「城市鳥類的生存指南」的全端擴充版：討論區對應賞鳥社群交流、即時地圖對應資源分享/救難資訊、緊急求助對應鳥類救援協作情境。
**開發模式：直接生成模式**——Claude Code 應直接產出可運作的完整程式碼，不需要走 teaching mode 或只給 hint。優先求開發速度與完整度。

## 開發策略：做深 vs 做廣

**做深（本次優先，需完整實作）**
- 討論區：文章 CRUD + 留言功能，含真實後端、資料庫、驗證
- 登入系統：自刻 JWT + bcrypt 的完整 Auth 流程

**做廣（後續視時間簡化，不強求生產等級）**
- 即時地圖資訊（資源分享/警示/救難）
- 聊天室
- 緊急求助一鍵求助

做廣的三項功能：先以簡化版或靜態展示為主，並在對應模組的 README 補充「若做到生產等級會如何實作」的技術思路（例如聊天室會用 WebSocket、地圖會用什麼定位/即時更新機制等），不必真的完整實作。

## 技術棧

**前端** (`client/`)
- React + Vite + JavaScript
- Tailwind CSS
- 部署：Vercel 或 Netlify（對 API 串接友善，非 GitHub Pages）

**後端** (`server/`)
- Node.js + Express + JavaScript
- Prisma ORM + PostgreSQL
- Auth：自刻 JWT（`jsonwebtoken`）+ bcrypt 密碼雜湊
  - 只用 access token（效期建議 7 天），暫不做 refresh token 機制
  - refresh token 屬於「做廣」等級的技術債，列入 README 生產等級說明，不在本次實作範圍
- 部署：Railway

**Mock 備援模式**
- 當後端服務休眠/掛掉時，前端可切換至假資料展示基本畫面，避免 demo 開天窗
- 實作方式：前端用環境變數或 fallback 邏輯，API 呼叫失敗時 fallback 到本地 mock JSON

## 前端設計系統

**字型**
- Noto Sans TC（Traditional Chinese）

**色彩**

| 用途 | 色碼 |
|---|---|
| 主色 | `#2E7D32`（綠） |
| 輔助色 | `#FF9800`（橘） |
| 警示色 | `#D32F2F`（紅） |
| 中性色 - 黑 | `#2B221A` |
| 中性色 - 白 | `#F9F6F0` |

**陰影**
- 陰影 - 淡：`(0, 2) / 4`，`#2B221A` 25% 透明度
- 陰影 - 濃：`(0, 2) / 8`，`#2B221A` 35% 透明度

在 Tailwind 設定中應將以上色碼與陰影定義為自訂 theme（`tailwind.config.js` 的 `extend.colors` / `extend.boxShadow`），避免程式碼中直接寫死色碼，維持設計系統一致性。

## 前端元件開發慣例

專案有 Figma 設計稿，開發順序為「先刻共用元件 → 再組頁面 → 頁面先用 mock 資料 → 最後接真實 API」。

**元件資料夾結構**
```
client/src/components/
├── ui/              # 共用元件（Button、Input、Card、Badge、Avatar、Modal…），跨頁面重複使用
└── features/         # 頁面/功能專屬元件（例如 PostCard、CommentList、BoardNav），與特定頁面邏輯綁定
client/src/pages/      # 頁面組裝，將 ui/ 與 features/ 元件組合起來
```

**Icon**
- 使用 Google 的 Material Symbols，透過 `material-symbols` npm 套件引入字型
- 用法：`<span className="material-symbols-outlined">icon_name</span>`，`icon_name` 直接對應 Figma 標註的圖示名稱
- 預設樣式為 outlined，除非畫面設計另有標註（rounded/sharp）

**RWD**
- Figma 稿僅提供手機版設計，桌面版也維持相同的窄版長條版型（例如用 `max-w-md mx-auto` 置中），不另外設計寬螢幕多欄版型
- 除非之後補上桌面版設計稿，否則元件不需要額外處理 `md:`/`lg:` 等 breakpoint

**元件撰寫原則**
- 純 JavaScript（無 TypeScript），與專案既有慣例一致
- 樣式一律使用 Tailwind utility class，並優先使用已定義的 theme token（例如 `bg-primary`、`text-neutral-black`、`shadow-soft`），不寫死色碼、不另建 CSS module（除非有 utility class 無法表達的動畫/複雜效果）
- 共用元件（`ui/`）必須是純展示元件：只透過 props 接收資料與 callback，不得直接呼叫 API/fetch，確保可以先用 mock 資料組頁面，之後接真實 API 時只需替換頁面層的資料來源，元件本身不用改
- 檔名與元件名一致，採 PascalCase（例如 `Button.jsx`）

**元件預覽（頁面尚未完成前）**
- 不引入 Storybook 等額外工具，改在專案內建立一個簡易 Playground 頁面（例如 `client/src/pages/Playground.jsx`，掛在 `/dev/playground` 路由）
- 每刻好一個共用元件，就 import 進 Playground 頁面並列出主要狀態（default/hover/disabled/error 等），用 `npm run dev` 開瀏覽器直接檢視、跟 Figma 截圖比對
- Playground 頁面僅供開發期比對外觀使用，不需要串資料或加入正式路由導覽

## Repo 架構

單一 repo，前後端分開開發與部署：

```
/
├── client/          # React + Vite 前端，獨立部署至 Vercel/Netlify
├── server/          # Express 後端，獨立部署至 Railway
├── CLAUDE.md
└── README.md        # 專案總覽、做深/做廣說明、生產等級技術思路
```

部署時前端指向 `client/` 作為 root、後端指向 `server/` 作為 root。

## 核心架構原則（務必遵守）

1. **前後端純 API 溝通**：所有互動透過 fetch/axios 呼叫 REST API，前端不得直接依賴後端框架的渲染方式（例如後端不得直接渲染 HTML 回傳給前端，如傳統 ASP.NET MVC 模式）
2. **API contract 穩定**：route 命名、request/response 格式需保持一致的慣例（建議統一用 camelCase、統一的錯誤回傳格式），不可隨後端語言習慣任意變動
3. **不共用程式碼**：`client/` 與 `server/` 之間不得直接 import 對方程式碼，僅能透過 API 溝通，確保未來更換後端語言/框架時前端幾乎不需改動
4. **關注點分離（沿用既有慣例）**：後端內部依功能拆分（例如 `routes/`、`controllers/`、`services/`、`prisma/`），避免邏輯全塞在單一檔案
5. **CORS 處理**：前後端部署在不同網域（前端 Vercel/Netlify、後端 Railway），需在後端用 `cors` 套件明確允許前端網域。允許的來源網域透過環境變數 `CLIENT_URL` 管理，本地開發指向 `localhost:5173`（Vite 預設 port），正式環境指向實際的前端網域。若 JWT 存於 localStorage（非 cookie）則不需要 `credentials: true`
6. **本地開發跨域**：本地開發時前端可視需要設定 Vite proxy（`vite.config.js` 的 `server.proxy`）轉發 API 請求，或直接依賴後端的 CORS 設定，兩者擇一即可

## 登入系統功能範圍（做深）

- 註冊（email + 密碼，bcrypt 雜湊儲存）
- 登入（回傳 JWT access token）
- 登入狀態驗證 middleware（保護需登入的 API route）
- 登出（前端清除 token 即可，不需後端 session 管理）

## 討論區功能範圍（做深）

資料模型層級：**Board（討論區）→ Post（文章）→ Comment（留言）**

- Board：固定清單，透過 seed 腳本預先建立（例如「閒聊」「技術分享」「二手交易」），**不開放使用者 CRUD**，只做讀取
- Post：新增、讀取（列表 + 單篇）、編輯、刪除（CRUD），歸屬於特定 Board
- Comment：對文章新增留言、讀取留言列表、刪除自己的留言
- 權限：僅登入使用者可發文/留言；僅本人可編輯/刪除自己的內容

### Route 設計

```
# Auth
POST   /api/auth/register              # 註冊
POST   /api/auth/login                 # 登入，回傳 JWT
GET    /api/auth/me                    # 取得目前登入使用者資訊（需 token）

# Boards（固定清單，僅讀取）
GET    /api/boards                     # 討論區列表
GET    /api/boards/:boardId            # 單一討論區資訊

# Posts（巢狀於 board 下新增/列表；單一資源操作走扁平路由）
GET    /api/boards/:boardId/posts      # 該討論區下的文章列表
POST   /api/boards/:boardId/posts      # 在該討論區新增文章（需登入）
GET    /api/posts/:id                  # 單篇文章詳情
PUT    /api/posts/:id                  # 編輯文章（需登入 + 本人）
DELETE /api/posts/:id                  # 刪除文章（需登入 + 本人）

# Comments（同上原則：巢狀新增/列表，扁平刪除）
GET    /api/posts/:postId/comments     # 取得某篇文章的留言列表
POST   /api/posts/:postId/comments     # 新增留言（需登入）
DELETE /api/comments/:id               # 刪除留言（需登入 + 本人）
```

設計原則：巢狀路由表示「歸屬關係」（例如新增/列表一定要知道屬於哪個 Board 或 Post），操作單一資源（讀取/編輯/刪除單筆 Post 或 Comment）則用扁平路由，因為此時只需要資源自身的 id。

### Middleware 與權限

- 需要 JWT 驗證 middleware 的 route：`POST/PUT/DELETE /posts` 系列、`POST /comments`、`DELETE /comments`
- 不需要登入即可存取（訪客也能瀏覽）：所有 `GET` 系列 route
- 編輯/刪除時除了驗證登入，還需檢查資源擁有者是否為當前使用者（本人限定）

### 錯誤回傳格式

統一格式：`{ error: { message, code } }`，方便前端寫共用的錯誤處理邏輯。

## Prisma / 資料庫慣例

- schema 定義於 `server/prisma/schema.prisma`
- 核心 model：`User`、`Board`、`Post`、`Comment`
- `Board` 透過 seed 腳本（`prisma/seed.js`）預先建立固定清單，不提供對外的建立/刪除 API
- 所有資料庫操作透過 Prisma Client，不寫原生 SQL
- migration 使用 `prisma migrate dev`

## Git 慣例

- commit message 使用清楚的中文或英文皆可，但需說明「做了什麼」而非「改了哪個檔案」
- 功能分支開發，完成後合併回 main

## 待確認事項（開發過程中隨時可能調整）

- 做廣三項功能（地圖、聊天室、緊急求助）的具體簡化程度，將視整體開發時間決定
