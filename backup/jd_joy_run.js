/**
 宠汪汪邀请助力与赛跑助力脚本，感谢github@Zero-S1提供帮助
 更新时间：2020-11-16（宠汪汪助力更新Token的配置正则表达式已改）

 token时效很短，几个小时就失效了,闲麻烦的放弃就行
 每天拿到token后，可一次性运行完毕即可。
 互助码friendPin是京东用户名，不是昵称（可在京东APP->我的->设置 查看获得）
 token获取途径：
 1、微信搜索'来客有礼'小程序,登陆京东账号，点击底部的'我的'或者'发现'两处地方,即可获取Token，脚本运行提示token失效后，继续按此方法获取即可
 2、或者每天去'来客有礼'小程序->宠汪汪里面，领狗粮->签到领京豆 也可获取Token(此方法每天只能获取一次)
 脚本里面有内置提供的friendPin，如果你没有修改脚本或者BoxJs处填写自己的互助码，会默认给脚本内置的助力。
[MITM]
hostname = draw.jdfcloud.com

Surge
[Script]
宠汪汪邀请助力与赛跑助力 = type=cron,cronexp="15 10 * * *",wake-system=1,timeout=20,script-path=https://raw.githubusercontent.com/lxk0301/scripts/master/jd_joy_run.js
宠汪汪助力更新Token = type=http-response,pattern=^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/addUser\?code=, requires-body=1, max-size=0, script-path=https://raw.githubusercontent.com/lxk0301/scripts/master/jd_joy_run.js
宠汪汪助力获取Token = type=http-request,pattern=^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/user\/detail\?openId=, requires-body=1, max-size=0, script-path=https://raw.githubusercontent.com/lxk0301/scripts/master/jd_joy_run.js

圈X
[task_local]
# 宠汪汪邀请助力与赛跑助力
15 10 * * * https://raw.githubusercontent.com/lxk0301/scripts/master/jd_joy_run.js, tag=宠汪汪邀请助力与赛跑助力, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jdcww.png, enabled=true
[rewrite_local]
# 宠汪汪助力更新Token
^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/addUser\?code= url script-response-body https://raw.githubusercontent.com/lxk0301/scripts/master/jd_joy_run.js
# 宠汪汪助力获取Token
^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/user\/detail\?openId= url script-request-header https://raw.githubusercontent.com/lxk0301/scripts/master/jd_joy_run.js

*****Loon****
[Script]
cron "15 10 * * *" script-path=https://raw.githubusercontent.com/lxk0301/scripts/master/jd_joy_run.js, tag=宠汪汪邀请助力与赛跑助力
http-response ^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/addUser\?code= script-path=https://raw.githubusercontent.com/lxk0301/scripts/master/jd_joy_run.js, requires-body=true, timeout=10, tag=宠汪汪助力更新Token
http-request ^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/user\/detail\?openId= script-path=https://raw.githubusercontent.com/lxk0301/scripts/master/jd_joy_run.js, requires-body=true, timeout=10, tag=宠汪汪助力获取Token
 **/
