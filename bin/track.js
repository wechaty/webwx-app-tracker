/**
 * webwxApp SPA Html &amp; AngularJS Script Tracker for Web Wechat
 *  https://github.com/wechaty/webwx-app/
 *
 */
const { execSync }      = require('child_process')
const { writeFileSync } = require('fs')
const { format }        = require('util')

const VERSION_HISTORY = 'history-version.json'
const versionMap      = require('../' + VERSION_HISTORY)

function get(url) {
  return execSync('curl -s ' + url)
  .toString()
}

function getJsUrl(html) {
  //  <script type="text/javascript" src="https://res.wx.qq.com/zh_CN/htmledition/v2/js/webwxApp31aa32.js"></script>
  const re = new RegExp(' src="(https://res.wx.qq.com/.+?/js/webwxApp.+?\.js)"></script>', 'i')
  const match = re.exec(html)
  if (!match) {
    return null
  }
  return match[1]
}

function getJsVer(url) {
  const re = /webwxApp(.+?)\.js/i
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
  execSync('git commit -am "' + message + '"')
}

function gitPull() {
  execSync('git pull >/dev/null 2>&1') // hide token for output
}

function gitPush() {
  execSync('git push &>/dev/null') // hide token for output
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

const html = get('https://wx.qq.com')
const jsUrl = getJsUrl(html)
const jsVer = getJsVer(jsUrl)
const js = get(jsUrl)

const orignalHtmlFile = 'orignal/index.html'
const orignalJsFile   = 'orignal/webwxApp.js'

const formattedHtmlFile = 'formatted/index.html'
const formattedJsFile   = 'formatted/webwxApp.js'

writeFileSync(orignalHtmlFile , html)
writeFileSync(orignalJsFile   , js)

writeFileSync(formattedHtmlFile , htmlBeautify(orignalHtmlFile))
writeFileSync(formattedJsFile   , jsBeautify(orignalJsFile))

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

if (jsVer in versionMap) {
  log('jsVer %s is a old version.(gray upgrading?)', jsVer)
  return
}

/**
 * Save new version to history json file
 */
versionMap[jsVer] = new Date()
versionMap['latest'] = jsVer

const json = JSON.stringify(versionMap, null, '  ')
writeFileSync(VERSION_HISTORY, json)

/**
 * Commit & Push
 */
gitCommit('webwxApp' + jsVer)
gitPull()
gitPush()

log('new version: %s', jsVer)

