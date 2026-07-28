import mongoose from 'mongoose';
import app from './app.js';
const port = process.env.PORT || 3000;

async function main() {
  const con = await mongoose.connect(process.env.LOCAL_DATABASE);
  console.log('DB connection successful!');
}

main().catch((err) => console.log(err));
console.log('hello');

app.listen(port, () => {
  console.log('server is running.');
});
