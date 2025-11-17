/**
 * DOM Helper utilities for vanilla JavaScript
 */

/**
 * Create an element with attributes and children
 */
export function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);

  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.substring(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else {
      element.setAttribute(key, value);
    }
  });

  // Append children
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      element.appendChild(child);
    }
  });

  return element;
}

/**
 * Query selector wrapper with error handling
 */
export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Query selector all wrapper
 */
export function $$(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

/**
 * Add event listener with automatic cleanup
 */
export function addEvent(element, event, handler, options = {}) {
  element.addEventListener(event, handler, options);
  return () => element.removeEventListener(event, handler, options);
}

/**
 * Show/hide element
 */
export function toggleVisibility(element, show) {
  if (show) {
    element.classList.remove('hidden');
  } else {
    element.classList.add('hidden');
  }
}

/**
 * Add/remove class
 */
export function toggleClass(element, className, add) {
  if (add) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
}

/**
 * Render template into container
 */
export function render(container, content) {
  if (typeof container === 'string') {
    container = $(container);
  }

  if (!container) return;

  if (typeof content === 'string') {
    container.innerHTML = content;
  } else if (content instanceof Node) {
    container.innerHTML = '';
    container.appendChild(content);
  }
}

export default {
  createElement,
  $,
  $$,
  addEvent,
  toggleVisibility,
  toggleClass,
  render
};
