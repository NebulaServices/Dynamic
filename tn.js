import fetch from 'node-fetch';

var url = 'https://portal.arc.io/api/createNewAccount';
var invite = '000000';

// localhost:80 should be shared

function fixNumber(num) {
    num = String(num);

    if (num.length==1) num = '00000'+num;
    if (num.length==2) num = '0000'+num;
    if (num.length==3) num = '000'+num;
    if (num.length==4) num = '00'+num;
    if (num.length==5) num = '0'+num;

    return num;
}

for (let x=0;x<999999;x+=1) {
    invite++;

    var n = fixNumber(invite);

    var body = {
        
    }
}