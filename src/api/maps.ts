import type { Injury } from '../types';

export interface MapData {
  slug: string;
  editKey?: string;
  name: string;
  injuries: Injury[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMapRequest {
  name: string;
  injuries: Injury[];
}

export interface UpdateMapRequest {
  name?: string;
  injuries?: Injury[];
}

class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(response.status, error.error || 'Unknown error');
  }
  return response.json();
}

// GET /api/maps/:slug - Get map by slug (view mode)
export async function fetchMapBySlug(slug: string): Promise<MapData> {
  const response = await fetch(`/api/maps/${slug}`);
  return handleResponse<MapData>(response);
}

// GET /api/maps/edit/:editKey - Get map by edit key (edit mode)
export async function fetchMapByEditKey(editKey: string): Promise<MapData> {
  const response = await fetch(`/api/maps/edit/${editKey}`);
  return handleResponse<MapData>(response);
}

// POST /api/maps - Create new map
export async function createMap(data: CreateMapRequest): Promise<MapData> {
  const response = await fetch('/api/maps', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<MapData>(response);
}

// PUT /api/maps/edit/:editKey - Update map
export async function updateMap(editKey: string, data: UpdateMapRequest): Promise<MapData> {
  const response = await fetch(`/api/maps/edit/${editKey}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<MapData>(response);
}

export { ApiError };

