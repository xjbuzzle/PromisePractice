const fs = require('fs');

//回调函数的形式
// fs.readFile('./resource/content.txt',(err,data)=>{
//     if(err) throw err;
//     console.log(data.toString());
// })

//Promise的形式
const p = new Promise((resolve,reject)=>{
    fs.readFile('./resource/content.txt',(err,data)=>{
        if(err) reject(err);
        resolve(data.toString());
    })
});

p.then(value=>{
    console.log(value);
},reason=>{
    console.log(reason);
})

