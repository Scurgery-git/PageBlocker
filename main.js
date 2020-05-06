function getTime(raw) {
    raw = raw.split(':')
    let h = parseInt(raw[0]);
    let m = parseInt(raw[1]);

    return [h, m]
}

$('#plus').click(() => {
    let url = $('.url-in').val();
    let start = $('.start').val();
    let end = $('.end').val();

    let good = true;

    try{
        start = getTime(start);
    } catch {
        good = false;
    }
    try{
        end = getTime(end);
    } catch {
        good = false;
    }

    try{
        if (start[0] > 23 || start[1] > 59) {
            good = false;
        }
    } catch {
        good = false;
    }

    try{
        if (end[0] > 23 || end[1] > 59) {
            good = false;
        }
    } catch {
        good = false;
    }
});