const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pg = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { parse } = require('csv-parse');
const { createReadStream } = require('fs');
const { Transform } = require('stream');
const { Parser } = require('json2csv');


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Setup PostgreSQL connection
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5437/loomra',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper functions
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role]
    );
    
    // Generate token
    const token = generateToken(newUser.rows[0].id);
    
    res.status(201).json({
      token,
      user: newUser.rows[0]
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    
    // Generate token
    const token = generateToken(user.rows[0].id);
    
    res.json({
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

app.get('/api/auth/user', authenticateToken, async (req, res) => {
  try {
    const user = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [req.user.id]);
    
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    res.json(user.rows[0]);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Server error fetching user data.' });
  }
});

// Clients routes
app.get('/api/clients', authenticateToken, async (req, res) => {
  try {
    const clients = await pool.query(
      'SELECT c.*, array_agg(t.tag_name) as tags FROM clients c ' +
      'LEFT JOIN client_tags t ON c.id = t.client_id ' +
      'WHERE c.user_id = $1 ' +
      'GROUP BY c.id ' +
      'ORDER BY c.name',
      [req.user.id]
    );
    
    res.json(clients.rows);
  } catch (err) {
    console.error('Get clients error:', err);
    res.status(500).json({ message: 'Server error fetching clients.' });
  }
});

app.get('/api/clients/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get client details
    const client = await pool.query(
      'SELECT c.*, array_agg(t.tag_name) as tags FROM clients c ' +
      'LEFT JOIN client_tags t ON c.id = t.client_id ' +
      'WHERE c.id = $1 AND c.user_id = $2 ' +
      'GROUP BY c.id',
      [id, req.user.id]
    );
    
    if (client.rows.length === 0) {
      return res.status(404).json({ message: 'Client not found.' });
    }
    
    // Get client custom fields
    const customFields = await pool.query(
      'SELECT field_name, field_value FROM client_custom_fields WHERE client_id = $1',
      [id]
    );
    
    // Convert custom fields to an object
    const customFieldsObj = {};
    customFields.rows.forEach(field => {
      customFieldsObj[field.field_name] = field.field_value;
    });
    
    // Combine client details with custom fields
    const clientWithCustomFields = {
      ...client.rows[0],
      customFields: customFieldsObj
    };
    
    res.json(clientWithCustomFields);
  } catch (err) {
    console.error('Get client error:', err);
    res.status(500).json({ message: 'Server error fetching client details.' });
  }
});

app.post('/api/clients', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, company, address, notes, tags, customFields } = req.body;
    
    // Start a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Create client
      const newClient = await client.query(
        'INSERT INTO clients (name, email, phone, company, address, notes, user_id) ' +
        'VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [name, email, phone, company, address, notes, req.user.id]
      );
      
      // Add tags if provided
      if (tags && tags.length > 0) {
        const tagValues = tags.map(tag => {
          return `('${tag}', ${newClient.rows[0].id})`;
        }).join(', ');
        
        await client.query(
          `INSERT INTO client_tags (tag_name, client_id) VALUES ${tagValues}`
        );
      }
      
      // Add custom fields if provided
      if (customFields && Object.keys(customFields).length > 0) {
        for (const [key, value] of Object.entries(customFields)) {
          await client.query(
            'INSERT INTO client_custom_fields (client_id, field_name, field_value) VALUES ($1, $2, $3)',
            [newClient.rows[0].id, key, value]
          );
        }
      }
      
      await client.query('COMMIT');
      
      // Return the new client with tags
      newClient.rows[0].tags = tags || [];
      newClient.rows[0].customFields = customFields || {};
      
      res.status(201).json(newClient.rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Create client error:', err);
    res.status(500).json({ message: 'Server error creating client.' });
  }
});

