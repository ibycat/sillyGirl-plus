/**
 * @author 搜短剧
 * @origin ibycat
 * @create_at 2024-04-20 13:34:03
 * @description 可分享本地dj，如本地无则联网获取。交流QQ群：544910978
 * @title 搜短剧
 * @rule 搜[剧名]
 * @rule ^短剧$
 * @public false
 * @version v1.0.0
 */


const s = sender
const dj = new Bucket("dj")
const djName = s.param("剧名")
const sillyGirl=new SillyGirl()
let djj = dj.keys()
const matchingDjj = djj.filter(movie => movie.includes(djName))



//联网
function web(){
  var {body} = request({
    url: `http://dj.ibycat.com/?djName=${djName}`,
    method: "get",
    allowredirects: false, // 不禁止重定向
  });
  
  if (body) {
    const djWeb = body.split("\"result\">")[1].split("</div>")[0].replace(/<p[^>]*>|<\/p>/g, "")
    s.reply(djWeb);
  }else{
    s.reply("请检查网络是否正常！");
  }
}


function main(){
  if(s.getContent() == "短剧"){
    s.reply("命令：搜剧名\n示例：搜练气十万年")
    return
  }if(djj.includes(djName)){
    s.reply(`${djName} ${dj.get(djName)}\n保存网盘后即可观看`)
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
