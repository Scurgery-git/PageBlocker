const url = chrome.runtime.getURL('urls.json');

function getTime(raw) {
    raw = raw.split(':')
    let h = parseInt(raw[0]);
    let m = parseInt(raw[1]);
    if (isNaN(h) || isNaN(m)) throw 'wrong format';

    return [h, m]
}

function getUrl(urlWithoutHTTP) {
    return urlWithoutHTTP.slice(0, urlWithoutHTTP.indexOf('/'));
}

$('#plus').click(() => {
    let url = $('.url-in').val();
    let start = $('.start').val();
    let end = $('.end').val();

    let go = false;

    let name;

    let wrong = {
        "url": false,
        "start": false,
        "end":false,
    };

    if (url.indexOf('http://') != -1) {
        name = getUrl(url.slice('http://'.length, -1));
        url = 'http://' + name;
    } else if (url.indexOf('https://') != -1) {
        name = getUrl(url.slice('https://'.length, -1));
        url = 'https://' + name;
    } else {
        wrong.url = true;
    }

    try{ start = getTime(start); } catch { wrong.start = true };
    try{ end = getTime(end); } catch { wrong.end = true };
    
    if (start[0] > 23 || start[1] > 59 || start[0] < 0 || start[1] < 0) { wrong.start = true };
    if (end[0] > 23 || end[1] > 59 || end[0] < 0 || end[1] < 0) { wrong.end = true };

    wrong.url ? $('.url-in').css('border', '1px dotted red') : $('.url-in').css('border', 'inset 2px');
    wrong.start ?  $('.start').css('border', '1px dotted red') : $('.start').css('border', 'inset 2px');
    wrong.end ?  $('.end').css('border', '1px dotted red') : $('.end').css('border', 'inset 2px');

    for (elem in wrong) {
        if (elem) { go = false; break; } else { got = true; }
    }

    if (go) {

        // -- not working --
        /*
        fetch(url)
            .then(response => response.json())
            .then(json => {
                json.urls.push({"url": url, "start": start, "end": end, "display": name});

                let vLink = document.createElement('a'),
                vBlob = new Blob([json], {type: "octet/stream"}),
                vName = 'urls.json',
                vUrl = window.URL.createObjectURL(vBlob);
                vLink.setAttribute('href', vUrl);
                vLink.setAttribute('download', vName );
                vLink.click();
            });

        fetch(url)
            .then(response => response.json())
            .then(json => {
                console.log(josn);
            });
    //    let urls = JSON.parse(fs.readFileSync('urls.js').toString());
    //    urls.urls.push({"url": url, "start": start, "end": end, "display": name});*/
    }
});