app.put('/api/clients/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, company, address, notes, tags, customFields } = req.body;
    
    // Check if client exists and belongs to user
    const clientExists = await pool.query(
      'SELECT * FROM clients WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    
    if (clientExists.rows.length === 0) {
      return res.status(404).json({ message: 'Client not found.' });
    }
    
    // Start a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Update client
      await client.query(
        'UPDATE clients SET name = $1, email = $2, phone = $3, company = $4, address = $5, notes = $6 WHERE id = $7',
        [name, email, phone, company, address, notes, id]
      );
      
      // Update tags
      if (tags) {
        // Delete existing tags
        await client.query('DELETE FROM client_tags WHERE client_id = $1', [id]);
        
        // Add new tags
        if (tags.length > 0) {
          const tagValues = tags.map(tag => {
            return `('${tag}', ${id})`;
          }).join(', ');
          
          await client.query(
            `INSERT INTO client_tags (tag_name, client_id) VALUES ${tagValues}`
          );
        }
      }
      
      // Update custom fields
      if (customFields) {
        // Delete existing custom fields
        await client.query('DELETE FROM client_custom_fields WHERE client_id = $1', [id]);
        
        // Add new custom fields
        if (Object.keys(customFields).length > 0) {
          for (const [key, value] of Object.entries(customFields)) {
            await client.query(
              'INSERT INTO client_custom_fields (client_id, field_name, field_value) VALUES ($1, $2, $3)',
              [id, key, value]
            );
          }
        }
      }
      
      await client.query('COMMIT');
      
      // Return the updated client
      const updatedClient = await pool.query(
        'SELECT c.*, array_agg(t.tag_name) as tags FROM clients c ' +
        'LEFT JOIN client_tags t ON c.id = t.client_id ' +
        'WHERE c.id = $1 ' +
        'GROUP BY c.id',
        [id]
      );
      
      // Get updated custom fields
      const updatedCustomFields = await pool.query(
        'SELECT field_name, field_value FROM client_custom_fields WHERE client_id = $1',
        [id]
      );
      
      // Convert custom fields to an object
      const customFieldsObj = {};
      updatedCustomFields.rows.forEach(field => {
        customFieldsObj[field.field_name] = field.field_value;
      });
      
      // Combine client details with custom fields
      const clientWithCustomFields = {
        ...updatedClient.rows[0],
        customFields: customFieldsObj
      };
      
      res.json(clientWithCustomFields);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Update client error:', err);
    res.status(500).json({ message: 'Server error updating client.' });
  }
});

app.delete('/api/clients/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if client exists and belongs to user
    const clientExists = await pool.query(
      'SELECT * FROM clients WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    
    if (clientExists.rows.length === 0) {
      return res.status(404).json({ message: 'Client not found.' });
    }
    
    // Delete client (cascade will delete related tags and custom fields)
    await pool.query('DELETE FROM clients WHERE id = $1', [id]);
    
    res.json({ message: 'Client deleted successfully.' });
  } catch (err) {
    console.error('Delete client error:', err);
    res.status(500).json({ message: 'Server error deleting client.' });
  }
});

// Tasks routes
app.get('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await pool.query(
      'SELECT t.*, c.name as client_name, c.id as client_id FROM tasks t ' +
      'LEFT JOIN clients c ON t.client_id = c.id ' +
      'WHERE t.user_id = $1 ' +
      'ORDER BY t.due_date',
      [req.user.id]
    );
    
    // Format the response
    const formattedTasks = tasks.rows.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.due_date,
      client: {
        id: task.client_id,
        name: task.client_name
      }
    }));
    
    res.json(formattedTasks);
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ message: 'Server error fetching tasks.' });
  }
});

app.get('/api/clients/:id/tasks', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const tasks = await pool.query(
      'SELECT * FROM tasks WHERE client_id = $1 AND user_id = $2 ORDER BY due_date',
      [id, req.user.id]
    );
    
    res.json(tasks.rows);
  } catch (err) {
    console.error('Get client tasks error:', err);
    res.status(500).json({ message: 'Server error fetching client tasks.' });
  }
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, clientId } = req.body;
    
    // Create task
    const newTask = await pool.query(
      'INSERT INTO tasks (title, description, status, priority, due_date, client_id, user_id) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, status, priority, dueDate, clientId, req.user.id]
    );
    
    res.status(201).json(newTask.rows[0]);
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ message: 'Server error creating task.' });
  }
});

// Meetings routes
app.get('/api/meetings', authenticateToken, async (req, res) => {
  try {
    const meetings = await pool.query(
      'SELECT m.*, c.name as client_name, c.id as client_id FROM meetings m ' +
      'LEFT JOIN clients c ON m.client_id = c.id ' +
      'WHERE m.user_id = $1 ' +
      'ORDER BY m.date',
      [req.user.id]
    );
    
    // Format the response
    const formattedMeetings = meetings.rows.map(meeting => ({
      id: meeting.id,
      title: meeting.title,
      description: meeting.description,
      date: meeting.date,
      type: meeting.type,
      location: meeting.location,
      client: {
        id: meeting.client_id,
        name: meeting.client_name
      }
    }));
    
    res.json(formattedMeetings);
  } catch (err) {
    console.error('Get meetings error:', err);
    res.status(500).json({ message: 'Server error fetching meetings.' });
  }
});

