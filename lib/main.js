const DOMNodeCollection = require('./dom_node_collection.js');

let docReady = false;
const docReadyCallbacks = [];


window.$l = (arg) => {
  if (typeof arg === 'string') {
    return selectNodes(arg);
  } else if (arg instanceof HTMLElement) {
    const argArr = [arg];
    return new DOMNodeCollection(argArr);
  } else if (typeof arg === 'function') {
    return registerDocReadyCallback(arg);
  }
};


registerDocReadyCallback = (func) => {
  if(!docReady){
    docReadyCallbacks.push(func);
  } else {
    func();
  }
};


function selectNodes(selector) {
  const nodeList = document.querySelectorAll(selector);
  const nodeListArr = Array.from(nodeList);
  return new DOMNodeCollection(nodeListArr);
}


document.addEventListener('DOMContentLoaded', () => {
  docReady = true;
  docReadyCallbacks.forEach(callback => callback());
});
