# 1.先配置云函数的运行的参数,"填写自己的" ,换成自己的,就可以了
``` 
/uni_modules/uni-config-center/uniCloud/cloudfunctions/common/uni-config-center/uni-id/config.json
```
# 2. 上传云函数与初始化数据库,不再累赘,不会的自己去官网看

# 3. mainifest.json填写自己的小程序appid
# 4. 小程序->开发管理->配置自己的域名(云函数路径)与消息推送地址(https://你的云函数路径/wxMediaCheck),消息推送内容安全图片的回调,违规的图片会自动删除
# 5  云函数wxapi设置URL的PATH部分" /"

