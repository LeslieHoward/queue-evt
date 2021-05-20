# evt

## prepare

run `npm install queue-evt --save` or `yarn add queue-evt`

the library include two modules: FnQueue（for handling task queue）and Signal（publish-subscribe）

### using in normal html page:

    <script src="your project path/index.min.js">

### using by import or require

    import evt from 'evt';
    import { FnQueue } from 'evt';

## usage: FnQueue

    const queue = new evt.FnQueue();

### add tasks

    queue.add(() => {
        console.log('this is the step0');
        queue.next('the params of step1');
    }).add((step1_params) => {
        console.log(step1_params);
    });

    // the tasks will be performed in sequence
    queue.fire();

### remove tasks

    function step1(step1_params) {
        // ...
    }

    queue.add(step0 = () => {
        console.log('this is the step0');
        queue.next('the params of step1');
    }).add(step1);

    queue.remove('step0').remove(step1); // or：queue.remove(['step0', step1]);

### skip the task

    function step1(step1_params) {
        // ...
    }

    // the function step1 will not be performed
    queue.add(step0 = () => {
        console.log('this is the step0');
        if(Math.floor(Math.random() * 100) % 2 == 0) {
            queue.skip();
        }
    }).add(step1);

PS: get into demo folder to view more demo.

## usage: Signal

    const signal = new evt.Signal();

### add a subscription

    signal.on('GET_SOME_DATA', function(queue, data) {
        console.log('the data is: ', data);
    });

### or add a queue of subscriptions

    signal.on('GET_SOME_DATA', [
        function(data, queue) {
            console.log('the data is: ', data);
            data.tip = 'hello, this is a tip !';
            queue.next(data);
        },
        function(processed_data, queue) {
            console.log(processed_data);
        }
    ], {
        autoExcute: false
    });

### publish a subscription calling 'GET_SOME_DATA'

    new Promise(resolve => {
        // emulate to fetching data
        setTimeout(() => {
            resolve({ name: 'Rolling Stone' });
        }, 2000);
    }).then(data => {
        signal.emit('GET_SOME_DATA', data);
    });
