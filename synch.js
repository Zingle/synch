export default function synch() {
  let synchronize;
  let promise = new Promise(resolve => synchronize = resolve);

  return Object.assign(function() {
    synchronize();
  }, {
    then(fn) { return promise.then(fn); },
    reset() { promise = new Promise(resolve => synchronize = resolve); }
  });
}
