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
