gbf-prpr
===============

使用 Twitter API 取得 GBF 救援ID 並顯示的工具網頁

demo:
http://prpr.pickoma.com/

# 專案由來

- 試著在AP/BP半減活動中用這工具湊齊突滿方陣武~~(想當然這是不可能的事)~~
- 試用 bootstrap
- 試用 websocket
- 試用 ec2 & gce
- 試用 cloudflare
- 試買 網址
- ~~試，都試~~

# 目前架構

```
 (websocket support)
[ie10,firefox,chrome]                              [gce]
       Browser <-------- CloudFlare <-------> WebSocket Server (NodeJS)
```

# 目前功能

- 使用 REST API & Streaming API 取得救援ID
- 紀錄發過救援ID過的帳號，隔天取次數最多的前2000名丟進 Streaming API 中 ( Streaming API 似乎不吃CJK字串)
- 每五秒自動更新
- 可以依照分類開關顯示

# 預計~~(放棄)~~功能

- HTTPS
- HTTP/2 
- Secure WebSocket
- 撈wiki上的救援ID?
- 繪製統計圖表 (每小時的救援數量增減、Twitter帳號的救援數量比較 ... etc )

# 已知技術上問題

- 救援ID不能即時查詢出來(20秒以後?小巴丁丁什麼的很難有機會進場...~~我只進去兩三次過~~)
- 偶爾會斷線(~~覺得是cloudflare的問題~~)
- 拆字串方式很奇怪
- 分類方式很奇怪
- 一天累積的救援ID好像有點多
- 不知道為什麼 Streaming API 丟入 2000多個userid後就會報錯 (看文件是最大5000?)
- Streaming API的 follow 名單挑選條件不知道怎樣才好
- Streaming API 的搜尋條件似乎不吃CJK字串

# 已知使用上問題

- 救援ID有可能重複 (不同人在同場戰鬥發起救援?)
- Streaming API 有時會沒有反應 (定時重新執行?)
- 每五秒自動更新時造成的畫面排版更動

# 其它

~~誰可以去跟官方說救援tweet可以弄個英文關鍵字嗎~~