app.get('/api/clients/:id/meetings', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const meetings = await pool.query(
      'SELECT * FROM meetings WHERE client_id = $1 AND user_id = $2 ORDER BY date',
      [id, req.user.id]
    );
    
    res.json(meetings.rows);
  } catch (err) {
    console.error('Get client meetings error:', err);
    res.status(500).json({ message: 'Server error fetching client meetings.' });
  }
});

app.post('/api/meetings', authenticateToken, async (req, res) => {
  try {
    const { title, description, date, type, location, clientId } = req.body;
    
    // Create meeting
    const newMeeting = await pool.query(
      'INSERT INTO meetings (title, description, date, type, location, client_id, user_id) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, date, type, location, clientId, req.user.id]
    );
    
    res.status(201).json(newMeeting.rows[0]);
  } catch (err) {
    console.error('Create meeting error:', err);
    res.status(500).json({ message: 'Server error creating meeting.' });
  }
});

// Dashboard routes
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    // Get total clients
    const clientsCount = await pool.query(
      'SELECT COUNT(*) FROM clients WHERE user_id = $1',
      [req.user.id]
    );
    
    // Get active tasks (not done)
    const activeTasksCount = await pool.query(
      'SELECT COUNT(*) FROM tasks WHERE user_id = $1 AND status != $2',
      [req.user.id, 'done']
    );
    
    // Get upcoming meetings
    const upcomingMeetingsCount = await pool.query(
      'SELECT COUNT(*) FROM meetings WHERE user_id = $1 AND date > NOW()',
      [req.user.id]
    );
    
    // Get completed tasks
    const completedTasksCount = await pool.query(
      'SELECT COUNT(*) FROM tasks WHERE user_id = $1 AND status = $2',
      [req.user.id, 'done']
    );
    
    const stats = {
      totalClients: parseInt(clientsCount.rows[0].count),
      activeTasks: parseInt(activeTasksCount.rows[0].count),
      upcomingMeetings: parseInt(upcomingMeetingsCount.rows[0].count),
      completedTasks: parseInt(completedTasksCount.rows[0].count)
    };
    
    res.json(stats);
  } catch (err) {
    console.error('Get dashboard stats error:', err);
    res.status(500).json({ message: 'Server error fetching dashboard stats.' });
  }
});

app.get('/api/dashboard/activity', authenticateToken, async (req, res) => {
  try {
    // Get recent clients (created in the last 30 days)
    const recentClients = await pool.query(
      'SELECT id, name, created_at FROM clients WHERE user_id = $1 AND created_at > NOW() - INTERVAL \'30 days\' ORDER BY created_at DESC LIMIT 5',
      [req.user.id]
    );
    
    // Get recent tasks (created or updated in the last 30 days)
    const recentTasks = await pool.query(
      'SELECT id, title, status, updated_at FROM tasks WHERE user_id = $1 AND updated_at > NOW() - INTERVAL \'30 days\' ORDER BY updated_at DESC LIMIT 5',
      [req.user.id]
    );
    
    // Get upcoming meetings
    const upcomingMeetings = await pool.query(
      'SELECT id, title, date FROM meetings WHERE user_id = $1 AND date > NOW() ORDER BY date ASC LIMIT 5',
      [req.user.id]
    );
    
    // Combine and format the activity
    const activity = [
      ...recentClients.rows.map(client => ({
        id: client.id,
        type: 'client',
        title: `New client: ${client.name}`,
        date: client.created_at
      })),
      ...recentTasks.rows.map(task => ({
        id: task.id,
        type: 'task',
        title: task.title,
        date: task.updated_at,
        status: task.status
      })),
      ...upcomingMeetings.rows.map(meeting => ({
        id: meeting.id,
        type: 'meeting',
        title: meeting.title,
        date: meeting.date
      }))
    ];
    
    // Sort by date (newest first)
    activity.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Return the 10 most recent activities
    res.json(activity.slice(0, 10));
  } catch (err) {
    console.error('Get dashboard activity error:', err);
    res.status(500).json({ message: 'Server error fetching dashboard activity.' });
  }
});

