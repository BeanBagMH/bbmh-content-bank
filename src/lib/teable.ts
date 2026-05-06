/**
 * Teable-inspired Data Interface
 * This module provides a robust, table-centric abstraction for managing content.
 * It's designed to mirror the Teable/Airtable row-based logic for future integration.
 */

import type { ContentItem } from '../types';

export interface TeableRow extends ContentItem {
  _rev?: number;
  _createdAt?: string;
  _updatedAt?: string;
}

export class TeableClient {
  private storageKey = 'bbmh_teable_v1';

  constructor() {}

  async getRows(): Promise<TeableRow[]> {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  async createRow(data: Partial<TeableRow>): Promise<TeableRow> {
    const rows = await this.getRows();
    const newRow: TeableRow = {
      id: Date.now(),
      title: data.title || 'Untitled Strategy',
      col: data.col || 'video',
      fmt: data.fmt || 'Deep Reel',
      cluster: data.cluster || '01',
      cname: data.cname || 'General',
      status: data.status || 'Draft',
      day: data.day || new Date().getDate(),
      month: data.month || new Date().getMonth(),
      year: data.year || new Date().getFullYear(),
      hasScript: data.hasScript || false,
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: 1
    };
    
    const updatedRows = [...rows, newRow];
    localStorage.setItem(this.storageKey, JSON.stringify(updatedRows));
    return newRow;
  }

  async updateRow(id: number, updates: Partial<TeableRow>): Promise<TeableRow> {
    const rows = await this.getRows();
    const index = rows.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Row not found');

    const updatedRow = { 
      ...rows[index], 
      ...updates, 
      _updatedAt: new Date().toISOString(),
      _rev: (rows[index]._rev || 0) + 1 
    };
    
    rows[index] = updatedRow;
    localStorage.setItem(this.storageKey, JSON.stringify(rows));
    return updatedRow;
  }

  async deleteRow(id: number): Promise<void> {
    const rows = await this.getRows();
    const filteredRows = rows.filter(r => r.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filteredRows));
  }
}

export const teable = new TeableClient();
