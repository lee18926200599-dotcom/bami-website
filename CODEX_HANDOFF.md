# 八米科技官网项目交接

更新日期：2026-11-24  
项目目录：`/Users/mac/Desktop/202601/8bami.com`  
生产域名：`https://www.8bami.com`  
仓库：`git@github.com:lee18926200599-dotcom/bami-website.git`

## 1. 先读这一段

这是一个**无构建步骤的静态官网**。直接编辑 HTML、CSS、JavaScript 和图片，然后部署整个静态目录即可。

当前最重要的状态：

- 当前分支是 `main`，基于 `daf1bf9 Initial commit: 8bami.com website v14`。
- 官网最新改版大量内容**仍在本地工作区，尚未提交到 GitHub**。
- 不能只在新电脑执行 `git clone`。那样只能拿到初始版本，拿不到现在的页面改版、多语言、区域新闻、SEO、隐私页和装箱方案。
- 跨电脑迁移时，应复制**整个项目文件夹**，包括 `.git`、已修改文件、未跟踪文件、`js/`、`images/`、`scripts/` 和 `output/`。
- 当前仓库共有 44 个 HTML 页面，其中 8 个旧英文页；静态 SEO 检查为 40 个可索引页面、32 个站点地图 URL。

## 2. 当前目标与完成度

官网主要包含：

- 首页、产品、解决方案、客户案例、关于我们、新闻、服务支持、联系我们。
- AI 数字员工、WMS、TMS、OMS 四条产品线。
- 快消零售、医药物流、跨境电商、第三方物流等解决方案。
- 新闻列表、新闻详情和东南亚区域新闻。
- 中文、英文、越南语、泰语、印尼语。
- SEO、Open Graph、结构化数据、Hreflang、站点地图。
- 隐私政策、Formspree 咨询表单和 `generate_lead` 埋点事件。
- 联系页地图、WhatsApp、微信二维码及系统登录入口。

当前官网静态层可以运行，SEO 和语言回归检查通过。正式投放前还需要补充部署、统计代码、表单收件验证和业务资料确认，详见“已知问题”。

## 3. 技术栈

- HTML5：大部分页面把 CSS 和少量页面脚本直接写在 HTML 内。
- CSS：共享样式位于 `css/`，但不少页面仍有独立内联样式。
- JavaScript：原生 ES5/ES6，无框架、无打包器、无 npm 构建流程。
- 数据：产品、方案、案例、新闻使用全局 JS 数据对象。
- 国际化：`js/lang.js` 加按需加载的语言包。
- SEO：`scripts/apply-seo.js` 批量写入 canonical、Hreflang、OG、JSON-LD、robots 和 sitemap。
- 自动化测试：Playwright，本地 HTTP 服务为 Python `http.server`。
- 部署形态：静态文件托管。

当前没有：

- `package.json`、`package-lock.json`
- 前端构建命令
- Git LFS
- 后端服务
- 数据库
- CI/CD 配置

## 4. 本地启动

必须通过 HTTP 服务访问。直接双击 `index.html` 可能遇到本地存储、语言包、地理位置或表单行为差异。

```bash
cd /path/to/8bami.com
python3 -m http.server 8000 --bind 127.0.0.1
```

然后访问：

```text
http://127.0.0.1:8000/
```

常用页面：

```text
http://127.0.0.1:8000/index.html
http://127.0.0.1:8000/products.html
http://127.0.0.1:8000/solutions.html
http://127.0.0.1:8000/cases.html
http://127.0.0.1:8000/news.html
http://127.0.0.1:8000/contact.html
```

页面脚本使用相对路径，保持项目根目录就是站点根目录，不要单独移动某个 HTML 文件。

## 5. 新电脑环境

建议安装：

- Node.js 22 或更新的 LTS 版本
- Python 3
- Git
- Chrome 或 Playwright Chromium

当前自动化脚本使用 `@playwright/test`。这个仓库没有声明依赖，先在新电脑项目根目录执行：

