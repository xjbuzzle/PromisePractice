//创建构造函数
function Promise(executor){
    //添加属性
    this.promiseState = 'pending';
    this.promiseResult = null;
    //创建一个对象类型的属性用来保存异步操作时的回调函数
    this.callback = {};
    //保存实例对象的this值
    const self = this;
    //resolve方法在用的时候会传一个实参，所以设置一个形参
    function resolve(data){
        //判断状态，如果不是pending就不改，实现promise对象的状态只能改一次
        if(self.promiseState !== 'pending') return;
        self.promiseState = 'fullfilled';//resolved
        self.promiseResult = data;
        //判断如果callback里面有onResolved方法，代表是异步操作，且保存了成功的回调
        if(this.callback.onResolved){
            //指定完回调，再去改变状态
            this.callback.onResolved(data);
        }
    }
    function reject(data){
        if(self.promiseState !== 'pending') return;
        self.promiseState = 'rejected';
        self.promiseResult = data;
        //判断如果callback里面有onResolved方法，代表是异步操作，且保存了失败的回调
        if(this.callback.onRejected){
            this.callback.onRejected(data);
        }s
    }
    //同步调用
    executor(resolve,reject);
}

Promise.prototype.then() = function(onResolved,onRejected){
    //判断promise对象是不是成功  promiseState
    //调用回调函数
    if(this.promiseState === 'fullfilled' || this.promiseState === 'resolved'){
        onResolved(this.promiseResult);
    }
    if(this.promiseState === 'rejected'){
        onRejected(this.promiseResult);
    }
    //如果是异步操作，会先到then方法指定回调再去改变状态，
    //所以异步操作到then的时候，状态是pending
    if(this.promiseState === 'pending'){
        //保存回调函数
        this.callback={
            onResolved: onResolved,
            onRejected: onRejected
        }
    }
}
