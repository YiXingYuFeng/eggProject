
function fn(a) {
    function sum(b) {
      return  a+=b
    }
    sum.toString = function (){
        a++;
    }
    return sum
}

console.info(fn(1)(2) )
