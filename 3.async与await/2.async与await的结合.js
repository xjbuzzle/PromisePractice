//取出resources中的三个文件
const fs = require('fs');
//用上node.js8中的新功能util.promisfy,可以接收一个以errorfirst为参数的函数，返回一个新的promise对象
const util = require('util');
const mineReadFile = util.promisify(fs.readFile);

async function main(){
    //在async函数内部用上await，await右侧是promise对象
    try{
        let data1 = await mineReadFile('./resources/1.html');
        let data2 = await mineReadFile('./resources/2.html');
        let data3 = await mineReadFile('./resources/3.html');
        console.log(data1 + data2 + data3);
    }catch(e){
        //如果有异常会用到try..catch
        console.log(e);
    }
}

main();