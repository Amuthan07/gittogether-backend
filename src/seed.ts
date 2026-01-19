import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import { AdminSignupDto } from './auth/dto/admin-signup.dto';

/**
 * Database Seed Script
 * 
 * Purpose: Creates the first admin user in the database
 * 
 * Usage: npm run seed
 * 
 * This script:
 * 1. Connects to the database
 * 2. Creates an admin user if it doesn't exist
 * 3. Closes the connection
 * 
 * Learning: This is called "bootstrapping" - setting up initial data
 */
async function seed() {
  console.log('🌱 Starting database seed...');

  // Create NestJS application context (without starting HTTP server)
  const app = await NestFactory.createApplicationContext(AppModule);
  
  // Get the AuthService (dependency injection!)
  const authService = app.get(AuthService);

  // Define your first admin
  const adminData: AdminSignupDto = {
    email: 'amuthan+admin@test.com',
    password: 'test123', 
  };

  try {
    // Try to create the admin
    await authService.createAdmin(adminData);
    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: ${adminData.email}`);
    console.log(`🔑 Password: ${adminData.password}`);
    console.log('⚠️  Please change the password after first login!');
  } catch (error) {
    // If admin already exists, that's okay
    if (error.message === 'Email already exists') {
      console.log('ℹ️  Admin user already exists, skipping...');
    } else {
      console.error('❌ Error creating admin:', error.message);
    }
  }

  // Close the application (important!)
  await app.close();
  console.log('🌱 Seed completed!');
}

// Run the seed function
seed()
  .then(() => {
    process.exit(0); // Exit successfully
  })
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1); // Exit with error
  });
