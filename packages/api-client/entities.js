/**
 * Entity API methods for Base44
 */

import { base44Client } from './base44-client.js';

/**
 * Entity operations
 */
export const entities = {
  /**
   * Get all entities of a specific type
   */
  async getAll(entityType, params = {}) {
    return base44Client.get(`/apps/${base44Client.appId}/entities/${entityType}`, params);
  },

  /**
   * Get a single entity by ID
   */
  async getById(entityType, id) {
    return base44Client.get(`/apps/${base44Client.appId}/entities/${entityType}/${id}`);
  },

  /**
   * Create a new entity
   */
  async create(entityType, data) {
    return base44Client.post(`/apps/${base44Client.appId}/entities/${entityType}`, data);
  },

  /**
   * Update an existing entity
   */
  async update(entityType, id, data) {
    return base44Client.put(`/apps/${base44Client.appId}/entities/${entityType}/${id}`, data);
  },

  /**
   * Delete an entity
   */
  async delete(entityType, id) {
    return base44Client.delete(`/apps/${base44Client.appId}/entities/${entityType}/${id}`);
  },

  /**
   * Query entities with filters
   */
  async query(entityType, filters = {}) {
    return base44Client.post(`/apps/${base44Client.appId}/entities/${entityType}/query`, filters);
  }
};

export default entities;
