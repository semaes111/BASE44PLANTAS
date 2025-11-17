/**
 * Card component
 */

import { createElement } from '@base44plantas/utils/dom';

export function createCard({ title, content, className = '', onClick }) {
  const card = createElement('div', {
    className: `card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${className}`,
    onClick
  }, []);

  if (title) {
    const titleEl = createElement('h3', {
      className: 'text-lg font-semibold mb-3 text-gray-900'
    }, [title]);
    card.appendChild(titleEl);
  }

  if (typeof content === 'string') {
    const contentEl = createElement('div', {
      className: 'text-gray-600'
    }, [content]);
    card.appendChild(contentEl);
  } else if (content instanceof Node) {
    card.appendChild(content);
  }

  return card;
}

export function createStatsCard({ label, value, icon, trend }) {
  const content = createElement('div', { className: 'flex items-center justify-between' }, []);

  const textContainer = createElement('div', {}, []);

  const labelEl = createElement('p', {
    className: 'text-sm text-gray-600 mb-1'
  }, [label]);

  const valueEl = createElement('p', {
    className: 'text-2xl font-bold text-gray-900'
  }, [String(value)]);

  textContainer.appendChild(labelEl);
  textContainer.appendChild(valueEl);

  if (trend) {
    const trendEl = createElement('p', {
      className: `text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`
    }, [trend > 0 ? `+${trend}%` : `${trend}%`]);
    textContainer.appendChild(trendEl);
  }

  content.appendChild(textContainer);

  if (icon) {
    const iconEl = createElement('div', {
      className: 'text-3xl text-blue-600'
    }, [icon]);
    content.appendChild(iconEl);
  }

  return createCard({ content, className: 'stats-card' });
}

export default {
  createCard,
  createStatsCard
};
