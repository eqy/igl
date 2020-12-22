// tender's note: i dont actually know javascript or web development so read 
// this garbage at your own risk


console.log("???????");

//let client_id = ";
//Components.utils.import("resource://gre/modules/Timer.jsm");
const client_id = 'pxeci55phi3wv0qd5zezei2aleni8y';
const login = 'gypsy93';
const streams = 'https://api.twitch.tv/helix/search/channels?query=' + login;
const videos = 'https://api.twitch.tv/helix/videos?user_id=';
const oauthpoint = 'https://id.twitch.tv/oauth2/authorize?client_id=pxeci55phi3wv0qd5zezei2aleni8y&redirect_uri=http%3a%2f%2flocalhost&response_type=token';
var token;
//const streams = 'https://api.twitch.tv/helix/streams?user_login=gypsy93';


function bouncer() {
    let hash = document.location.hash;
    let start = hash.indexOf('#access_token=');
    let end = hash.indexOf('&')
    token = hash.substring(start + 14, end); 
    console.log(token);
    console.log("STARt");
    if (token.length < 1) {
        window.location.replace(oauthpoint);
    } else {
        console.log("before");
        let reqheaders = {
            'client-id' : client_id,
            'Authorization' : 'Bearer ' + token};
        fetch(streams, {
            method: 'GET',
            headers: reqheaders
        }).then(response => response.json()).then(data => process(data));
        console.log("what");
    }
}


function process(data) {
    console.log("what2");
    console.log(data);
    let res = data.data;
    var strimdata;
    for (i = 0; i < res.length; res++) {
        if (res[i].display_name == login) {
            console.log("found");
            strimdata = res[i];
            break;
        }
    } 
    let online = strimdata.is_live;
    let id = strimdata.id;
    console.log("is live: " + online);
    if (online) {
        console.log("HOLY MOLY he's live");
    } else {
        console.log("not live control");
        let reqheaders = {
        'client-id' : client_id,
        'Authorization' : 'Bearer ' + token};
        fetch(videos + id, {
            method: 'GET',
            headers: reqheaders
        }).then(response => response.json()).then(data => estimate(data));
    }
    //setInterval(memeCycle, 1000);
}


function estimate(data) {
    let res = data.data;
    for (i = 0 ; i < res.length; i++) {
        console.log(res[i]);
    }
}


function memeCycle(data) {
    let lastlastdate = new Date('2020-12-11T19:39');
    let lastdate = new Date('2020-12-20T19:46:00');
    let now = new Date();
    var diff = Math.abs(now - lastdate);
    let pred = new Date(lastdate.getTime() + Math.abs(lastdate - lastlastdate));
    // for dramatic effect lmao
    let lastyear = Math.floor(diff / 31536000000);
    diff = diff % 31536000000;
    let lastmonth = Math.floor(diff / 2592000000);
    diff = diff % 2592000000;
    let lastweek = Math.floor(diff / 604800000);
    diff = diff % 604800000;
    let lastday = Math.floor(diff / 86400000);
    diff = diff % 86400000;
    let lasthour = Math.floor(diff / 3600000);
    diff = diff % 3600000;
    let lastsecond = Math.round(diff / 1000);
    let lasttext = "Last Stream was (" + lastyear + " years " + lastmonth + " months " + lastweek + " weeks " + lastday + " days " + lasthour + " hours " + lastsecond + " seconds ago)."  
    //console.log(diff);
    console.log(lasttext);
    //console.log(pred.getFullYear());
    //console.log(pred.getDays());
    //console.log(pred.getHours());
}

bouncer();
