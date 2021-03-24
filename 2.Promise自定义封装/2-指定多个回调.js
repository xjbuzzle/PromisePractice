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
    //执行回调函数
    if(this.promiseState === 'resolved' || this.promiseState === 'fullfilled'){
        onResolved(this.promiseResult);
    }
    if(this.promiseState === 'rejected'){
        onRejected(this.promiseResult);
    }
    //判断：如果是异步操作，也就是pending状态，就保存回调函数
    // if(this.promiseState === 'pending'){
    //     this.callback = {
    //         onResolved: onResolved,
    //         onRejected: onRejected
    //     }
    // }
    //当then方法指定了多个回调函数的时候，这样会导致最后一次的指定覆盖掉前面的指定
    //每次以pending的字体调用callbacks，都会保存对应的回调函数，全部插入callbacks数组
    this.callbacks.push({
        onResolved: onResolved,
        onRejected: onRejected
    })


}

//当执行器函数中做的是异步操作时，会先到then方法指定回调函数
//再去改变状态





