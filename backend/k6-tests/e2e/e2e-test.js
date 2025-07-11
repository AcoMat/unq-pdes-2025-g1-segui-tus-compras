import http from 'k6/http';
import { check, sleep } from 'k6';
import { vu } from 'k6/execution';
import { BASE_URL, users, productsIds } from '../config.js';

export const options = {
    vus: 3, // 3 virtual users for end-to-end testing
    duration: '60s', // Run for 1 minute
    thresholds: {
        http_req_duration: ['p(95)<3000'], // 95% of requests should complete within 3s
        http_req_failed: ['rate<0.05'], // Less than 5% of requests should fail
        checks: ['rate>0.95'], // 95% of checks should pass
    },
};


// Store registered users for testing
let registeredUsers = [];

export function setup() {
    console.log('Setting up test data - registering users for e2e testing...');

    // Register users for e2e testing
    const usersToRegister = users.slice(0, 8); // Register first 8 users

    usersToRegister.forEach((user, index) => {
        const uniqueId = `e2e${index}${Date.now()}`;
        const uniqueUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: `${user.firstName.toLowerCase()}${user.lastName.toLowerCase()}${uniqueId}@email.com`,
            password: user.password
        };

        const payload = JSON.stringify(uniqueUser);
        const params = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const response = http.post(`${BASE_URL}/auth/register`, payload, params);

        if (response.status === 200) {
            registeredUsers.push({
                email: uniqueUser.email,
                password: uniqueUser.password,
                firstName: uniqueUser.firstName,
                lastName: uniqueUser.lastName
            });
        } else {
            console.error(`Failed to register user: ${uniqueUser.email}, Status: ${response.status}`);
        }

        sleep(0.1); // Small delay between registrations
    });

    console.log(`Setup complete. ${registeredUsers.length} users registered for testing.`);
    return { registeredUsers };
}

export default function(data) {
    const testUser = data.registeredUsers[vu.idInTest % data.registeredUsers.length];
    const productId = productsIds[Math.floor(Math.random() * productsIds.length)];

    console.log(`[VU ${vu.idInTest}] Starting e2e flow with user: ${testUser.email}, product: ${productId}`);

    // Step 1: Login
    const loginPayload = JSON.stringify({
        email: testUser.email,
        password: testUser.password
    });

    const loginParams = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const loginResponse = http.post(`${BASE_URL}/auth/login`, loginPayload, loginParams);

    check(loginResponse, {
        'login successful': (r) => r.status === 200,
        'login returns user data': (r) => r.body && JSON.parse(r.body).firstName !== undefined,
    });

    if (loginResponse.status !== 200) {
        console.error(`[VU ${vu.idInTest}] Login failed for ${testUser.email}`);
        return;
    }

    // Extract the token from the Authorization header
    const authToken = loginResponse.headers['Authorization'];
    if (!authToken) {
        console.error(`[VU ${vu.idInTest}] No Authorization header found in login response`);
        return;
    }

    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': authToken, // Use the header directly (already includes "Bearer ")
    };

    sleep(1);

    // Step 2: Add product to favorites
    const favoritePayload = JSON.stringify({
        productId: productId
    });

    const favoriteParams = {
        headers: authHeaders,
    };

    const favoriteResponse = http.put(`${BASE_URL}/favorites`, favoritePayload, favoriteParams);

    check(favoriteResponse, {
        'add to favorites successful': (r) => r.status === 200,
    });

    if (favoriteResponse.status !== 200) {
        console.error(`[VU ${vu.idInTest}] Add to favorites FAILED for ${testUser.email}`);
        console.error(`[VU ${vu.idInTest}] Status: ${favoriteResponse.status}`);
        console.error(`[VU ${vu.idInTest}] Response body: ${favoriteResponse.body}`);
        console.error(`[VU ${vu.idInTest}] Request payload: ${favoritePayload}`);
    }

    sleep(1);

    // Step 3: Purchase the product
    const purchasePayload = JSON.stringify({
        items: [{
            productId: productId,
            amount: Math.floor(Math.random() * 3) + 1 // Random quantity between 1-3
        }]
    });

    const purchaseParams = {
        headers: authHeaders,
    };

    const purchaseResponse = http.post(`${BASE_URL}/purchases`, purchasePayload, purchaseParams);

    check(purchaseResponse, {
        'purchase successful': (r) => r.status === 200,
        'purchase response contains success message': (r) => r.body && r.body.includes('successfully'),
    });

    if (purchaseResponse.status !== 200) {
        console.error(`[VU ${vu.idInTest}] Purchase FAILED for ${testUser.email}`);
        console.error(`[VU ${vu.idInTest}] Status: ${purchaseResponse.status}`);
        console.error(`[VU ${vu.idInTest}] Response body: ${purchaseResponse.body}`);
        console.error(`[VU ${vu.idInTest}] Request payload: ${purchasePayload}`);
        console.error(`[VU ${vu.idInTest}] Auth headers: ${JSON.stringify(authHeaders)}`);
    }

    sleep(1);

    // Step 4: Post a review for the purchased product
    const reviewPayload = JSON.stringify({
        rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1-5
        review: `Great product! Testing review from user ${testUser.firstName}. Quality is excellent and delivery was fast.`
    });

    const reviewParams = {
        headers: authHeaders,
    };

    const reviewResponse = http.post(`${BASE_URL}/products/${productId}/reviews`, reviewPayload, reviewParams);

    check(reviewResponse, {
        'review post successful': (r) => r.status === 200,
        'review response contains success message': (r) => r.body && r.body.includes('successfully'),
    });

    if (reviewResponse.status !== 200) {
        console.error(`[VU ${vu.idInTest}] Review post FAILED for ${testUser.email}`);
        console.error(`[VU ${vu.idInTest}] Status: ${reviewResponse.status}`);
        console.error(`[VU ${vu.idInTest}] Response body: ${reviewResponse.body}`);
        console.error(`[VU ${vu.idInTest}] Request payload: ${reviewPayload}`);
        console.error(`[VU ${vu.idInTest}] Product ID: ${productId}`);
        console.error(`[VU ${vu.idInTest}] Auth headers: ${JSON.stringify(authHeaders)}`);
    }

    sleep(1);

    // Step 5: Verify user profile and purchases
    const profileResponse = http.get(`${BASE_URL}/profile`, { headers: authHeaders });

    check(profileResponse, {
        'profile retrieval successful': (r) => r.status === 200,
        'profile contains user data': (r) => r.body && JSON.parse(r.body).firstName === testUser.firstName,
    });

    if (profileResponse.status !== 200) {
        console.error(`[VU ${vu.idInTest}] Profile retrieval FAILED for ${testUser.email}`);
        console.error(`[VU ${vu.idInTest}] Status: ${profileResponse.status}`);
        console.error(`[VU ${vu.idInTest}] Response body: ${profileResponse.body}`);
    }

    const purchasesResponse = http.get(`${BASE_URL}/purchases`, { headers: authHeaders });

    check(purchasesResponse, {
        'purchases retrieval successful': (r) => r.status === 200,
        'purchases contain data': (r) => r.body && Array.isArray(JSON.parse(r.body)),
    });

    if (purchasesResponse.status !== 200) {
        console.error(`[VU ${vu.idInTest}] Purchases retrieval FAILED for ${testUser.email}`);
        console.error(`[VU ${vu.idInTest}] Status: ${purchasesResponse.status}`);
        console.error(`[VU ${vu.idInTest}] Response body: ${purchasesResponse.body}`);
    }

    console.log(`[VU ${vu.idInTest}] Completed e2e flow for user: ${testUser.email}`);

    sleep(2); // Wait before next iteration
}