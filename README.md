# QwQ Socket

一个有趣的长连接通信库(及协议)  
适用于 nodejs 和 web

## 为什么使用这个库?

-   ### 提高接口安全性
    在任意一端检查传入的类型是否符合规范
-   ### 使用简单
    仅需配置需要的事件和类型即可使用  
    并能以最快的方式上手
-   ### 查询与返回
    支持在服务器或客户端向对端发起请求  
    并等待响应  
    使用方法就像调用本地的异步函数一样简单
-   ### 与各种序列化方式兼容
    协议并不指定序列化方案  
    用你喜欢的任何方式  
    JSON JSOBin 或你能想到的其他方式...
-   ### 事件名压缩
    QwQ socket 协议在内部将事件名转为简短形式  
    无需手动使用缩写事件名  
    放心的使用更长的事件名以提高代码和接口文档的可读性

## 文档

-   [使用方法](https://github.com/qwq0/qwqSocket/blob/main/docs/start.md)
-   [API 文档](https://github.com/qwq0/qwqSocket/blob/main/docs/api/README.md)
-   [协议规范](https://github.com/qwq0/qwqSocket/blob/main/docs/protocol.md)
