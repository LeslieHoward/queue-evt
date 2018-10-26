# evt

安装：

npm install queue-evt --save 或者 yarn add queue-evt

本项目包含两个模块: FnQueue（任务队列） 和 Signal（发布订阅）

在 HTML 中引用:

    <script src="your project path/evt.min.js">

用 import 或者 require 方式进行引用:

    import evt from 'evt'; // 或者只引用其中一个模块: import {  FnQueue } from 'evt';

# 用法: FnQueue

    const queue = new evt.FnQueue();

添加任务

    queue.add(() => {
        console.log('this is the step0');
        queue.next('the params of step1');
    }).add((step1_params) => {
        console.log(step1_params);
    });

    // 按添加顺序执行任务队列
    queue.fire();

删除任务

    function step1(step1_params) {
        // ...
    }

    queue.add(step0 = () => {
        console.log('this is the step0');
        queue.next('the params of step1');
    }).add(step1);

    queue.remove('step0').remove(step1); // 或者是：queue.remove(['step0', step1]);

跳过任务

    function step1(step1_params) {
        // ...
    }

    // 下面的 step1 函数将不会执行
    queue.add(step0 = () => {
        console.log('this is the step0');
        if(Math.floor(Math.random() * 100) % 2 == 0) {
            queue.skip();
        }
    }).add(step1);

更多 demo 参考 demo 文件夹

# 用法: Signal

    // 实例化
    const signal = new evt.Signal();

    // 添加一个订阅
    signal.on('GET_SOME_DATA', function(queue, data) {
        console.log('the data is: ', data);
    });

    // 或者是添加一个队列来处理订阅
    signal.on('GET_SOME_DATA', [
        function(data, queue) {
            console.log('the data is: ', data);
            data.tip = 'hello, this is a tip !';
            queue.next(data);
        },
        function(processed_data, queue) {
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
