/**
 * webwxApp SPA Html &amp; AngularJS Script Tracker for Web Wechat
 *  https://github.com/wechaty/webwx-app/
 *
 */
const { execSync }      = require('child_process')
const { writeFileSync } = require('fs')

const VERSION_LOG = '../version-log.json'
const versionLog  = require(VERSION_LOG)

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

function gitPush() {
  execSync('git push > /dev/null 2>&1') // hide token for output
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

if (!jsVer) {
  throw new Error('jsVer empty')
}

if (jsVer in versionLog) {
  console.log('jsVer is a old version.(gray upgrading?)')
  return
}

if (!gitDiff()) {
  console.log('local is up to date')
  return
}

gitCommit('webwxApp' + jsVer)
gitPush()
console.log('commited new version: ' + jsVer)

versionLog[jsVer] = new Date()
writeFileSync(VERSION_LOG, JSON.stringify(versionLog))

console.log(versionLog)
console.log(jsVer)
