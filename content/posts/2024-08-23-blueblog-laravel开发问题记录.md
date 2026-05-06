---
title: "BlueBLOG开发 - Laravel开发过程中的一些问题"
date: 2024-08-23T16:32:09+08:00
lastmod: 2024-08-26T19:02:41+08:00
draft: false
author: "LandonBlue"
description: "BlueBLOG是基于Laravel开发的轻量化博客系统，记录开发过程中遇到的一些问题"
tags: ["Laravel", "PHP", "BlueBLOG", "Livewire"]
categories: ["技术"]
---

# BlueBLOG开发 - Laravel开发过程中的一些问题

目前，你所看见的这个BLOG系统，实际上是我用LARAVEL手敲的，并不是说重复造轮子（虽然我造过很多）主要是为了能够在轻量化的情况下添加上我所需要的功能。

<!-- more -->

## 技术栈

既然是为了轻量化，那这个BLOG程序所用的技术不多，仅仅是Laravel全家桶。数据库也没有部署在MySQL这类在线数据库上，而是直接用自带的Sqlite，简单直接。也方便数据的转移和备份。

**所有用到的库：**

- Laravel11
- Livewire
- Cherry Markdown

> 如果你也想部署一个这样的博客，那非常欢迎！但是需要你有一定的编程基础！

开源地址：[gitee.com/kingsr/blue-blog](https://gitee.com/kingsr/blue-blog)

## 问题记录

### 01 - 使用Cherry Markdown后，Livewire的双向绑定无法生效

这个问题的解决其实还是很凑巧的。一开始，我用过 TinyMCE、WangEditor 等富文本编辑器，但是他们的内容始终无法绑定到 Livewire 上。

**问题描述：** 他没办法直接将编辑器中的 markdown 文本保存在变量中

**解决方案：** 将需要绑定的内容通过 Livewire 内置的 Javascript 块在编辑器的回调中绑定。

**代码示例：**

```blade
@script
<script>
    new Cherry({
        id: 'markdown-container',
        value: '',
        fileUpload: fileUploadFunc,
        callback: {
            afterChange: function(md, html) {
                // 关键程序段
                $wire.content = md;
            }
        },
    });
</script>
@endscript
```

**说明：**

- 解决方案中，将编辑器的初始化代码放在了 Livewire 特有的 `@Javascript` 代码块中
- 通过编辑器内容变化回调 `afterChange` 中，使用 `$wire` 对象动态绑定编辑内容
- ⚠️ **注意：** 这种绑定是**单向的**，即**前端 → 后端**，后端的数据更新不会影响前端！

### 02 - 访问后台时 livewire.js 显示 Not Found

**解决方案：** 在根目录下运行以下命令：

```bash
php artisan livewire:publish --assets
```