// CSV import/export routes
const upload = multer({ dest: 'uploads/' });

app.post('/api/clients/import', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    
    const results = [];
    
    createReadStream(req.file.path)
      .pipe(parse({ headers: true }))
      .pipe(new Transform({
        objectMode: true,
        transform: (data, encoding, callback) => {
          results.push(data);
          callback();
        }
      }))
      .on('finish', async () => {
        try {
          // Start a transaction
          const client = await pool.connect();
          try {
            await client.query('BEGIN');
            
            let importedCount = 0;
            
            for (const row of results) {
              // Check if client already exists (by email)
              const existingClient = await client.query(
                'SELECT id FROM clients WHERE email = $1 AND user_id = $2',
                [row.email, req.user.id]
              );
              
              if (existingClient.rows.length > 0) {
                continue; // Skip this client
              }
              
              // Create client
              const newClient = await client.query(
                'INSERT INTO clients (name, email, phone, company, address, notes, user_id) ' +
                'VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
                [row.name, row.email, row.phone, row.company, row.address, row.notes, req.user.id]
              );
              
              // Add tags if provided
              if (row.tags) {
                const tags = row.tags.split(',').map(tag => tag.trim());
                if (tags.length > 0) {
                  for (const tag of tags) {
                    await client.query(
                      'INSERT INTO client_tags (tag_name, client_id) VALUES ($1, $2)',
                      [tag, newClient.rows[0].id]
                    );
                  }
                }
              }
              
              importedCount++;
            }
            
            await client.query('COMMIT');
            
            res.json({ message: `Successfully imported ${importedCount} clients.` });
          } catch (err) {
            await client.query('ROLLBACK');
            throw err;
          } finally {
            client.release();
          }
        } catch (err) {
          console.error('CSV import error:', err);
          res.status(500).json({ message: 'Server error importing clients.' });
        }
      });
  } catch (err) {
    console.error('CSV import error:', err);
    res.status(500).json({ message: 'Server error importing clients.' });
  }
});

app.get('/api/clients/export', authenticateToken, async (req, res) => {
  try {
    const { includeNotes, includeCustomFields, includeInactiveClients } = req.query;
    
    // Get all clients
    let clientsQuery = 'SELECT c.*, array_agg(t.tag_name) as tags FROM clients c ' +
      'LEFT JOIN client_tags t ON c.id = t.client_id ' +
      'WHERE c.user_id = $1 ';
      
    if (includeInactiveClients === 'false') {
      clientsQuery += "AND c.id IN (SELECT client_id FROM client_tags WHERE tag_name != 'inactive') ";
    }
    
    clientsQuery += 'GROUP BY c.id ORDER BY c.name';
    
    const clients = await pool.query(clientsQuery, [req.user.id]);
    
    // Process clients for CSV
    const processedClients = await Promise.all(clients.rows.map(async (client) => {
      const processedClient = {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        address: client.address,
        tags: client.tags.join(', ')
      };
      
      // Include notes if requested
      if (includeNotes === 'true') {
        processedClient.notes = client.notes;
      }
      
      // Include custom fields if requested
      if (includeCustomFields === 'true') {
        const customFields = await pool.query(
          'SELECT field_name, field_value FROM client_custom_fields WHERE client_id = $1',
          [client.id]
        );
        
        customFields.rows.forEach(field => {
          processedClient[`custom_${field.field_name}`] = field.field_value;
        });
      }
      
      return processedClient;
    }));
    
    // Generate CSV
    const fields = ['id', 'name', 'email', 'phone', 'company', 'address', 'tags'];
    if (includeNotes === 'true') {
      fields.push('notes');
    }
    
    // Add custom fields to CSV fields
    if (includeCustomFields === 'true' && processedClients.length > 0) {
      const customFieldKeys = Object.keys(processedClients[0])
        .filter(key => key.startsWith('custom_'));
      fields.push(...customFieldKeys);
    }
    
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(processedClients);
    
    // Set headers for file download
    res.header('Content-Type', 'text/csv');
    res.attachment('loomra_clients.csv');
    
    res.send(csv);
  } catch (err) {
    console.error('CSV export error:', err);
    res.status(500).json({ message: 'Server error exporting clients.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
console.log("Using DB URL:", process.env.DATABASE_URL);
