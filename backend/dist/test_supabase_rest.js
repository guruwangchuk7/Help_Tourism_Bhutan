"use strict";
const url = 'https://sahdrcajbflinfhlwgmb.supabase.co/rest/v1/destinations';
const apikey = 'sb_publishable_RVaEhvDjI2TE6ctNgtiK2A_2g9slg0N';
async function test() {
    try {
        console.log('Fetching destinations from Supabase REST API...');
        const res = await fetch(url, {
            headers: {
                'apikey': apikey,
                'Authorization': `Bearer ${apikey}`
            }
        });
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Response body:', text);
    }
    catch (err) {
        console.error('Fetch error:', err);
    }
}
test();
