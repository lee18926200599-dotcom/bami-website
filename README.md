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
