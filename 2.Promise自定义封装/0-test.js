//创建构造函数
//promise实例化的时候会传一个执行器函数作为实参，所以声明的时候用一个executor表示接受执行器函数的形参
function Promise(executor){
    const self = this;
    this.promiseState = 'pending';
    this.promiseResult = null;
    this.callbacks = [];
    function resolve(data){
        if(self.promiseState !== 'pending') return;
        self.promiseState = 'resolved';
        self.promiseResult = data;
        self.callbacks.forEach(item=>{
            item.onResolved(self.promiseResult);
        });
    }

    function reject(data){
        if(self.promiseState !== 'pending') return;
        self.promiseState = 'rejected';
        self.promiseResult = data;
        self.callbacks.forEach(item=>{
            item.onRejected(self.promiseResult);
        })
    }

    try{
        executor(resolve,reject);
    }catch(e){
        reject(e);
    }
}

Promise.prototype.then = function(onResolved,onRejected){
    return new Promise((resolve,reject)=>{
        const self = this;
        if(self.promiseState === 'resolved' || self.promiseState === 'fullfilled'){
            try{
                let res = onResolved(self.promiseResult);
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
        if(self.promiseState === 'rejected'){
            try{
                let res = onRejected(self.promiseResult);
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
        if(self.promiseState === 'pending'){
            self.callbacks.push({
                onResolved: onResolved,
                onRejected: onRejected
            })
        }
    });
}
