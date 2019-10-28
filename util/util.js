function dateFromEpochMs(e){
    if (e){
        var d = new Date(0);
        d.setUTCMilliseconds(e);
        return d;
    }
    else{
        return e;
    }
}

function extractJiraTimeFromText(text){
    var r = /(?:(\d+\.?\d*?)w)?\s?(?:(\d+\.?\d*?)d)?\s?(?:(\d+\.?\d*?)h)?\s?(?:(\d+\.?\d*?)m)?\s?/gm;
    var m = r.exec(text);
    if (m){
        var weeks = 0;
        var days = 0;
        var hours = 0;
        var minutes = 0;

        if (m[1]){
            weeks = parseFloat(m[1]);
        }
        if (m[2]){
            days = parseFloat(m[2]);
        }
        if (m[3]){
            hours = parseFloat(m[3]);
        }
        if (m[4]){
            minutes = parseFloat(m[4]);
        }
            
        return (weeks * 5 * 8 * 60 * 60) + (days * 8 * 60 * 60) + (hours * 60 * 60) + (minutes * 60);
    }
    else{
        return 0;
    }
}

function cloneDate(original){
    return new Date(original.getFullYear(), original.getMonth(), original.getDate());
}

