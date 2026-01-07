const pool = require('./config/database');

const setupDatabase = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Fragrances table (replaces products for fragrance info)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fragrances (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Fragrance sizes table (variants/SKUs)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fragrance_sizes (
        id SERIAL PRIMARY KEY,
        fragrance_id INTEGER REFERENCES fragrances(id) ON DELETE CASCADE,
        size_name VARCHAR(50) NOT NULL,
        burn_time VARCHAR(50) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        stock_quantity INTEGER NOT NULL DEFAULT 0,
        sku VARCHAR(100) UNIQUE,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_email VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255),
        customer_phone VARCHAR(50),
        shipping_address TEXT,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        stripe_payment_intent_id VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Order items table (updated to reference fragrance_size)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        fragrance_size_id INTEGER REFERENCES fragrance_sizes(id),
        product_name VARCHAR(255) NOT NULL,
        size_name VARCHAR(50),
        burn_time VARCHAR(50),
        quantity INTEGER NOT NULL,
        price_at_purchase DECIMAL(10, 2) NOT NULL,
        image_url TEXT
      );
    `);

    // Discount codes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS discount_codes (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        discount_type VARCHAR(20) NOT NULL,
        discount_value DECIMAL(10, 2) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Database tables created successfully!');
    
    // Insert sample fragrances
    const fragranceResult = await pool.query(`
      INSERT INTO fragrances (name, description, image_url)
      VALUES 
        ('Lavender Dreams', 'Relaxing lavender scented candle with hints of chamomile', 'https://images.unsplash.com/photo-1602874801006-504e3b7c5c59?w=400'),
        ('Vanilla Bliss', 'Sweet vanilla bean candle with warm caramel undertones', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400'),
        ('Ocean Breeze', 'Fresh ocean-inspired scent with sea salt and driftwood', 'https://images.unsplash.com/photo-1602874801006-504e3b7c5c59?w=400'),
        ('Autumn Spice', 'Warm cinnamon and clove with maple notes', 'https://images.unsplash.com/photo-1602874801006-504e3b7c5c59?w=400'),
        ('Citrus Grove', 'Zesty lemon and orange with bergamot', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400'),
        ('Forest Pine', 'Crisp pine needles with cedarwood base', 'https://images.unsplash.com/photo-1602874801006-504e3b7c5c59?w=400')
      ON CONFLICT DO NOTHING
      RETURNING id;
    `);

    console.log('✅ Sample fragrances added!');

    // Insert size variants for each fragrance
    if (fragranceResult.rows.length > 0) {
      const fragranceIds = fragranceResult.rows.map(row => row.id);
      
      for (const fragranceId of fragranceIds) {
        await pool.query(`
          INSERT INTO fragrance_sizes (fragrance_id, size_name, burn_time, price, stock_quantity, sku)
          VALUES 
            ($1::integer, '6 oz', '30-35', 18.00, 15, $2),
            ($1::integer, '9 oz', '45-50', 28.00, 10, $3),
            ($1::integer, '12 oz', '60-70', 38.00, 8, $4)
          ON CONFLICT (sku) DO NOTHING;
        `, [
          fragranceId, 
          `FRAG${fragranceId}-6OZ`,
          `FRAG${fragranceId}-9OZ`,
          `FRAG${fragranceId}-12OZ`
        ]);
      }
      
      console.log('✅ Sample fragrance sizes added!');
    }

    // Add a sample discount code
    await pool.query(`
      INSERT INTO discount_codes (code, discount_type, discount_value, is_active)
      VALUES ('WELCOME10', 'percentage', 10.00, true)
      ON CONFLICT (code) DO NOTHING;
    `);

    console.log('✅ Sample discount code added!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
};

setupDatabase();