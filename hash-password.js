/**
 * hash-password.js
 * Utility script to generate a bcrypt hash for the admin password.
 *
 * Usage:
 *   node hash-password.js <your-password>
 *
 * Copy the output into your .env file as ADMIN_PASSWORD_HASH.
 */

const bcrypt = require('./backend/node_modules/bcrypt');

const password = process.argv[2];

if (!password) {
  console.error('Usage: node hash-password.js <password>');
  process.exit(1);
}

const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    process.exit(1);
  }
  console.log('\nGenerated hash:\n');
  console.log(hash);
  console.log('\nAdd this to your .env file as:');
  console.log(`ADMIN_PASSWORD_HASH="${hash}"\n`);
});
