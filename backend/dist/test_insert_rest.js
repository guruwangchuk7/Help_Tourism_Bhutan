"use strict";
async function test() {
    try {
        const res = await fetch('https://sahdrcajbflinfhlwgmb.supabase.co/rest/v1/destinations', {
            method: 'POST',
            headers: {
                'apikey': 'sb_publishable_RVaEhvDjI2TE6ctNgtiK2A_2g9slg0N',
                'Authorization': `Bearer sb_publishable_RVaEhvDjI2TE6ctNgtiK2A_2g9slg0N`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                id: 99,
                name: "Test Destination",
                image: "/test.jpg",
                description: "Test description",
                price: "$100",
                rating: 5.0,
                location: "Test Location"
            })
        });
        console.log('Status:', res.status);
        console.log('Body:', await res.text());
    }
    catch (err) {
        console.error(err);
    }
}
test();
