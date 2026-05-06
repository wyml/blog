---
title: "用 Hugo 搭建极简博客的完整指南"
date: 2026-05-06T10:00:00+08:00
draft: false
tags: ["Hugo", "建站", "静态站点"]
categories: ["技术"]
summary: "Hugo 是目前最快的静态站点生成器之一，本文记录从零开始搭建个人博客的完整过程，涵盖安装配置、主题开发和部署三个阶段。"
---

Hugo 是目前最快的静态站点生成器之一，使用 Go 语言编写，毫秒级构建速度令人印象深刻。本文记录从零搭建个人博客的完整过程。

## 为什么选择 Hugo

市面上的静态站点生成器不少——Jekyll、Hexo、Gatsby、Next.js，为什么选 Hugo？

- **速度极快**：千页站点毫秒级完成
- **单二进制文件**：无需 Node.js 或 Ruby 环境
- **模板系统强大**：Go template 灵活且高效
- **内容组织清晰**：文件夹即分类

## 安装

在 Windows 上通过 winget 安装：

```bash
winget install Hugo.Hugo.Extended --accept-source-agreements
```

验证安装：

```bash
hugo version
```

## 创建站点

```bash
hugo new site my-blog
cd my-blog
```

这会生成以下结构：

```
my-blog/
├── archetypes/     # 内容模板
├── assets/         # 需要处理的资源文件
├── content/        # 内容目录
├── data/           # 数据文件
├── layouts/        # 自定义布局
├── static/         # 静态文件
├── themes/         # 主题
└── hugo.toml       # 配置文件
```

## 自定义主题

创建主题骨架，然后实现 `baseof.html` 作为基础布局，其他模板通过 `{{ define "main" }}` 注入内容。

```html
{{ define "main" }}
  <article class="post">
    <h1>{{ .Title }}</h1>
    {{ .Content }}
  </article>
{{ end }}
```

## 本地开发

```bash
hugo server --buildDrafts
```

访问 `http://localhost:1313` 即可实时预览，修改文件后浏览器自动刷新。

> 使用 `--buildDrafts` 参数可以显示草稿文章，方便开发阶段查看。

## 部署

Hugo 生成的是纯静态文件，`hugo` 命令后在 `public/` 目录获取所有文件，可部署到任意静态托管服务：

- **GitHub Pages**：免费，配合 GitHub Actions 自动构建
- **Netlify**：连接仓库，自动构建+CDN
- **Vercel**：极速全球 CDN

本站使用 Edge 主题，设计理念：简约、棱角、直指本质。
