/**
 * @origin bycat
 * @create_at 2024-12-14 21:35:47
 * @author bycat
 * @version v1.0.0
 * @title 新闻早报
 * @class 新闻类
 * @description 🌞早安侠你好，指令：早报。
 * @platform qq wx tg cron
 * @rule ^早报$
 * @cron 0 0 7 * * *
 * @priority 20
 * @admin false 
 * @public false
 */

//sender
const s = sender
const sillyGirl = new SillyGirl()

var { body: { imageUrl: url } } = request({ url: "https://api.2xb.cn/zaob", dataType: "json" });

//图文消息
var content=image(url);
    var groups = [
    {
         platform: "qq",
        chatId: "群号",
    },
    {
         platform: "qq",
        chatId: "群号",
    },
    ]
    for (var i = 0; i < groups.length; i++)
    {
        groups[i]["content"] = content
        sillyGirl.push(groups[i])
    }
