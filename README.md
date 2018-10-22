# evt

本项目包含两个模块: FnQueue（任务队列） 和 Signal（发布订阅）

在HTML中引用: <script src="your project path/evt.min.js">

在React中引用: import evt from 'evt'; // 或者只引用其中一个模块: import { FnQueue } from 'evt'; 

# 用法: FnQueue

    const queue = new evt.FnQueue();
  
    // 添加任务到队列中
  
    queue.add(() => {
        console.log('this is the step0');
        queue.next('the params of step1');
    })
    
    .add((step1_params) => {
        console.log(step1_params);
    });
    
    // 按添加顺序执行这个任务队列 
 
    queue.fire();
 
可以删除或者跳过任务

    function step1(step1_params) {
        // ...
    }
  
    queue.add(step0 = () => {
        console.log('this is the step0');
        queue.next('the params of step1');
    })
    
    .add(step1);
    
    queue.remove('step0').remove(step1);   // 或者是： queue.remove(['step0', step1]);
  
更多demo参考demo文件夹

# 用法: Signal

    // 实例化
    const signal = new evt.Signal();
    
    // 添加一个订阅
    signal.on('GET_SOME_DATA', function(queue, data) {
        console.log('the data is: ', data);
    });
    
    // 或者是添加一个队列来处理订阅
    signal.on('GET_SOME_DATA', [
        function(queue, data) {
            console.log('the data is: ', data);
            data.tip = 'hello, this is a tip !';
            queue.next(data);
        },
        function(queue, processed_data) {
            console.log(processed_data);
        }
    ]);
    
    // 发布订阅: GET_SOME_DATA
    new Promise(resolve => {
        // emulate to fetch data
        setTimeout(() => {
            resolve({ name: 'Rolling Stone' });
        }, 2000);
    }).then(data => {
        signal.emit('GET_SOME_DATA', data);
    });
