#!/usr/bin/env nodejs

/**
 * webwxApp SPA Html &amp; AngularJS Script Tracker for Web Wechat
 *  https://github.com/wechaty/webwx-app/
 *
 */
const { execSync }      = require('child_process')
const { writeFileSync } = require('fs')
const { format }        = require('util')

const VERSION_HISTORY = 'history-version.json'
const versionHistory  = require('../' + VERSION_HISTORY)

function get(url) {
  return execSync('curl -s ' + url)
    .toString()
}

function getJsUrl(html) {
  // 2016:   <script type="text/javascript" src="https://res.wx.qq.com/zh_CN/htmledition/v2/js/webwxApp31aa32.js"></script>
  // 201702: <script src="//res.wx.qq.com/a/wx_fed/webwx/res/static/js/index_0c7087d.js">
  const re = new RegExp(' src="//(res.wx.qq.com/[^"]+?/js/index_.+?\.js)"></script>', 'i')
  const match = re.exec(html)
  if (!match) {
    return null
  }
  return match[1]
}

function getJsVer(url) {
  // res.wx.qq.com/a/wx_fed/webwx/res/static/js/index_0c7087d.js
  const re = /index_(.+?)\.js/i
  const match = re.exec(url)
  if (!match) {
    throw new Error('no version')
  }
  return match[1]
}

function htmlBeautify(file) {
  return execSync('html-beautify ' + file)
    .toString()
}

function jsBeautify(file) {
  return execSync('js-beautify ' + file)
    .toString()
}

function gitDiff() {
  const n = execSync('git diff --name-only | wc -l')
    .toString()
    .replace(/\n/, '')
  return n > 0
}

function gitCommit(message) {
  execSync('git -c "user.name=Mike BO" -c "user.email=mike@zixia.net" commit -am "' + message + '"')
}

function gitPull() {
  execSync('git pull') // hide token for output
}

function gitPush() {
  execSync('git push') // hide token for output
}

function log(message) {
  const now = new Date();

  let min = now.getMinutes()
  let sec = now.getSeconds()
  let hour = now.getHours()

  let date = now.getDate()
  let month = now.getMonth() + 1

  if (sec < 10) { sec = '0' + sec }
  if (min < 10) { min = '0' + min }
  if (hour < 10) { hour = '0' + hour }

  if (date < 10) { date = '0' + date }
  if (month < 10) { month = '0' + month }

  const desc =  format('%s-%s-%s %s:%s:%s '
                        , now.getFullYear()
                        , (now.getMonth() + 1)
                        , date
                        , hour
                        , min
                        , sec
                      )

  console.log(desc + format.apply(null, arguments))
}

function main () {
  gitPull()

  const html = get('https://wx.qq.com')
  const jsUrl = getJsUrl(html)
  const jsVer = getJsVer(jsUrl)
  const js = get(jsUrl)

  const originalHtmlFile = 'original/index.html'
  const originalJsFile   = 'original/webwxApp.js'

  const formattedHtmlFile = 'formatted/index.html'
  const formattedJsFile   = 'formatted/webwxApp.js'

  writeFileSync(originalHtmlFile , html)
  writeFileSync(originalJsFile   , js)

  writeFileSync(formattedHtmlFile , htmlBeautify(originalHtmlFile))
  writeFileSync(formattedJsFile   , jsBeautify(originalJsFile))

  if (!gitDiff()) {
    log('nothing new; current: %s', jsVer)
    return
  }

  /**
   * check jsVer
   */
  if (!jsVer) {
    log('jsVer empty')
    return
  }

  if (jsVer in versionHistory) {
    const latestVer = versionHistory['latest']

    if (latestVer === jsVer) {
      log('jsVer is the latest, but local has gitDiff()')
    } else {
      const latestVerDate = versionHistory[latestVer]
      jsVerDate = versionHistory[jsVer]

      log('jsVer found %s[%s] latest %s[%s]. maybe Fifty Shades of Grey?'
          , jsVer, jsVerDate
          , latestVer, latestVerDate
      )
      return
    }
  } else {

    /**
     * Save new version to history json file
     */
    versionHistory[jsVer] = new Date()
    versionHistory['latest'] = jsVer

    const json = JSON.stringify(versionHistory, null, '  ')
    writeFileSync(VERSION_HISTORY, json)
  }

  /**
   * Commit & Push
   */
  gitCommit('webwx-' + jsVer)
  gitPush()

  log('new version: %s', jsVer)
}

main()
