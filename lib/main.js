const DOMNodeCollection = require('./dom_node_collection.js');

window.$l = (arg) => {
  if (typeof arg === 'string') {
    return selectNodes(arg);
  } else if (arg instanceof HTMLElement) {
    const argArr = [arg];
    return new DOMNodeCollection(argArr);
  }
};

function selectNodes(selector) {
  const nodeList = document.querySelectorAll(selector);
  const nodeListArr = Array.from(nodeList);
  return new DOMNodeCollection(nodeListArr);
}
