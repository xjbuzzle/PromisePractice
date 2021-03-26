class Promise{
    constructor(executor){
        const self = this;
        self.promiseState = 'pending';
        self.promiseResult = null;
        self.callbacks = [];
        function resolve(data){
            if(self.promiseState !== 'pending') return;
            self.promiseState = 'resolved';//fullfilled
            self.promiseResult = data;
            setTimeout(()=>{
                self.callbacks.forEach(item=>{
                    item.onResolved(data);
                });
            });
        }
        function reject(data){
            if(self.promiseState !== 'pending') return;
            self.promiseState = 'rejected';
            self.promiseResult = data;
            setTimeout(()=>{
                self.callbacks.forEach(item=>{
                    item.onRejected(data);
                });
            });
        }
        try{
            exexcutor(resolve,reject);
        }catch(e){
            reject(e);
        }
    }

    then(onResolved,onRejected){
        const self = this;
        if(typeof onRejected !== 'function'){
            onRejected = reason =>{
                throw reason;
            }
        }

        if(typeof onResolved !== 'function'){
            onResolved = value => value;
        }

        return new Promise((resolve,reject)=>{
            function callback(type){
                try{
                    let res = type(self.promiseResult);
                    if(res instanceof Promise){
                        res.then(v=>{
                            resolve(v);
                        },r=>{
                            rejecct(r);
                        })
                    }else{
                        resolve(res);
                    }
                }catch(e){
                    reject(e);
                }
            }
            if(self.promiseState === 'resolved' || self.promiseState === 'fullfilled'){
                setTimeout(()=>{
                    callback(onResolved);
                });
            }

            if(self.promiseState === 'rejected'){
                setTimeout(()=>{
                    callback(onRejected);
                });
            }

            if(self.promiseState === 'pending'){
                self.callbacks.push({
                    onResolved: function(){
                        callback(onResolved);
                    },
                    onRejected:function(){
                        callback(onRejected);
                    }
                })
            }


        })
    }

    catch(onRejected){
        return this.then(undefined,onRejected);
    }

    static resolve(data){
        return new Promise((resolve,reject)=>{
            try{
                if(data instanceof Promise){
                    data.then(v=>{
                        resolve(v);
                    },r=>{
                        reject(r);
                    })
                }else{
                    resolve(data);
                }
            }catch(e){
                reject(e);
            }
        })
    }

    static reject(reason){
        return new Promise((resolve,reject)=>{
            reject(reason);
        })
    }

    static all(promises){
        return new Promise((resolve,reject)=>{
            let count = 0;
            let arr = [];
            for(let i=0;i<promises.length;i++){
                promises[i].then(v=>{
                    count++;
                    arr[i] = v;
                    if(count === promises.length){
                        resolve(arr);
                    }
                },r=>{
                    reject(r);
                })
            }
        })
    }

    static race(promises){
        return new Promise((resolve,reject)=>{
            for(let i=0;i<promises.length;i++){
                promises[i].then(v=>{
                    resolve(v);
                },r=>{
                    reject(r);
                })
            }
        })
    }

}


