export function random(len: number) {
    let options =  "bwdbwdodjdkbsjdkd124744";
    let length = options.length;

    let ans = ""
    for(let i = 0; i<len; i++){
        ans = ans + options[Math.floor((Math.random() * length))]
    }
    return ans;
}