```bash
npm init -y
npm install --save-dev @playwright/test
npx playwright install chromium
```

如果新电脑暂时使用全局安装：

```bash
npm install -g @playwright/test
NODE_PATH="$(npm root -g)" node scripts/test-geo-language.js
```

如果新建了 `package.json`，记得把页面项目本身的静态部署范围与开发依赖分开。

## 6. 目录速查

```text
8bami.com/
├── index.html                 # 中文首页
├── *-en.html                  # 旧英文页面
├── product-ai.html            # AI 数字员工
├── product-wms.html           # WMS
├── product-tms.html           # TMS
├── product-oms.html           # OMS
├── products.html              # 产品总览
├── product-detail.html        # 基于 ?id= 的产品详情模板
├── solution-*.html            # 四类解决方案
├── solutions.html             # 解决方案总览
├── solution-detail.html       # 基于 ?id= 的方案详情模板
├── cases.html                 # 客户案例
├── about.html                 # 关于八米
├── news.html                  # 新闻列表
├── news-detail-23.html ~ 37   # 独立新闻详情
├── news-detail.html           # 旧详情模板，已 noindex
├── contact.html               # 联系方式与表单
├── privacy.html               # 隐私政策
├── support.html               # 服务支持
├── thanks.html                # 表单提交成功页，已 noindex
├── css/
│   ├── main.css               # 旧版共享样式
│   ├── responsive.css         # 移动端兼容
│   └── style.css              # 详情模板样式
├── js/
│   ├── geo-boot.js            # 语言应用前的防闪烁脚本
│   ├── lang.js                # 语言选择、地理识别和语言包加载
│   ├── lang-vi*.js            # 越南语
│   ├── lang-th*.js            # 泰语
│   ├── lang-id*.js            # 印尼语
│   ├── main.js                # 粒子、导航、数字动画、表单辅助
│   ├── products-data.js       # 产品详情数据
│   ├── solutions-data.js      # 方案详情数据
│   ├── clients-data.js        # 客户与案例数据
│   └── news-data.js           # 新闻数据
├── images/                    # 官网图片与客户 LOGO，约 40 MB
├── scripts/                   # SEO、语言、响应式、视觉检查
├── output/proposal/           # 装箱核验方案与系统原型，不参与官网构建
├── SEO-AUDIT.md               # SEO 现状及投放前事项
├── IMAGE-CREDITS.md           # 区域新闻图片来源和许可
├── robots.txt
└── sitemap.xml
```

不要部署：

- `.git/`
- `.DS_Store`
- `scripts/`
- `output/`
- `*.md`
- `bami-website-v14.textClipping`

## 7. 页面架构

### 7.1 静态独立页面

首页、产品页、方案页、关于、新闻、联系等是独立 HTML。共享逻辑很少，修改某页视觉时优先查看该 HTML 自身的内联 CSS 和页面底部脚本。

### 7.2 查询参数详情模板

产品详情：

```text
product-detail.html?id=ai
product-detail.html?id=wms
product-detail.html?id=tms
product-detail.html?id=oms
```

方案详情：

```text
solution-detail.html?id=retail
solution-detail.html?id=pharma
solution-detail.html?id=crossborder
solution-detail.html?id=tpl
solution-detail.html?id=manufacturing
solution-detail.html?id=logistics
```

数据和渲染逻辑：

- 产品：`js/products-data.js` → `product-detail.html`
- 方案：`js/solutions-data.js` → `solution-detail.html`

这两个模板当前是 `noindex, follow`，且没有收录进 sitemap。

### 7.3 新闻

主新闻入口是 `news.html`，最新三条区域新闻指向：

```text
news-detail-35.html  # 越南 4PL
news-detail-36.html  # 泰国 TMS + WMS
news-detail-37.html  # 印尼 OMS + WMS
```

其他新闻为 `news-detail-23.html` 至 `news-detail-34.html`。

