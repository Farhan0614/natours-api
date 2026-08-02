import mongoose from 'mongoose';
import app from './app.js';
const port = process.env.PORT || 3000;

async function main() {
  const con = await mongoose.connect(process.env.LOCAL_DATABASE);
  console.log('DB connection successful!');
}

main();
// .catch((err) => console.log('ERROR', err));

const server = app.listen(port, () => {
  console.log('server is running.');
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION: Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
