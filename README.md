This library exports a function that creates a synchronization primitive.
This primitive can be used to synchronize between two otherwise incompatible
asynchronous APIs.

synch
=====

```js
// Example: wrap an EventEmitter in an async generator
// Note how synch is used to coordinate between the EventEmitter listeners
// and the async generator wrapper

import synch from "@zingle/synch";

async function *chunks(emitter) {
  const sync = synch();       // create primitive
  const results = [];         // buffered results
  let done = false;           // set to true or error to stop iteration

  // setup simple listeners to buffer data and trigger iteration end
  // each listener ends with a call to synchronize with the async generator
  emitter.on("data", data => { results.push(data);  sync(); });
  emitter.on("error", err => { done = err;          sync(); });
  emitter.on("finish", () => { done = true;         sync(); });

  // synchronize with listeners and yield results in a loop
  while (!done) {             // stop when listener says iteration is done
    await sync;               // wait for listener to synchronize
    while (results.length) {  // yield any pending results from listener
      yield results.shift();  // avoid yield* to avoid pitfalls
    }
    sync.reset();             // reset synchronization for more results
  }

  if (done instanceof Error) {// check if iteration terminated with error
    throw done;               // throw the error
  }
}

// now the async generator can be used like so
for await (const chunk of chunks(emitter)) {
  console.log(chunk);
}
```
