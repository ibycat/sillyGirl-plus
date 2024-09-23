/**
 * @author 搜剧
 * @origin ibycat
 * @create_at 2024-04-20 13:34:03
 * @description 可分享本地dj，如本地无则联网获取。交流QQ群：544910978
 * @version v1.0.2
 * @title 搜剧
 * @rule 搜[剧名]
 * @rule 追更 [追更]
 * @rule 反馈 [反馈]
 * @rule ^(短剧|追更|反馈)$
 * @cron 1 * * * *
 * @admin false
 * @public false
 * @priority 2
 * @disable false
 */


const s = sender
const dj = new Bucket("dj")
const djName = s.param("剧名")
const djcc = s.param("追更")
const djas = s.param("反馈")
const djsub = new Bucket("djsub")
let djj = dj.keys()
const sillyGirl=new SillyGirl()
const matchingDjj = djj.filter(movie => movie.includes(djName))



//联网
function web(){
  var{body} = request({
    url: `https://dj.bycat.tk/?djName=${djName}`,
    method: "get",
    allowredirects: false, // 不禁止重定向
  });
  
  if(body){
    const djWeb = body.split("\"result\">")[1].split("</div>")[0].replace(/<p[^>]*>|<\/p>/g, "")
    s.reply(djWeb);
    if(djWeb.match(/没搜到/)){
      sillyGirl.push({platform: "qq", userId: "***", content: `没搜到：${djName}\n${s.getChatId()}：${s.getUserName()}：${s.getUserId()}`})
    }else{
      sillyGirl.push({platform: "qq", userId: "***", content: `free：${djName}\n${s.getChatId()}：${s.getUserName()}：${s.getUserId()}`})
    }
  }else{
    s.reply("请检查网络是否正常！");
  }
}

//追更
function sub(){
  if(djsub.get(djcc)){
    const oldQQ = djsub.get(djcc)
    if(s.getUserId() === oldQQ || oldQQ.includes(s.getUserId())){
      s.reply("已追更过该剧！")
      return
    }else{
		  const newQQ = `${oldQQ},${s.getUserId()}`
      djsub.set(`${djcc}`, newQQ)
	  }
  }else{
    djsub.set(`${djcc}`,`${s.getUserId()}`)
  }if(s.getChatId()){
    s.reply("追更成功！\n请加我好友，收录后通知你")
    sillyGirl.push({platform: "qq", userId: "***", content: `追更：${djcc}\n群：${s.getChatId()}：${s.getUserId()}`})
    return
  }else{
    s.reply("追更成功！\n收录后会通知你")  
    sillyGirl.push({platform: "qq", userId: "***", content: `追更：${djcc}\n${s.getUserName()}：${s.getUserId()}`})
    return
  }
}

//分发
function subNotify(){
  if(djsub){
    // 遍历 djsub.keys() 中的每个键
    for(const key of djsub.keys()){
      if(djj.some(movie => movie.includes(key))){
        const qqId = djsub.get(key)
        const qqIds = qqId.split(',')
        if(qqIds.length > 1){
          for(const qqId of qqIds){
          sillyGirl.push({platform: "qq", userId: qqId, content: `追剧已更新：${key}\n赶快搜索观看吧（此消息只推送一次）`})
          djsub.delete(key)
          }
        }else{
          sillyGirl.push({platform: "qq", userId: qqId, content: `追剧已更新：${key}\n赶快搜索观看吧（此消息只推送一次）`})
          djsub.delete(key)
        }
      }
    }
  }
}


function main(){
  //分发
  if(sender.getPlatform() == "cron"){
    subNotify()
    return
  }
  //追更
  if(djcc){
    sub()
    return
  }
  //反馈
  if(djas){
    //sillyGirl.notifyMasters(`短剧反馈：${s.getUserName()}：${s.getUserId()}\n\n${djas}`) 
    sillyGirl.push({platform: "qq", userId: "***", content: `短剧反馈：${s.getUserName()}：${s.getUserId()}\n\n${djas}`})
    s.reply("发送反馈成功，请稍后再试")
    return
  }
  if(s.getContent() == "短剧"){
    s.reply("命令：搜剧名\n示例：搜练气十万年 或 搜十万年\n说明：可搜短剧、动漫，“追更”多的都会上链接")
    return
  }if(s.getContent() == "追更"){
    s.reply("请发：追更 剧名\n比如：追更 练气十万年")
    return
  }if(s.getContent() == "反馈"){
    s.reply("请发：反馈 反馈内容\n比如：反馈 链接过期了")
    return
  }if(djj.includes(djName)){
    s.reply(`${djName} ${dj.get(djName)}\n保存网盘后即可观看`)
    sillyGirl.push({platform: "qq", userId: "***", content: `free：${djName}\n${s.getChatName()}：${s.getChatId()}：${s.getUserName()}：${s.getUserId()}`})
    return
  }if(matchingDjj.length > 0){
    s.reply(`外链中匹配到剧名，请重新搜全名：\n\n${matchingDjj}`)
    return
  }else{
    web()
    return
  }
}

main()
