# evt

The project includes two modules: function-queue-control and publish-subscribe

usage in html: <script src="your project path/evt.min.js">
usage in react: import evt from 'evt'; // or introduce one of the modules: import { FnQueue } from 'evt'; 

# usage: function-queue-control

If you want to create an controlable function queue, you can do like this:

    const queue = new evt.FnQueue();
  
    // add functions to queue
  
    queue.add(() => {
        console.log('this is the step0');
        queue.next('the params of step1');
    })
    
    .add((step1_params) => {
        console.log(step1_params);
    });
    
    // then functions is executed in the order of addition 
 
    queue.fire();
 
You can also delete or skip one of the functions

    function step1(step1_params) {
        // ...
    }
  
    queue.add(step0 = () => {
        console.log('this is the step0');
        queue.next('the params of step1');
    })
    
    .add(step1);
    
    queue.remove('step0').remove(step1);   // or queue.remove(['step0', step1]);
  
More examples please see the test folder

# usage: publish-subscription

    // initial an instance
    const signal = new evt.Signal();
    
    // then add a subscription
    signal.on('GET_SOME_DATA', function(queue, data) {
        console.log('the data is: ', data);
    });
    
    // or add a queue to handle the subscription
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
    
    // release the event: GET_SOME_DATA
    new Promise(resolve => {
        // emulate to fetch data
        setTimeout(() => {
            resolve({ name: 'Rolling Stone' });
        }, 2000);
    }).then(data => {
        signal.emit('GET_SOME_DATA', data);
    });
