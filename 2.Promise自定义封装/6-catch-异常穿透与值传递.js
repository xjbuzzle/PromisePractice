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
    //判断回调函数的参数-因如果是穿透异常，catch或者失败的回调会放到最后
    //所以前面就接收不到onRejected，导致参数变成undefined
    if(typeof onRejected !== 'function'){
        //如果接收到的不是函数类型，那就让它变成函数，然后抛出异常
        //使得then方法返回的promise是rejected，值是reason
        //一直调用知道最后的失败的回调函数
        onRejected = reason=>{
            throw reason;
        }
    }
    
    //因为值传递的时候可以在then里面不传回调，所以，导致then接收到的是两个undefined
    //对onResolved方法进行初始化
    if(typeof onRejected !== 'function'){
        //如果接收到的不是函数类型，那就让它变成函数，然后值传递
        onResolved = value => value;
        //es6中的简写大括号，类似于value=>{return value;}
    }

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


//为Promise构造函数的显式原型prototype添加方法catch
Promise.prototype.catch = function(onRejected){
    return this.then(undefined,onRejected);
}


