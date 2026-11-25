const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
let messages=[],marks=[],fail=false;
class Expo{static isExpoPushToken(){return true}chunkPushNotifications(m){return [m]}async sendPushNotificationsAsync(m){messages.push(...m);return m.map(()=>({status:fail?'error':'ok'}))}}
const model=kind=>({find:async()=>[{_id:kind,date:'2026-11-25',thought:'A thought',title:'A title',description:'A description',category:'Mind'}],findByIdAndUpdate:async id=>marks.push(id)});
const mocks={'expo-server-sdk':{Expo},'../models/article.model':model('article'),'../models/powerThought.model':model('thought'),'../models/user.model':{find:()=>({select:async()=>[{pushToken:'ExponentPushToken[test]'}]})},'./logger':{info:()=>{},error:()=>{}}};
const moduleObject={exports:{}};
vm.runInNewContext(fs.readFileSync('services/notificationScheduler.js','utf8'),{module:moduleObject,require:n=>mocks[n],Date,console,setInterval:()=>{throw Error('Do not start live scheduler in tests')}});
(async()=>{await moduleObject.exports.runScheduledNotifications();assert.equal(messages.length,2);assert(messages.every(m=>m.badge===1));assert.equal(messages[0].data.route,'/mental/thoughts');assert.equal(messages[1].data.route,'/article/article');assert.equal(marks.length,2);fail=true;marks=[];await moduleObject.exports.runScheduledNotifications();assert.equal(marks.length,0,'An all-failed send remains retryable');console.log('PASS: closed-app badge, canonical routes and all-failed retry state.');})().catch(e=>{console.error(e);process.exitCode=1});
