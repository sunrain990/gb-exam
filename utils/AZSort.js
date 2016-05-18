/**
 * Created by kevin on 16/5/19.
 */
var optchoices = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function sortByChar(a,b){
    return optchoices.indexOf(b) - optchoices.indexOf(a);
}


function resort(arr, char) {
    for(var i=0;i<arr.length;i++){
        if(sortByChar(arr[i]['name'],char) < 0){
            arr[i]['name'] = optchoices[optchoices.indexOf(arr[i]['name'])-1];
        }
    }
    return arr;
}

resort.prototype.letter = function (num) {
    return optchoices[num];
}

module.exports = resort;