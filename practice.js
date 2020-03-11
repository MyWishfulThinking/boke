// var lengthOfLongestSubstring = function(s) {
//     if(s.length == 0) return 0
//     var result = 1;
//     for(let i = 0 ; i < s.length ; i++){
//         var curMax = 1
//         for(let j = i+1 ; j <= s.length ; j++){
//             var curString = s.slice(i,j)
//             var curCode = s.charAt(j)
//             if(curString.indexOf(curCode) != -1){
//                 break;
//             } else {
//                 curMax++;
//             }
//         }
//         if(curMax > result) result = curMax;
//     }
//     return result;
// };
var lengthOfLongestSubstring = function(s) {
    const len = s.length
    let hashMap = new Map()
    let start = 0
    let end = 0
    let maxLen = 0
    while (end < len) {
        if (!hashMap.has(s[end])) {
            hashMap.set(s[end++], 1)
            // maxLen = Math.max(maxLen, [...hashMap.keys()].length)
            if(maxLen<hashMap.size){
                maxLen = hashMap.size
            }
        } else {
            hashMap.delete(s[start++])
        }
    }
    return maxLen
};
lengthOfLongestSubstring('abfcdfabcdbb')