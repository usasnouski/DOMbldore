/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

class DOMNodeCollection {
  constructor(htmlElements) {
    this.elements = htmlElements;
  }

  html(str) {
    if (typeof str === 'string') {
      this.elements.forEach(el => el.innerHTML = str);
    } else {
      return this.elements[0].innerHTML;
    }
  }

  empty() {
    if (this.elements.length > 0) {
        this.elements.forEach(el => el.innerHTML = "");
    }
  }

  append(children) {
    if (this.elements.length === 0) return;

    if (children instanceof HTMLElement) children = $(children);

    if (children instanceof DOMNodeCollection) {
      this.elements.forEach(parent => {
        children.forEach(child => parent.innerHTML += child.outerHTML);
      });
    } else if(typeof children === 'string') {
      this.elements.forEach(parent => parent.innerHTML += children);
    }
  }

  attr(key, val) {
    if (typeof val === 'string') {
      this.elements.forEach(el => el.setAttribute(key, val));
    } else {
      this.elements[0].getAttribute(key);
    }
  }

  addClass(name) {
    this.elements.forEach(el => el.classList.add(name));
  }

  removeClass(name) {
    this.elements.forEach(el => el.classList.remove(name));
  }

  children() {
    let elsChildren = [];

    this.elements.forEach(node => {
      const nodeChildren = Array.from(node.children);
      elsChildren = elsChildren.concat(nodeChildren);
    });

    return new DOMNodeCollection(elsChildren);
  }

  parent() {
    const parentsArr = [];
    this.elements.forEach( child => {
      if (!parentsArr.includes(child.parentNode)) {
        parentsArr.push(child.parentNode);
      }
    });
    return new DOMNodeCollection(parentsArr);
  }

  find(selector) {
    result = [];
    this.elements.forEach(el => {
      const nodes = Array.from(el.querySelectorAll(selector));
      result = result.concat(nodes);
    });

    return new DOMNodeCollection(result);
  }

  remove() {
    this.elements.forEach(el => el.parentNode.removeChild(el));
  }

  on(eventType, callback) {
    this.forEach(node => {
      node.addEventListener(eventType, callback);
      const eventKey = `jqliteEvents-${eventType}`;
      if (typeof node[eventKey] === "undefined") {
        node[eventKey] = [];
      }
      node[eventKey].push(callback);
    });
  }

  off(eventType) {
    this.each(node => {
      const eventKey = `jqliteEvents-${eventType}`;
      if (node[eventKey]) {
        node[eventKey].forEach(callback => {
          node.removeEventListener(eventType, callback);
        });
      }
      node[eventKey] = [];
    });
  }

}

module.exports = DOMNodeCollection;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(0);

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


/***/ })
/******/ ]);
//# sourceMappingURL=dombldore.js.map