const { Env } = require('../../utils/Env')
const isRequest = typeof $request !== 'undefined'
const $ = new Env('来客有礼宠汪汪')
const JD_BASE_API = `https://draw.jdfcloud.com//pet`
// 此处填入你需要助力好友的京东用户名
// 给下面好友邀请助力的
let invite_pins = ['jd_6cd93e613b0e5,被折叠的记忆33,jd_704a2e5e28a66,jd_45a6b5953b15b,zooooo58']
// 给下面好友赛跑助力
let run_pins = ['jd_6cd93e613b0e5,被折叠的记忆33,jd_704a2e5e28a66,jd_45a6b5953b15b,zooooo58']
// $.LKYLToken = '76fe7794c475c18711e3b47185f114b5' || $.getdata('jdJoyRunToken');
$.LKYLToken = $.getdata('jdJoyRunToken')
// Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = require('../../utils/jdCookie')
// IOS等用户直接用NobyDa的jd cookie
let cookiesArr = []; let cookie = ''
const headers = {
  'Connection': 'keep-alive',
  'Accept-Encoding': 'gzip, deflate, br',
  'App-Id': '',
  'Lottery-Access-Signature': '',
  'Content-Type': 'application/json',
  'reqSource': 'weapp',
  'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.15(0x17000f2d) NetType/4G Language/zh_CN',
  'Cookie': '',
  'openId': '',
  'Host': 'draw.jdfcloud.com',
  'Referer': 'https://servicewechat.com/wxccb5c536b0ecd1bf/633/page-frame.html',
  'Accept-Language': 'zh-cn',
  'Accept': '*/*',
  'LKYLToken': ''
}
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
} else {
  // 支持 "京东多账号 Ck 管理"的cookie
  let cookiesData = $.getdata('CookiesJD') || '[]'
  cookiesData = jsonParse(cookiesData)
  cookiesArr = cookiesData.map(item => item.cookie)
  cookiesArr.push(...[$.getdata('CookieJD'), $.getdata('CookieJD2')])
  if ($.getdata('jd_joy_invite_pin')) {
    invite_pins = []
    invite_pins.push($.getdata('jd_joy_invite_pin'))
  }
  if ($.getdata('jd2_joy_invite_pin')) {
    if (invite_pins.length > 0) {
      invite_pins.push($.getdata('jd2_joy_invite_pin'))
    } else {
      invite_pins = []
      invite_pins.push($.getdata('jd2_joy_invite_pin'))
    }
  }
  if ($.getdata('jd_joy_run_pin')) {
    run_pins = []
    run_pins.push($.getdata('jd_joy_run_pin'))
  }
  if ($.getdata('jd2_joy_run_pin')) {
    if (run_pins.length > 0) {
      run_pins.push($.getdata('jd2_joy_run_pin'))
    } else {
      run_pins = []
      run_pins.push($.getdata('jd2_joy_run_pin'))
    }
  }
}

// 获取来客有礼Token
function getToken() {
  const url = $request.url
  $.log(`${$.name}url\n${url}\n`)
  if (isURL(url, /^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/addUser\?code=/)) {
    const body = JSON.parse($response.body)
    const LKYLToken = body.data.token
    $.log(`${$.name} token\n${LKYLToken}\n`)
    if ($.getdata('jdJoyRunToken')) {
      $.msg($.name, '更新Token: 成功🎉', `\n${LKYLToken}\n`)
    } else {
      $.msg($.name, '更新Token: 成功🎉', `\n${LKYLToken}\n`)
    }
    $.setdata(LKYLToken, 'jdJoyRunToken')
    $.done({ body: JSON.stringify(body) })
  } else if (isURL(url, /^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/user\/detail\?openId=/)) {
    if ($request && $request.method !== 'OPTIONS') {
      const LKYLToken = $request.headers['LKYLToken']
      // if ($.getdata('jdJoyRunToken')) {
      // if ($.getdata('jdJoyRunToken') !== LKYLToken) {

      // }
      // $.msg($.name, '更新获取Token: 成功🎉', `\n${LKYLToken}\n`);
      // } else {
      // $.msg($.name, '获取Token: 成功🎉', `\n${LKYLToken}\n`);
      // }
      $.setdata(LKYLToken, 'jdJoyRunToken')

      $.msg($.name, '获取Token: 成功🎉', `\n${LKYLToken}\n`)

      // $.done({ body: JSON.stringify(body) })
      $.done({ url: url })
    }
  } else {
    $.done({})
  }
}

