"use strict";
async function test() {
    try {
        const res = await fetch('https://sahdrcajbflinfhlwgmb.supabase.co/rest/v1/destinations', {
            headers: {
                'apikey': 'sb_publishable_RVaEhvDjI2TE6ctNgtiK2A_2g9slg0N',
                'Authorization': `Bearer sb_publishable_RVaEhvDjI2TE6ctNgtiK2A_2g9slg0N`
            }
        });
        console.log('Status:', res.status);
        console.log('Headers:');
        for (const [key, value] of res.headers.entries()) {
            console.log(`  ${key}: ${value}`);
        }
    }
    catch (err) {
        console.error(err);
    }
}
test();
