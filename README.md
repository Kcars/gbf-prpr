gbf-prpr
===============

使用 Twitter API 取得 GBF 救援ID 並顯示的工具網頁

demo:
https://prpr.pickoma.com/

# 目前架構

```
 (websocket support browser)
    [ie10,firefox,chrome]                                  [gce]
           Browser <-------- CloudFlare <-------> WebSocket Server @ 8843    (nodejs)
                                                  Web Server       @ 80      (nginx)
                                                  twitter-api-services       (nodejs)
                                                  twitter-streaming-services (nodejs)
                                                  redis server
```
 
# 目前功能

- 使用 REST API & Streaming API 取得救援ID
- 每五秒自動更新
- 可以依照分類開關顯示

# 其它

~~誰可以去跟官方說救援tweet可以弄個英文關鍵字嗎~~

