import dns from 'dns';
import util from 'util';

const resolveSrv = util.promisify(dns.resolveSrv);

async function testNodeNetwork() {
  const target = '_mongodb._tcp.cluster0.5w38hkg.mongodb.net';

  console.log(`Attempting to look up SRV records for: ${target}...\n`);

  try {
    const addresses = await resolveSrv(target);
    console.log('✅ SUCCESS! Node.js found the database servers:');
    console.log(addresses);
  } catch (error) {
    console.log(
      '❌ FAILURE! Node.js is completely blocked from resolving DNS.',
    );
    console.error('Exact Error Code:', error.code);
    console.error('System Call:', error.syscall);
  }
}

testNodeNetwork();
