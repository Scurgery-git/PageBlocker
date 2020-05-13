function setDomainsHtml(){
    chrome.storage.sync.get(['urls'], result => { 
        let domains = $('.domains').html();
        if (typeof(result.urls) != 'undefined') {
            for (let i = 0; i < result.urls.length; i++) {
                domains += `<div class="row reg-row">
                        <div class="col-1"><span class="btn" id="delete"><i class="far fa-times-circle"></i></span></div>
                        <div class="url col-6"><span>${result.urls[i].display}</span></div>
                        <div class="col-2"><span>${result.urls[i].start[0]}:${result.urls[i].start[1]}</span></div>
                        <div class="col-2"><span>${result.urls[i].end[0]}:${result.urls[i].end[1]}</span></div>
                        </div>`;
            }
        }
        
        $('.domains').html(domains);
    });
}

function getTime(raw) {
    raw = raw.split(':')
    let h = parseInt(raw[0]);
    let m = parseInt(raw[1]);
    if (isNaN(h) || isNaN(m)) throw 'wrong format';

    return [h, m]
}

function getUrl(urlWithoutHTTP) {
    if (urlWithoutHTTP.indexOf('/') == -1) {
        return urlWithoutHTTP.slice(0, urlWithoutHTTP.length);
    } else {
        return urlWithoutHTTP.slice(0, urlWithoutHTTP.indexOf('/'));
    }
}

setDomainsHtml();

$('#plus').click(() => {
    let url = $('.url-in').val();
    let start = $('.start').val();
    let end = $('.end').val();

    let go = false;

    let name;

    let wrong = {
        "url": false,
        "start": false,
        "end": false,
    };

    if (url.indexOf('http://') != -1) {
        name = getUrl(url.slice('http://'.length, url.length));
        url = 'http://' + name;
    } else if (url.indexOf('https://') != -1) {
        name = getUrl(url.slice('https://'.length, url.length));
        url = 'https://' + name;
    } else {
        wrong.url = true;
    }

    try{ start = getTime(start); } catch { wrong.start = true; }
    try{ end = getTime(end); } catch { wrong.end = true; }
    
    if (start[0] > 23 || start[1] > 59 || start[0] < 0 || start[1] < 0) { wrong.start = true; }
    if (end[0] > 23 || end[1] > 59 || end[0] < 0 || end[1] < 0) { wrong.end = true; }
    if (start[0] * 100 + start[1] >= end[0] * 100 + end[1]) { wrong.end = true, wrong.start = true; }

    wrong.url ? $('.url-in').css('border', '1px dotted red') : $('.url-in').css('border', 'inset 2px');
    wrong.start ?  $('.start').css('border', '1px dotted red') : $('.start').css('border', 'inset 2px');
    wrong.end ?  $('.end').css('border', '1px dotted red') : $('.end').css('border', 'inset 2px');

    for (let i in wrong) {
        if (wrong[i]) { go = false; break; } else { go = true; } 
    }

    if (go) {
        let saveIt = { "url": url, "start": start, "end": end, "display": name }

        chrome.storage.sync.get(['urls'], result => {
            console.log(result.urls);
            if (typeof(result.urls) == 'undefined') {
                chrome.storage.sync.set({ urls: [saveIt] });
            } else {
                result.urls.push(saveIt);
                console.log(result.urls);
                chrome.storage.sync.set({ urls: result.urls });
            }
        });
    }

    setDomainsHtml();
});