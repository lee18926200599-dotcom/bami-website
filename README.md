# 八米科技官网

`www.8bami.com` 官方网站的静态站点源代码。

## 本地预览

本项目不需要构建。请在项目根目录启动本地 HTTP 服务：

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

然后访问 <http://127.0.0.1:8000/>。

请通过 HTTP 服务预览，不要直接双击 HTML 文件。

## 目录说明

- `*.html`：官网页面
- `css/`：共享样式
- `js/`：页面逻辑、多语言内容与业务数据
- `images/`：官网图片资源
- `scripts/`：SEO、语言、响应式与视觉检查脚本
- `sitemap.xml`、`robots.txt`：搜索引擎配置

## 性能资源构建

修改页面文案、语言内容或重点图片后，按顺序执行：

```bash
node scripts/build-language-packs.js
python3 scripts/optimize-images.py
node scripts/prerender-language-selects.js
node scripts/apply-security.js
node scripts/security-audit.js
node scripts/prepare-deploy.js
```

- 如果本机没有 Pillow，先执行 `python3 -m pip install Pillow`。
- `build-language-packs.js`：按页面生成越南语、泰语、印尼语小语言包。
- `optimize-images.py`：生成首页、新闻、案例等页面使用的优化 WebP 图片。
- `prerender-language-selects.js`：预生成语言下拉和首屏性能样式。
- `apply-security.js`：重新计算 CSP 哈希。
- `prepare-deploy.js`：生成只包含官网文件的 `dist/` 部署目录。

## 日常 Git 操作

拉取远端最新代码：

```bash
git pull --rebase
```

提交并推送本地修改：

```bash
git add -A
git commit -m "说明本次修改"
git push
```

远端仓库：<https://github.com/lee18926200599-dotcom/bami-website>
