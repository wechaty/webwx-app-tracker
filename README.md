# webwx-app-tracker
webwxApp SPA Html &amp; AngularJS Script Tracker for Web Wechat

# Introduction

The purpose of creating this repository is to track the code change from https://wx.qq.com , which can make the [PuppetWeb of Wechaty](https://github.com/wechaty/wechaty/blob/master/src/puppet-web/) life easier in the future.

What it is doing is:

1. Save https://wx.qq.com HTML to `orignal/index.html`
1. Save AngularJs JavsScript to `orignal/wxwebApp.js`
1. Format the above two files, and save them to `formatted/`
1. Check wether there has any update
1. Commit to Git Repository and use js file name as commit message(if updated)

# Quick Start

Open https://github.com/wechaty/webwx-app-tracker/commits/master to know the day to day change of web wechat html/javascript code.

Or clone this repository on github, then run on your own machine.

# Cron

I put `npm run track` to my crontab with the following setting:(run every 6 hours)

```shell
zixia@dev:~/git/webwx-app-tracker$ crontab -l
* */6 * * * (cd ~/git/webwx-app-tracker && npm run track >> /tmp/webwx-app-tracker.log 2>&1)
```

P.S. You need to use Github Personal Token to enable push in crontab:

* http://stackoverflow.com/questions/18935539/authenticate-with-github-using-token

Any suggestion is welcome.