`news-detail.html` 是旧模板，当前 `noindex`。新增新闻时优先照着最新独立页面的结构制作，并同步：

1. 页面正文和图片
2. `scripts/apply-seo.js` 中的 `articleMeta`
3. `sitemap.xml`
4. 新闻列表 `news.html`
5. 多语言新闻翻译数据

## 8. 视觉规范

主视觉是深色科技风：

- 主色：`#FF6B35`
- 浅橙：`#FF8A5C`
- 深色背景：`#0A0E1A`
- 卡片背景：`#1A2235`
- 次级正文：`#C5C9D6`
- 弱化文字：`#8B92A8`
- 青色数据色：`#00C9A7`

页面以深色背景、橙色渐变、圆角卡片、轻发光和信息展示为主。修改时保持以下规则：

- 页面只有一个主 `h1`。
- 保持中文和英文文案在 `data-zh`、`data-en` 属性中同步存在。
- 不删除 `js/geo-boot.js`，否则自动语言选择前会闪出中文。
- 保持手机端导航、语言下拉和悬浮咨询按钮可用。
- 图片优先使用本地 `images/`，避免新增不稳定外链。

## 9. 多语言机制

支持语言：

- `zh`：中文
- `en`：English
- `vi`：Tiếng Việt
- `th`：ไทย
- `id`：Bahasa Indonesia

语言选择优先级：

1. URL 中的 `?lang=xx`
2. 用户手动选择并保存在本地存储中的语言
3. IP 国家/地区自动识别
4. 识别失败时回退英文
5. 搜索引擎爬虫保持静态页面语言，中文页默认中文

关键本地存储：

```text
bami_lang
bami-lang
bami_lang_preference
bami_geo_language
bami_geo_language_at
```

页面入口：

- HTML 中的 `data-zh` / `data-en`
- `title` 上的 `data-zh` / `data-en`
- `js/lang.js`
- 越南语：`js/lang-vi-content.js`、`js/lang-vi.js`
- 泰语：`js/lang-th-content.js`、`js/lang-th.js`
- 印尼语：`js/lang-id-content.js`、`js/lang-id.js`
- 新闻：`js/lang-news-content.js`

公开 API：

```js
window.BAMI_LANG.get()
window.BAMI_LANG.set("vi")
window.BAMI_I18N.register(...)
document.addEventListener("bami:languagechange", handler)
```

重要注意事项：

- 越南语、泰语、印尼语翻译主要按**完整中文文本精确匹配**。
- 修改页面中文文案后，必须同步修改三套语言包，否则该句会回退成中文。
- 动态插入的内容需要被语言包的 `MutationObserver` 捕捉，或主动调用翻译器。
- 新增语言通常需要新增 content catalog 和 translator 两组文件，并在 `js/lang.js` 的 `languageAssets` 中注册。

## 10. 表单和外部服务

咨询表单在 `contact.html` / `contact-en.html`：

```text
POST https://formspree.io/f/xreywwro
```

提交成功：

- 跳转 `thanks.html`
- 推送：

```js
window.dataLayer.push({
  event: "generate_lead",
  form_name: "contact",
  language: lang
});
```

当前尚未配置 GA4 和 Google Ads 转换代码，仅预留了 `dataLayer` 事件。

外部服务：

- Google Fonts
- Formspree
- Google Maps
- `ipwho.is` / `ipinfo.io` 语言识别
- 产品详情和方案详情从 cdnjs 加载 Font Awesome

页面的 CSP 写在 Meta 标签里。新增第三方资源时必须同步修改所有相关页面的 CSP，否则浏览器会拦截。

## 11. SEO 工作方式

查看现状：

```bash
sed -n '1,220p' SEO-AUDIT.md
```

执行检查：

```bash
node scripts/audit-seo.js
```

2026-11-24 当前结果：

- HTML 页面：44
- 可索引页面：40
- Sitemap URL：32
- 内部断链：0
- 阻塞问题：0

批量写入 SEO：

