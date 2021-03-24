/**
 * 封装一个函数 mineReadFile
 * 参数：path  文件路径
 * 返回值：promise对象
 */

function mineReadFile(path){
    return new Promise((resolve,reject)=>{
        const fs=require('fs');
        fs.readFile(path,(err,data)=>{
            if(err) reject(err);
            resolve(data.toString());
        })
    })
}

mineReadFile('./resource/content.txt').then(
    value=>{
        console.log(value);
    },reason=>{
        console.warn(reason);
    }
)
