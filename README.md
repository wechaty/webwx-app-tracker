# webwx-app-tracker

webwxApp SPA Html &amp; AngularJS Script Tracker for Web Wechat

## Introduction

The purpose of creating this repository is to track the code change from https://wx.qq.com , which can make the [PuppetWeb of Wechaty](https://github.com/wechaty/wechaty-puppet-puppeteer) life easier in the future.

What it is doing is:

1. Save <https://wx.qq.com> HTML to `original/index.html`
1. Save AngularJs JavaScript to `original/wxwebApp.js`
1. Format the above two files, and save them to `formatted/`
1. Check wether there has any update
1. Commit to Git Repository and use js file name as commit message(if updated)

## Case Study

I have a webwxApp.js which was saved on May 2016, about 5 months ago before I setup this tracker.

1. After I finished this tracker, I got a diff on webwxApp between version May to Nov, you can see, there's no much change at the past half year:

  <https://github.com/wechaty/webwx-app-tracker/commit/ab292418e2651ec7e2630da156b3c18f0dca26fd>

1. However there was a new little bug introduced in, it's a typo of `API_webwxsendmsgvedio`:

  <https://github.com/wechaty/webwx-app-tracker/commit/ab292418e2651ec7e2630da156b3c18f0dca26fd#diff-80c9da80c8ca080b37c6c49864880646R3300>

Enjoy it!

## Quick Start

Open https://github.com/wechaty/webwx-app-tracker/commits/master/formatted/webwxApp.js to know the day to day change of web wechat app code.

Or clone this repository on github, then run on your own machine.

## Cron

I put `npm run track` to my crontab with the following setting:(run every hour)

```shell
huan@dev:~/git/webwx-app-tracker$ crontab -l
1 * * * * (date && cd ~/git/webwx-app-tracker && npm run -s track >> /tmp/webwx-app-tracker.log 2>&1)
```

P.S. You need to use Github Personal Token to enable push in crontab:

* <http://stackoverflow.com/questions/18935539/authenticate-with-github-using-token>

Any suggestion is welcome.

## See Also

* [网页QQ/微信/新浪微博等重要文件监控，方便发现文件变动，及时更新相关项目](https://github.com/sjdy521/Mojo-URLMonitor)

## History

### v0.2 Nov 2020

Use GitHub Actions to replace crontab

### v0.1 Nov 2016

Use crontab to run `npm run track`

## Author

[Huan](https://github.com/huan) [(李卓桓)](http://linkedin.com/in/zixia), Tencent TVP of Chatbot

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackoverflow.com/users/flair/1123955.png)](https://stackoverflow.com/users/1123955/huan)

## Copyright & License

* Code & Docs © 2016-now Wechaty Community Contributors
* Code released under the Apache-2.0 License
* Docs released under Creative Commons
