# evt

hello, dear coder, I'm leslie, this is my first git project.

The project includes two modules: function-queue-control and publish-subscribe

# usage: function-quue-control

If you want to create an controlable function queue, you can do like this:

  const queue = new evt.FnQueue();
  
  // add functions to queue
  
  queue
    .add(() => {
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

  queue
    .add(step0 = () => {
        console.log('this is the step0');
        queue.next('the params of step1');
    })
    .add(step1);
    
  queue.remove('step0').remove(step1); // or queue.remove(['step0', step1]);
  
More examples please see the test folder