```bash
node scripts/apply-seo.js
```

注意：此脚本会重写所有 HTML 的 Meta、canonical、OG、Twitter、JSON-LD，并重建 `robots.txt` 和 `sitemap.xml`。运行前先确认工作区，运行后必须查看 `git diff`。

不要对 `product-detail.html`、`solution-detail.html`、`news-detail.html`、`thanks.html` 做索引。当前它们应为 `noindex, follow`。

生产 URL 固定为：

```text
https://www.8bami.com
```

## 12. 自动化测试

先启动本地服务：

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

语言识别测试：

```bash
node scripts/test-geo-language.js
```

越南语、泰语、印尼语全套页面检查：

```bash
BAMI_TARGET_LANG=vi node scripts/check-vietnamese.js
BAMI_TARGET_LANG=th node scripts/check-vietnamese.js
BAMI_TARGET_LANG=id node scripts/check-vietnamese.js
```

移动端检查：

```bash
BAMI_TARGET_LANG=vi node scripts/mobile-check.js
```

视觉检查：

```bash
BAMI_TARGET_LANG=vi node scripts/visual-check.js
```

2026-11-24 已验证结果：

- SEO：44 页、0 断链、0 问题。
- 语言识别：16 个场景全部通过。
- `vi` / `th` / `id`：各检查 53 个路由/模板，残留中文为 0，语言错误为 0，浏览器脚本错误为 0。
- 390px 移动端：测试的 8 个主要页面没有页面级横向溢出。
- 移动端 `privacy.html` 中检测到的“中文”来自语言选择器，不是正文残留。

测试会生成：

```text
scripts/seo-audit-result.json
scripts/vi-check-report.json
scripts/th-check-report.json
scripts/id-check-report.json
```

这些 JSON 是 QA 产物，不是部署必需文件。

## 13. 部署

这是静态站点，没有构建命令。将项目根目录中的静态资源上传到生产站点根目录：

- 所有 `*.html`
- `css/`
- `js/`
- `images/`
- `robots.txt`
- `sitemap.xml`

部署后需要检查：

1. 首页、四个产品页、方案页、新闻页、联系页可访问。
2. 图片和字体正常加载。
3. 语言切换、URL `?lang=` 和自动地区识别正常。
4. Formspree 表单能送达指定邮箱。
5. `https://www.8bami.com/sitemap.xml` 和 `robots.txt` 可访问。
6. 非 www、HTTP 和 `/index.html` 的 301 跳转由服务器或 CDN 配置完成。

仓库内没有服务器、CDN、DNS 或重定向配置，正式部署信息需要向站点管理员确认。

## 14. 已知问题与待办

### P1：正式投放前处理

1. `index-en.html` 第 21 行 `<title>` 标签格式异常，建议改为完整合法的 `<title>`，并同步检查英文首页 SEO 数据。
2. `product-detail.html` 和 `solution-detail.html` 加载 `cdnjs.cloudflare.com` 的 Font Awesome，但当前 CSP 的 `style-src` 没有允许该域名。图标可能被拦截，建议自托管字体文件，或补 CSP。
3. `js/clients-data.js` 中有若干图片路径与现有文件不一致，例如 `client-kingmed.png`、`case-shenghui.jpg`；如果 `/cases` 或详情模板启用这些数据，会出现图片 404。
4. GA4 Measurement ID 和 Google Ads Conversion ID/Label 尚未写入。
5. Formspree `xreywwro` 的实际收件、反垃圾和成功邮件需要人工验证。
6. 海外分支地址、电话、服务年限和客户案例数据需要业务方最终确认。
7. 若投放 EEA/UK 广告，需要 Consent Mode v2 和合规的 Cookie 同意界面。

### P2：后续优化

