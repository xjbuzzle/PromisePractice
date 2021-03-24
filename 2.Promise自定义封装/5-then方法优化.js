//创建构造函数
function Promise(executor){
    //保存this对象
    const self = this;
    //添加属性
    this.promiseState = 'pending';
    this.promiseResult = null;
    //给对象添加一个属性callback，用来保存异步操作时，then方法指定的回调函数
    //用数组保存一个个callback对象
    //每一个callback对象保存一组then方法指定的回调函数,确保都在，都能执行到
    this.callbacks = [];
    function resolve(data){
        //判断状态，实现promise对象只改一次状态
        if(self.promiseState !== 'pending') return;
        self.promiseState = 'resolved';
        self.promiseResult = data;
        // //判断如果callback里面有onResolved方法，代表是异步操作，且保存了成功的回调
        // if(self.callback.onResolved){
        //     //指定完回调，再去改变状态
        //     self.callback.onResolved(data);
        // }
        //确保执行callbacks数组的每一组回调
        self.callbacks.forEach(item=>{
            item.onResolved(data);
        })
    }
    function reject(data){
        //判断状态，实现promise对象只改一次状态
        if(self.promiseState !== 'pending') return;
        self.promiseState = 'rejected';
        self.promiseResult = data;
        // //判断如果callback里面有onResolved方法，代表是异步操作，且保存了失败的回调
        // if(self.callback.onRejected){
        //     self.callback.onRejected(data);
        // }
        //确保执行callbacks数组的每一组回调
        self.callbacks.forEach(item=>{
            item.onRejected(data);
        })
    }
    try{
        //同步调用执行器函数
        executor(resolve,reject);
    }catch(e){
        reject(e);
    }
}

Promise.prototype.then = function(onResolved,onRejected){
    const self = this;
    //封装代码-提高复用率
    function callback(type){
        try{
            let res = type(self.promiseResult);
            if(res instanceof Promise){
                res.then(v=>{
                    resolve(v);
                },r=>{
                    reject(r);
                })
            }else{
                resolve(res);
            }
        }catch(e){
            reject(e);
        }
    }
    //then方法会返回一个新的promise对象
    return new Promise((resolve,reject)=>{
        //执行回调函数
        if(self.promiseState === 'resolved' || self.promiseState === 'fullfilled'){
            //如果成功的回调函数里面抛出异常，用try{}catch{}包裹
            callback(onResolved);
        }
        if(self.promiseState === 'rejected'){
            //如果成功的回调函数里面抛出异常，用try{}catch{}包裹
            callback(onRejected);
        }
        //判断：如果是异步操作，也就是pending状态，就保存回调函数
        if(self.promiseState === 'pending'){
            //当then方法指定了多个回调函数的时候，这样会导致最后一次的指定覆盖掉前面的指定
            //每次以pending的字体调用callbacks，都会保存对应的回调函数，全部插入callbacks数组
            self.callback.push({
                onResolved: function(){
                    callback(onResolved);
                },
                onRejected: function(){
                    callback(onRejected);
                }
            })
        }
    })


}

//当执行器函数中做的是异步操作时，会先到then方法指定回调函数
//再去改变状态





