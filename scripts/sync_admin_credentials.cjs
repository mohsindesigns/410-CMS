const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function syncAdmin() {
  try {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB || 'eagle_revolution';
    if (!uri) {
      console.error('No MONGODB_URI found in .env.local');
      return;
    }

    await mongoose.connect(uri, { dbName });
    console.log('Connected to DB:', dbName);

    // Find or create Admin role
    let adminRole = await mongoose.connection.db.collection('roles').findOne({ name: 'Admin' });
    if (!adminRole) {
      const defaultPermissions = {
        pages: { create: true, read: true, update: true, delete: true, publish: true },
        media: { create: true, read: true, update: true, delete: true },
        seo: { read: true, update: true },
        blog: { create: true, read: true, update: true, delete: true, publish: true },
        submissions: { read: true, delete: true },
        settings: { read: true, update: true },
        users: { read: true, create: true, update: true, delete: true },
        logs: { read: true }
      };
      const roleInsert = await mongoose.connection.db.collection('roles').insertOne({
        name: 'Admin',
        isCustom: false,
        permissions: defaultPermissions
      });
      adminRole = { _id: roleInsert.insertedId, permissions: defaultPermissions };
      console.log('Admin role created');
    }

    const envUser = process.env.ADMIN_USERNAME || 'admin';
    const envPass = process.env.ADMIN_PASSWORD || 'Admin@410Muscle2026';

    const hashedPassword = await bcrypt.hash(envPass, 10);
    const defaultPassword = await bcrypt.hash('Password123!', 10);

    // Sync env admin user
    await mongoose.connection.db.collection('users').updateOne(
      { username: envUser },
      {
        $set: {
          username: envUser,
          email: `${envUser}@410-muscletherapy.com`,
          password: hashedPassword,
          role: adminRole._id,
          status: 'active'
        }
      },
      { upsert: true }
    );
    console.log(`Synced user: ${envUser} with password: ${envPass}`);

    // Also sync 'admin' with BOTH env password and default
    await mongoose.connection.db.collection('users').updateOne(
      { username: 'admin' },
      {
        $set: {
          username: 'admin',
          email: 'admin@410-muscletherapy.com',
          password: hashedPassword, // Matches Admin@410Muscle2026
          role: adminRole._id,
          status: 'active'
        }
      },
      { upsert: true }
    );
    console.log(`Synced user: admin with password: ${envPass}`);

    console.log('Admin credentials synced successfully!');
  } catch (err) {
    console.error('Error syncing admin credentials:', err);
  } finally {
    await mongoose.connection.close();
  }
}

syncAdmin();
