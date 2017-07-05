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

$l.extend = (base, ...options) => {
  options.forEach(obj => {
    for(let key in obj){
      base[key] = obj[key];
    }
  });
  return base;
};

$l.ajax = options => {
  const request = new XMLHttpRequest();
  const defaults = {
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    method: "GET",
    url: "",
    success: () => {},
    error: () => {},
    data: {},
  };
  options = $l.extend(defaults, options);
  options.method = options.method.toUpperCase();

  if (options.method === "GET"){
    options.url += "?" + queryString(options.data);
  }

  request.open(options.method, options.url, true);
  request.onload = e => {
    if (request.status === 200) {
      options.success(request.response);
    } else {
      options.error(request.response);
    }
  };

  request.send(JSON.stringify(options.data));
};


queryString = (obj) => {
  let resultToString = '';

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      resultToString += key + '=' + obj[key] + '&';
    }
  }

  return resultToString.slice(0, -1);
}

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