async function main() {
  console.log(`打印token \n${$.getdata('jdJoyRunToken')}\n`)
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', { 'open-url': 'https://bean.m.jd.com/' })
    return
  }
  if (!$.LKYLToken) {
    $.msg($.name, '【提示】请先获取来客有礼宠汪汪token', "微信搜索'来客有礼'小程序\n点击底部的'发现'Tab\n即可获取Token")
    return
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i]
      UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1
      $.inviteReward = 0
      $.runReward = 0
      console.log(`\n开始【京东账号${$.index}】${UserName}\n`)
      $.jdLogin = true
      $.LKYLLogin = true
      console.log(`=============【开始邀请助力】===============`)
      const inviteIndex = $.index > invite_pins.length ? (invite_pins.length - 1) : ($.index - 1)
      const new_invite_pins = invite_pins[inviteIndex].split(',')
      await invite(new_invite_pins)
      if ($.jdLogin && $.LKYLLogin) {
        console.log(`===========【开始助力好友赛跑】===========`)
        const runIndex = $.index > run_pins.length ? (run_pins.length - 1) : ($.index - 1)
        const new_run_pins = run_pins[runIndex].split(',')
        await run(new_run_pins)
      }
    }
  }
  $.done()
}

// 邀请助力
async function invite(invite_pins) {
  console.log(`账号${$.index} [${UserName}] 给下面名单的人进行邀请助力\n${invite_pins.map(item => item.trim())}\n`)
  for (const item of invite_pins.map(item => item.trim())) {
    console.log(`\n账号${$.index} [${UserName}] 开始给好友 [${item}] 进行邀请助力`)
    const data = await enterRoom(item)
    if (!data.success && data.errorCode === 'B0001') {
      console.log('京东Cookie失效')
      $.msg($.name, `【提示】京东cookie已失效`, `京东账号${$.index} ${UserName}\n请重新登录获取\nhttps://bean.m.jd.com/`, { 'open-url': 'https://bean.m.jd.com/' })
      $.jdLogin = false
      break
    } else {
      const { helpStatus } = data.data
      console.log(`helpStatus ${helpStatus}`)
      if (helpStatus === 'help_full') {
        console.log(`您的邀请助力机会已耗尽\n`)
        break
      } else if (helpStatus === 'cannot_help') {
        console.log(`已给该好友 ${item} 助力过或者此friendPin是你自己\n`)
        continue
      } else if (helpStatus === 'invite_full') {
        console.log(`助力失败，该好友 ${item} 已经满3人给他助力了,无需您再次助力\n`)
        continue
      } else if (helpStatus === 'can_help') {
        console.log(`开始给好友 ${item} 助力\n`)
        const LKYL_DATA = await helpInviteFriend(item)
        if (LKYL_DATA.errorCode === 'L0001' && !LKYL_DATA.success) {
          console.log('来客有礼宠汪汪token失效')
          $.setdata('', 'jdJoyRunToken')
          $.msg($.name, '【提示】来客有礼token失效，请重新获取', "微信搜索'来客有礼'小程序\n点击底部的'发现'Tab\n即可获取Token")
          $.LKYLLogin = false
          break
        } else {
          $.LKYLLogin = true
        }
      }
      $.jdLogin = true
    }
  }
  if ($.inviteReward > 0) {
    $.msg($.name, ``, `账号${$.index} [${UserName}]\n给${$.inviteReward / 5}人邀请助力成功\n获得狗粮${$.inviteReward}g`)
  }
}

function enterRoom(invitePin) {
  return new Promise(resolve => {
    headers.Cookie = cookie
    headers.LKYLToken = $.LKYLToken
    const options = {
      url: `${JD_BASE_API}/enterRoom?reqSource=weapp&invitePin=${encodeURI(invitePin)}`,
      headers
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          $.log('API请求失败')
          $.logErr(JSON.stringify(err))
        } else {
          data = JSON.parse(data)
          // console.log('进入房间', data)
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data)
      }
    })
  })
}

