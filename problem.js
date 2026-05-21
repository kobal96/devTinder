
// input = "aabbbccccddddd";
// output  : "a2b3c4d5"


var a = "aabbccccddddd";
var result = "";
var count = 1;

for (var i = 0; i < a.length; i++) {
    if (a[i] === a[i + 1]) {
        count++;
    } else {
        result += a[i] + count;
        count = 1;
    }
}
console.log(result);