/**
 * Modal component
 */

import { createElement } from '@base44plantas/utils/dom';

export function createModal({ title, content, onClose, className = '' }) {
  // Create overlay
  const overlay = createElement('div', {
    className: 'modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
    onClick: (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    }
  }, []);

  // Create modal container
  const modal = createElement('div', {
    className: `modal-container bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden ${className}`
  }, []);

  // Create header
  const header = createElement('div', {
    className: 'modal-header px-6 py-4 border-b border-gray-200 flex items-center justify-between'
  }, []);

  const titleEl = createElement('h2', {
    className: 'text-xl font-semibold text-gray-900'
  }, [title]);

  const closeBtn = createElement('button', {
    className: 'text-gray-400 hover:text-gray-600 text-2xl leading-none',
    onClick: closeModal
  }, ['×']);

  header.appendChild(titleEl);
  header.appendChild(closeBtn);

  // Create body
  const body = createElement('div', {
    className: 'modal-body px-6 py-4 overflow-y-auto'
  }, []);

  if (typeof content === 'string') {
    body.innerHTML = content;
  } else if (content instanceof Node) {
    body.appendChild(content);
  }

  // Assemble modal
  modal.appendChild(header);
  modal.appendChild(body);
  overlay.appendChild(modal);

  function closeModal() {
    overlay.remove();
    if (onClose) onClose();
  }

  // Add to document
  document.body.appendChild(overlay);

  return {
    element: overlay,
    close: closeModal,
    updateContent: (newContent) => {
      body.innerHTML = '';
      if (typeof newContent === 'string') {
        body.innerHTML = newContent;
      } else if (newContent instanceof Node) {
        body.appendChild(newContent);
      }
    }
  };
}

export default createModal;
