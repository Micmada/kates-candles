const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all fragrances with their sizes
router.get('/', async (req, res) => {
  try {
    // Get all active fragrances
    const fragrancesResult = await pool.query(
      'SELECT * FROM fragrances WHERE is_active = true ORDER BY created_at DESC'
    );
    
    // For each fragrance, get its sizes
    const fragrances = await Promise.all(
      fragrancesResult.rows.map(async (fragrance) => {
        const sizesResult = await pool.query(
          'SELECT * FROM fragrance_sizes WHERE fragrance_id = $1 AND is_active = true ORDER BY price ASC',
          [fragrance.id]
        );
        
        return {
          ...fragrance,
          sizes: sizesResult.rows
        };
      })
    );
    
    res.json(fragrances);
  } catch (error) {
    console.error('Error fetching fragrances:', error);
    res.status(500).json({ error: 'Failed to fetch fragrances' });
  }
});

// GET single fragrance with sizes
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const fragranceResult = await pool.query(
      'SELECT * FROM fragrances WHERE id = $1',
      [id]
    );
    
    if (fragranceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Fragrance not found' });
    }
    
    const sizesResult = await pool.query(
      'SELECT * FROM fragrance_sizes WHERE fragrance_id = $1 AND is_active = true ORDER BY price ASC',
      [id]
    );
    
    const fragrance = {
      ...fragranceResult.rows[0],
      sizes: sizesResult.rows
    };
    
    res.json(fragrance);
  } catch (error) {
    console.error('Error fetching fragrance:', error);
    res.status(500).json({ error: 'Failed to fetch fragrance' });
  }
});

// POST new fragrance (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, description, image_url } = req.body;
    
    const result = await pool.query(
      'INSERT INTO fragrances (name, description, image_url) VALUES ($1, $2, $3) RETURNING *',
      [name, description, image_url]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating fragrance:', error);
    res.status(500).json({ error: 'Failed to create fragrance' });
  }
});

// PUT update fragrance
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, is_active } = req.body;
    
    const result = await pool.query(
      `UPDATE fragrances 
       SET name = $1, description = $2, image_url = $3, is_active = $4, updated_at = NOW()
       WHERE id = $5 
       RETURNING *`,
      [name, description, image_url, is_active, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Fragrance not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating fragrance:', error);
    res.status(500).json({ error: 'Failed to update fragrance' });
  }
});

// DELETE fragrance (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'UPDATE fragrances SET is_active = false WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Fragrance not found' });
    }
    
    res.json({ message: 'Fragrance deleted successfully' });
  } catch (error) {
    console.error('Error deleting fragrance:', error);
    res.status(500).json({ error: 'Failed to delete fragrance' });
  }
});

// ===== SIZE VARIANT ROUTES =====

// POST new size variant for a fragrance
router.post('/:id/sizes', async (req, res) => {
  try {
    const { id } = req.params;
    const { size_name, burn_time, price, stock_quantity, sku } = req.body;
    
    const result = await pool.query(
      `INSERT INTO fragrance_sizes (fragrance_id, size_name, burn_time, price, stock_quantity, sku) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [id, size_name, burn_time, price, stock_quantity, sku]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating fragrance size:', error);
    res.status(500).json({ error: 'Failed to create fragrance size' });
  }
});

// PUT update size variant
router.put('/sizes/:sizeId', async (req, res) => {
  try {
    const { sizeId } = req.params;
    const { size_name, burn_time, price, stock_quantity, sku, is_active } = req.body;
    
    const result = await pool.query(
      `UPDATE fragrance_sizes 
       SET size_name = $1, burn_time = $2, price = $3, stock_quantity = $4, 
           sku = $5, is_active = $6, updated_at = NOW()
       WHERE id = $7 
       RETURNING *`,
      [size_name, burn_time, price, stock_quantity, sku, is_active, sizeId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Fragrance size not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating fragrance size:', error);
    res.status(500).json({ error: 'Failed to update fragrance size' });
  }
});

// DELETE size variant (soft delete)
router.delete('/sizes/:sizeId', async (req, res) => {
  try {
    const { sizeId } = req.params;
    
    const result = await pool.query(
      'UPDATE fragrance_sizes SET is_active = false WHERE id = $1 RETURNING *',
      [sizeId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Fragrance size not found' });
    }
    
    res.json({ message: 'Fragrance size deleted successfully' });
  } catch (error) {
    console.error('Error deleting fragrance size:', error);
    res.status(500).json({ error: 'Failed to delete fragrance size' });
  }
});

// Update stock quantity for a size (useful for inventory management)
router.patch('/sizes/:sizeId/stock', async (req, res) => {
  try {
    const { sizeId } = req.params;
    const { stock_quantity } = req.body;
    
    const result = await pool.query(
      'UPDATE fragrance_sizes SET stock_quantity = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [stock_quantity, sizeId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Fragrance size not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ error: 'Failed to update stock' });
  }
});

module.exports = router;