const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all discount codes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM discount_codes ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching discount codes:', error);
    res.status(500).json({ error: 'Failed to fetch discount codes' });
  }
});

// Validate discount code
router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;
    
    const result = await pool.query(
      `SELECT * FROM discount_codes 
       WHERE code = $1 
       AND is_active = true 
       AND (expires_at IS NULL OR expires_at > NOW())`,
      [code.toUpperCase()]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid or expired discount code' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error validating discount code:', error);
    res.status(500).json({ error: 'Failed to validate discount code' });
  }
});

// Create discount code
router.post('/', async (req, res) => {
  try {
    const { code, discount_type, discount_value, expires_at } = req.body;
    
    const result = await pool.query(
      `INSERT INTO discount_codes (code, discount_type, discount_value, expires_at)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [code.toUpperCase(), discount_type, discount_value, expires_at || null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ error: 'Discount code already exists' });
    }
    console.error('Error creating discount code:', error);
    res.status(500).json({ error: 'Failed to create discount code' });
  }
});

// Update discount code
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount_type, discount_value, is_active, expires_at } = req.body;
    
    const result = await pool.query(
      `UPDATE discount_codes 
       SET code = $1, discount_type = $2, discount_value = $3, 
           is_active = $4, expires_at = $5
       WHERE id = $6
       RETURNING *`,
      [code.toUpperCase(), discount_type, discount_value, is_active, expires_at || null, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Discount code not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating discount code:', error);
    res.status(500).json({ error: 'Failed to update discount code' });
  }
});

// Delete discount code
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM discount_codes WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Discount code not found' });
    }
    
    res.json({ message: 'Discount code deleted successfully' });
  } catch (error) {
    console.error('Error deleting discount code:', error);
    res.status(500).json({ error: 'Failed to delete discount code' });
  }
});

module.exports = router;