---
title: "JavaScript 异步编程完全指南"
date: 2026-03-15T14:00:00+08:00
draft: false
tags: ["JavaScript", "异步", "编程"]
categories: ["技术"]
summary: "从回调地狱到 Promise，再到 async/await——JavaScript 异步编程的演进史，以及如何在现代项目中正确使用它们。"
---

JavaScript 是单线程语言，异步是它最核心的设计之一。掌握异步编程，是真正理解 JS 的必经之路。

## 从回调开始

最早的异步方案是**回调函数**：

```javascript
fs.readFile('data.txt', function(err, data) {
  if (err) throw err;
  console.log(data);
});
```

问题在于，当异步操作嵌套多层，代码就成了臭名昭著的"回调地狱"：

```javascript
getData(function(a) {
  getMoreData(a, function(b) {
    getEvenMoreData(b, function(c) {
      // ...这里还有更深的嵌套
    });
  });
});
```

可读性和可维护性极差。

## Promise 的出现

ES6 引入了 `Promise`，将异步操作的状态（pending / fulfilled / rejected）显式化：

```javascript
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

链式调用替代了嵌套，代码更线性。

## async/await — 同步风格写异步

ES2017 引入的 `async/await` 是目前最推荐的方式：

```javascript
async function loadData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

看起来和同步代码几乎一样，心智负担大幅降低。

## 并行执行

当多个异步操作互不依赖时，用 `Promise.all` 并行执行：

```javascript
const [users, posts] = await Promise.all([
  fetchUsers(),
  fetchPosts()
]);
```

这比顺序执行快得多。

## 总结

| 方案 | 时代 | 优点 | 缺点 |
|------|------|------|------|
| 回调 | ES5 | 简单直接 | 嵌套混乱 |
| Promise | ES6 | 链式清晰 | 稍显冗长 |
| async/await | ES2017 | 同步风格，可读性强 | 需理解 Promise 基础 |

现代项目中，`async/await` + `Promise.all` 几乎能覆盖所有异步场景。
