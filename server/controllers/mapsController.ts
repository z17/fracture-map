import { Request, Response } from 'express';
import { MapModel } from '../models/Map.js';
import { generateSlug, generateEditKey } from '../utils/slug.js';

// GET /api/maps/:slug - Get map by slug (view mode)
export async function getMapBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const map = await MapModel.findOne({ slug });
    
    if (!map) {
      return res.status(404).json({ error: 'Map not found' });
    }
    
    // Return without editKey for security
    return res.json({
      slug: map.slug,
      name: map.name,
      injuries: map.injuries,
      createdAt: map.createdAt,
      updatedAt: map.updatedAt,
    });
  } catch (error) {
    console.error('Error getting map by slug:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/maps/edit/:editKey - Get map by edit key (edit mode)
export async function getMapByEditKey(req: Request, res: Response) {
  try {
    const { editKey } = req.params;
    const map = await MapModel.findOne({ editKey });
    
    if (!map) {
      return res.status(404).json({ error: 'Map not found' });
    }
    
    // Return full data including editKey
    return res.json({
      slug: map.slug,
      editKey: map.editKey,
      name: map.name,
      injuries: map.injuries,
      createdAt: map.createdAt,
      updatedAt: map.updatedAt,
    });
  } catch (error) {
    console.error('Error getting map by editKey:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /api/maps - Create new map
export async function createMap(req: Request, res: Response) {
  try {
    const { name, injuries } = req.body;
    
    let slug = generateSlug(name || 'map');
    const editKey = generateEditKey();
    
    // Check if slug exists, add suffix if needed
    let existingMap = await MapModel.findOne({ slug });
    let suffix = 1;
    while (existingMap) {
      slug = `${generateSlug(name || 'map')}-${suffix}`;
      existingMap = await MapModel.findOne({ slug });
      suffix++;
    }
    
    const map = new MapModel({
      slug,
      editKey,
      name: name || '',
      injuries: injuries || [],
    });
    
    await map.save();
    
    return res.status(201).json({
      slug: map.slug,
      editKey: map.editKey,
      name: map.name,
      injuries: map.injuries,
      createdAt: map.createdAt,
      updatedAt: map.updatedAt,
    });
  } catch (error) {
    console.error('Error creating map:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// PUT /api/maps/edit/:editKey - Update map
export async function updateMap(req: Request, res: Response) {
  try {
    const { editKey } = req.params;
    const { name, injuries } = req.body;
    
    const map = await MapModel.findOne({ editKey });
    
    if (!map) {
      return res.status(404).json({ error: 'Map not found' });
    }
    
    if (name !== undefined) map.name = name;
    if (injuries !== undefined) map.injuries = injuries;
    
    await map.save();
    
    return res.json({
      slug: map.slug,
      editKey: map.editKey,
      name: map.name,
      injuries: map.injuries,
      createdAt: map.createdAt,
      updatedAt: map.updatedAt,
    });
  } catch (error) {
    console.error('Error updating map:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

