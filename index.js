// tender's note: i dont actually know javascript or web development so read 
// this garbage at your own risk


//let client_id = ";
//Components.utils.import("resource://gre/modules/Timer.jsm");
const client_id = 'pxeci55phi3wv0qd5zezei2aleni8y';
const login = 'gypsy93';
const streams = 'https://api.twitch.tv/helix/search/channels?query=' + login;
const videos = 'https://api.twitch.tv/helix/videos?user_id=';
const oauthpoint = 'https://id.twitch.tv/oauth2/authorize?client_id=pxeci55phi3wv0qd5zezei2aleni8y&redirect_uri=https%3a%2f%2fisgyp.live&response_type=token';
const liveurl = 'https://twitch.tv/gypsy93';
var token;
var img;
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
        let reqheaders = {
            'client-id' : client_id,
            'Authorization' : 'Bearer ' + token};
        fetch(streams, {
            method: 'GET',
            headers: reqheaders
        }).then(response => response.json()).then(data => process(data));
    }
}


function process(data) {
    let res = data.data;
    var strimdata;
    console.log(res);
    for (i = 0; i < res.length; res++) {
        if (res[i].display_name == login) {
            console.log("found");
            strimdata = res[i];
            break;
        }
    } 
    let online = strimdata.is_live;
    let id = strimdata.id;
    img = strimdata.thumbnail_url;
    console.log("is live: " + online);
    if (online) {
        console.log("HOLY MOLY he's live");
        $("#contenttext").text('');
        $("#contentimageshake").html('<img src="' + img + '">');
        let count = 6;
        var timer = setInterval(function() {
            count = countdownredirect(count);
            if (count < 1) {
                clearInterval(timer);
                window.location.replace(liveurl);
            }
        }, 1000);
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


function countdownredirect(count) {
    if (count < 1) {
    } else {
        count = count - 1;
        let text = "HOLY MOLY HE'S LIVE! Redirecting in " + count + "...";
        $("#contenttext").text(text);
    }
    return count;
}


function estimate(data) {
    let res = data.data;
    let sorted = res.sort(function(a, b) {
        return a.id < b.id;});
    for (i = 0 ; i < sorted.length; i++) {
        // console.log(sorted[i]);
    }
    if (sorted.length > 1) {
        let lastdate = new Date(sorted[0].created_at);
        let lastlastdate = new Date(sorted[1].created_at);
        setInterval(function() {memeCycle(lastdate, lastlastdate);}, 1000);
        $("#contenttext").text("NO");
        $("#contentimage").html('<img src="' + img + '">');
    } else {
        console.log("guess ill die");
    }
}


function dumbprint(prefix, suffix, diff) {
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
    let lastminute = Math.floor(diff / 60000);
    diff = diff % 60000;
    let lastsecond = Math.round(diff / 1000);
    let text = prefix + " (" + lastyear + " years " + lastmonth + " months " + lastweek + " weeks " + lastday + " days " + lasthour + " hours " + lastminute + " minutes " + lastsecond + " seconds) " + suffix;  
    return text;
}


function memeCycle(lastdate, lastlastdate) {
    let now = new Date();
    let prevdiff = Math.abs(now - lastdate);
    let preddiff = Math.abs(lastdate - lastlastdate);
    let pred = new Date(lastdate.getTime() + preddiff);
    let preddiffcur = pred - now;
    //console.log(diff);
    let prevtext = dumbprint("last stream was on " + lastdate, "ago", prevdiff);
    var predtext = dumbprint("next stream is predicted to be on " + pred + " , in", "", preddiffcur);
    if (preddiffcur < 0) {
        predtext = "next stream was predicted to have already happened so whatever, I don't know... imagine trying to predict gyp";
    }
    $("#prev").text(prevtext);
    $("#pred").text(predtext);
    //console.log(pred.getFullYear());
    //console.log(pred.getDays());
    //console.log(pred.getHours());
}

bouncer();