1. 当前页面内联 CSS 较多，样式重复。若要长期维护，可逐步抽离为共享组件样式，但不要一次性重构全部页面。
2. 多语言目前是客户端翻译加查询参数 URL。若重视东南亚自然搜索，后续可预渲染 `/vi/`、`/th/`、`/id/` 独立路径。
3. 增加图片压缩和 `srcset`，尤其是首页、关于页和新闻图。
4. 考虑把 Font Awesome 和 Google Fonts 自托管，减少第三方依赖。
5. 增加自动化截图基线，防止移动端和语言切换样式回归。

## 15. 与官网无关的装箱核验方案

`output/proposal/` 是另一项商务材料，不属于官网页面：

```text
output/proposal/proposal.html
output/proposal/八米科技_跨境装箱核验方案.pdf
output/proposal/ui-dashboard.html
output/proposal/ui-import.html
output/proposal/ui-pda.html
output/proposal/ui-record.html
output/proposal/screenshots/
```

它包含临时系统原型、截图和报价方案。只在需要继续修改该方案时处理，不要把这些页面加进官网导航、sitemap 或站点部署包。

## 16. 工作区现状

基线提交：

```text
daf1bf9 Initial commit: 8bami.com website v14
```

当前分支与远端：

```text
main -> origin/main
```

当前 `main` 的本地工作区包含大量未提交改动：

- 46 个已修改文件
- 多语言语言包、区域新闻、隐私页、SEO 报告和自动化脚本
- 2026 年东南亚区域新闻图片
- `output/` 装箱方案
- 现有 `.DS_Store` 改动

接手前必须执行：

```bash
git status --short --branch
git log -5 --oneline --decorate
```

不要在不确认范围时执行：

```bash
git reset --hard
git clean -fd
git checkout -- .
```

这些操作会丢失当前尚未提交的官网改版。

## 17. 跨电脑迁移清单

1. 复制整个项目目录，不要只复制 Git 仓库或只执行 clone。
2. 优先使用压缩包或 `rsync`，并保留 `.git`、未跟踪文件和修改过的图片。
3. 复制后在另一台电脑执行 `git status --short --branch`。
4. 对比原电脑的状态，至少确认 `js/geo-boot.js`、`js/lang-*.js`、`news-detail-35~37.html`、`privacy.html`、`scripts/`、`output/` 都在。
5. 安装 Playwright 和 Chromium。
6. 启动本地 HTTP 服务并打开首页。
7. 执行 SEO、地区语言、三种海外语言和移动端检查。
8. 确认无误后再开始功能修改。

可以用下面的命令生成迁移包：

```bash
cd /Users/mac/Desktop/202601
zip -r bami-website-handoff-2026-11-24.zip 8bami.com \
  -x '*.DS_Store'
```

以上命令会保留 `.git`、已修改文件和未跟踪文件。如果新电脑完全不需要 Git 历史，可另外排除 `*/.git/*`；是否把 `output/` 放进迁移包，取决于新电脑是否还要继续处理装箱核验方案。

## 18. 建议新电脑上的 Codex 首先做什么

先用只读检查建立上下文：

1. 读取本文件、`SEO-AUDIT.md`、`IMAGE-CREDITS.md`。
2. 查看 `git status --short --branch`。
3. 查看 `index.html`、`js/lang.js`、`js/geo-boot.js`。
4. 启动本地服务并打开中文、英文、越南语首页。
5. 执行 SEO 和语言检查。
6. 在未确认业务资料和部署账号前，不要运行 `apply-seo.js`、不要批量重写页面、不要清理未跟踪文件。

## 19. 建议给新 Codex 的启动提示词

```text
请先阅读 CODEX_HANDOFF.md、SEO-AUDIT.md 和 IMAGE-CREDITS.md。
这是一个无构建步骤的静态官网，当前大量改版仍在 Git 工作区且未提交。
先检查 git status，再启动本地服务，确认中文/英文/越南语首页和现有 SEO、语言回归测试。
不要执行 git reset、git clean、git checkout -- 或批量运行 apply-seo.js。
完成检查后，按我的具体需求修改，并保留 output/proposal 与官网主项目的边界。
```

