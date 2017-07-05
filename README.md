# DOMbldore #

DOMbldore is a lightweight JavaScript library inspired by jQuery. It can be used for making AJAX requests, handling events (`on` and `off` methods), manipulating the DOM, and guaranteeing it works across browsers.


## Core Functionality ##

`$l` is DOMbldore's pivotal function and serves as a wrapper for all the library methods, allowing users to select elements using CSS selectors or queue functions to be run once documents has loaded.

```JavaScript

const $l = (arg) => {
  if (typeof arg === 'string') {
    return selectNodes(arg);
  } else if (arg instanceof HTMLElement) {
    const argArr = [arg];
    return new DOMNodeCollection(argArr);
  } else if (typeof arg === 'function') {
    return registerDocReadyCallback(arg);
  }
};

```

### DOM Manipulation ###

* `html(html)` takes in optional string as argument to set `innerHTML` of selected elements. However, the return value is the `innerHTML` of the first element if no argument is provided.

* `empty()` clears out the content of `innerHTML` of all selected elements.

* `append(element)` flexibly appends an `HTMLElement`, `DOMNodeCollection`, or string to every selected element.

* `addClass(className)` adds a class to all selected elements.

* `removeClass(className)` removes specified class from each selected elements.

### DOM Traversal ###

* `children()` returns a `DOMNodeCollection` of all direct children of every selected element.

* `parent()` returns a `DOMNodeCollection` containing the parent nodes of every selected element.

* `find(selector)` returns all elements matching the CSS selector argument.

* `remove()` removes all selected elements from the DOM.

## AJAX Requests ##


* `$l.ajax({ options })` sends an `XMLHttpRequest` using passed in options object.

```javascript
$l.ajax({
  method: 'GET',
  url: 'https://randomurl.domen.com/comments',
  data: { postId: '1' },
})
```
