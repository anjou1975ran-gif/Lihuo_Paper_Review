# LIHUO Paper Review System

正式、可部署的論文審查案例展示平台，包含管理員後台、案例上傳、一般／醫學論文模式、普通 AI 與理火審查比較、Supabase 資料庫與私有檔案儲存。

## 技術架構

- Next.js 16 App Router + TypeScript
- Tailwind CSS 4
- Supabase Auth / PostgreSQL / Storage
- Vercel deployment
- Safe Markdown rendering with sanitization

Supabase 官方目前建議 Next.js SSR 使用 `@supabase/ssr`，並以 publishable key 建立瀏覽器／SSR client；本專案依此結構實作。服務端 secret 僅用於經過管理員或公開下載權限檢查後的資料操作與短效 signed URL。

## 已建立路徑

公開（繁中）：
- `/`
- `/paper-review`
- `/medical-review`
- `/cases`
- `/cases/[slug]`
- `/about-lihuo`

公開（English）：
- `/en`
- `/en/paper-review`
- `/en/medical-review`
- `/en/cases`
- `/en/cases/[slug]`
- `/en/about-lihuo`

管理員：
- `/admin/login`
- `/admin`
- `/admin/cases`
- `/admin/cases/new`
- `/admin/cases/[id]/edit`
- `/admin/cases/[id]/preview`

API：
- `POST /api/admin/cases`
- `PATCH|DELETE /api/admin/cases/[id]`
- `POST /api/admin/cases/[id]/duplicate`
- `POST /api/admin/documents`
- `PATCH|DELETE /api/admin/documents/[id]`
- `GET /api/documents/[id]/download`

## 資料表

`admin_users`, `cases`, `case_documents`, `review_outputs`, `general_review_states`, `medical_review_states`, `comparison_summaries`, `case_tags`, `audit_logs`.

## 環境變數

複製 `.env.example` 為 `.env.local`：

```bash
cp .env.example .env.local
```

必要值：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`（只可放在伺服器環境）
- `ADMIN_EMAILS`（逗號分隔）
- `DOCUMENT_BUCKET`（預設 `case-documents`）
- `MAX_UPLOAD_MB`（預設 20）

## Supabase 建立步驟

1. 建立 Supabase project。
2. 在 SQL Editor 執行 `supabase/migrations/202608060001_initial_schema.sql`。
3. 確認 `case-documents` bucket 為 private。
4. 在 Auth 建立管理員帳號，不開放公開註冊。
5. 查出該 Auth user UUID，加入 `admin_users`：

```sql
insert into public.admin_users (user_id, email)
values ('AUTH_USER_UUID', 'admin@example.com');
```

6. 將相同 email 放入 Vercel / `.env.local` 的 `ADMIN_EMAILS`。

管理員必須同時滿足：
- Supabase Auth 登入成功；
- email 在 `ADMIN_EMAILS`；
- user UUID 存在於 `admin_users`；
- 資料庫 RLS policy 允許。

## 案例新增流程

1. 登入 `/admin/login`。
2. 到 `/admin/cases/new` 填寫基本資料、論文來源文字、普通 AI 審查、理火審查、多軸狀態、醫療欄位（如適用）與比較摘要。
3. 儲存後自動導向編輯頁。
4. 在編輯頁上傳 PDF / TXT / Markdown。
5. 檔案預設私有；只有管理員勾選公開下載時，公開頁才提供下載連結。
6. 修改 publication status：`DRAFT` → `UNDER_REVIEW` → `PUBLISHED`。撤回時改為 `WITHDRAWN`；封存時改為 `ARCHIVED`。
7. 資料不完整仍可發布，但必須勾選 `PARTIAL CASE / DATA INCOMPLETE`，並確認下載權限與個資風險。
8. 編輯頁提供預覽、複製與刪除操作；已發布案例需先撤回或封存才能刪除。

## 檔案安全

- 只接受 `application/pdf`, `text/plain`, `text/markdown`。
- 限制大小。
- bucket 私有；瀏覽器透過短效 signed upload token 直接上傳，伺服器完成後再下載驗證並建立資料庫紀錄。
- 不以原始檔名作主鍵；使用 UUID 路徑。
- 不執行 HTML、script、iframe 或上傳檔案內程式碼。
- Markdown 使用 `rehype-sanitize`。
- 下載由伺服器檢查案例狀態與 `public_download_allowed` 後發 signed URL。
- `SUPABASE_SECRET_KEY` 不可放入 `NEXT_PUBLIC_*` 變數。

## 本地執行

```bash
npm install
npm run dev
npm run verify
npm run typecheck
npm run lint
npm run build
```

## Vercel 部署

1. 將專案推送至 Git repository。
2. 在 Vercel Import Project。
3. 設定上述環境變數。
4. Build command 使用 `npm run build`，Output 由 Next.js 自動判斷。
5. 部署後把 `NEXT_PUBLIC_SITE_URL` 改為正式網域。
6. 在 Supabase Auth URL Configuration 加入正式網域與需要的 redirect URLs。
7. 用非管理員瀏覽器確認草稿不可讀、未授權下載會得到 403。

## 測試清單

- 空資料庫：`/cases` 顯示「案例資料尚在整理中」，不產生假案例。
- 未登入：不可進入 `/admin` 或管理 API。
- 非白名單 email：登入後仍不可進入後台。
- 草稿：匿名使用者不可讀。
- 已發布：匿名使用者可讀。
- 私有文件：匿名下載得到 403。
- 公開文件：只有已發布案例且文件開啟下載才可取得短效 URL。
- 醫療欄位：只在 `MEDICAL_PAPER_REVIEW` 顯示。
- 未記錄模型資訊：公開頁顯示 `UNKNOWN / NOT RECORDED`。
- 檔案 MIME / 大小超限：上傳被拒絕。
- PDF 檔案簽章不是 `%PDF-`：完成驗證時移除檔案並拒絕建立紀錄。
- 英文與繁中公開路由可切換。

## 文件與測試

- Storage：`docs/STORAGE_SETUP.md`
- Vercel：`docs/VERCEL_DEPLOYMENT.md`
- 管理員操作：`docs/ADMIN_OPERATIONS.md`
- 測試紀錄：`docs/TEST_REPORT.md`
- 規格對照：`docs/REQUIREMENTS_MATRIX.md`
- 靜態視覺檢查：`screenshots/`

本次執行環境已完成結構、安全、邏輯、TypeScript 語法，以及以外部套件型別 stub 進行的本地語意／未使用符號檢查。`npm install` 因內部 registry 對 `@supabase/ssr` 回傳 404 而失敗；直接指定公共 registry 的重試也無法解析外部網域，因此 build、lint、完整 framework typecheck 與外部部署不得標記為 PASS。細節見測試報告。

## 誠實邊界

此 repository 提供完整應用程式碼、migration、RLS、Storage policy 與部署文件；它不代表 Supabase 專案或 Vercel 部署已在外部帳號中實際建立。只有完成外部環境設定、migration 執行、帳號建立、安裝依賴與部署測試後，才能宣稱正式上線。