function helpInviteFriend(friendPin) {
  return new Promise((resolve) => {
    headers.Cookie = cookie
    headers.LKYLToken = $.LKYLToken
    const options = {
      url: `${JD_BASE_API}/helpFriend?friendPin=${encodeURI(friendPin)}`,
      headers
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          $.log('API请求失败')
          $.logErr(JSON.stringify(err))
        } else {
          $.log(`邀请助力结果：${data}`)
          data = JSON.parse(data)
          // {"errorCode":"help_ok","errorMessage":null,"currentTime":1600254297789,"data":29466,"success":true}
          if (data.success && data.errorCode === 'help_ok') {
            $.inviteReward += 5
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data)
      }
    })
  })
}

// 赛跑助力
async function run(run_pins) {
  console.log(`账号${$.index} [${UserName}] 给下面名单的人进行赛跑助力\n${(run_pins.map(item => item.trim()))}\n`)
  for (const item of run_pins.map(item => item.trim())) {
    console.log(`\n账号${$.index} [${UserName}] 开始给好友 [${item}] 进行赛跑助力`)
    const combatDetailRes = await combatDetail(item)
    const { petRaceResult } = combatDetailRes.data
    console.log(`petRaceResult ${petRaceResult}`)
    if (petRaceResult === 'help_full') {
      console.log('您的赛跑助力机会已耗尽')
      break
    } else if (petRaceResult === 'can_help') {
      console.log(`开始赛跑助力好友 ${item}`)
      const LKYL_DATA = await combatHelp(item)
      if (LKYL_DATA.errorCode === 'L0001' && !LKYL_DATA.success) {
        console.log('来客有礼宠汪汪token失效')
        $.setdata('', 'jdJoyRunToken')
        $.msg($.name, '【提示】来客有礼token失效，请重新获取', "微信搜索'来客有礼'小程序\n点击底部的'发现'Tab\n即可获取Token")
        $.LKYLLogin = false
        break
      } else {
        $.LKYLLogin = true
      }
    }
  }
  if ($.runReward > 0) {
    $.msg($.name, ``, `账号${$.index} [${UserName}]\n给${$.runReward / 5}人赛跑助力成功\n获得狗粮${$.runReward}g`)
  }
}

function combatHelp(friendPin) {
  return new Promise(resolve => {
    headers.Cookie = cookie
    headers.LKYLToken = $.LKYLToken
    const options = {
      url: `${JD_BASE_API}/combat/help?friendPin=${encodeURI(friendPin)}`,
      headers
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          $.log('API请求失败')
          $.logErr(JSON.stringify(err))
        } else {
          $.log(`赛跑助力结果${data}`)
          data = JSON.parse(data)
          // {"errorCode":"help_ok","errorMessage":null,"currentTime":1600479266133,"data":{"rewardNum":5,"helpStatus":"help_ok","newUser":false},"success":true}
          if (data.errorCode === 'help_ok' && data.data.helpStatus === 'help_ok') {
            console.log(`助力${friendPin}成功\n获得狗粮${data.data.rewardNum}g\n`)
            $.runReward += data.data.rewardNum
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data)
      }
    })
  })
}

function combatDetail(invitePin) {
  return new Promise(resolve => {
    headers.Cookie = cookie
    headers.LKYLToken = $.LKYLToken
    const options = {
      url: `${JD_BASE_API}/combat/detail/v2?help=true&inviterPin=${encodeURI(invitePin)}`,
      headers
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          $.log('API请求失败')
          $.logErr(JSON.stringify(err))
        } else {
          data = JSON.parse(data)
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data)
      }
    })
  })
}

function isURL(domain, reg) {
  // const name = reg;
  return reg.test(domain)
}

function jsonParse(str) {
  if (typeof str === 'string') {
    try {
      return JSON.parse(str)
    } catch (e) {
      console.log(e)
      $.msg($.name, '', '不要在BoxJS手动复制粘贴修改cookie')
      return []
    }
  }
}

isRequest ? getToken() : main()
