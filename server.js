import dns from 'dns';
if (process.env.NODE_ENV === 'development') {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

import './unCaughtException.js';
import mongoose from 'mongoose';
import app from './app.js';

const port = process.env.PORT || 3000;
let server; // Declare it globally so process.on can access it!

async function main() {
  // 1. First, wait for the database connection to succeed
  const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD,
  );
  await mongoose.connect(DB);
  console.log('DB connection successful!');

  // 2. Only start the server AFTER the DB is connected
  server = app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
  });
}

// Start the application
main();

// 3. Global safety net for any asynchronous failure
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION: Shutting down...');
  console.log(err.name, err.message);

  // If the server successfully started before the error occurred, close it gracefully
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    // If it failed before the server even booted, exit immediately
    process.exit(1);
  }
});
