import http from 'k6/http';
import { check } from 'k6';
import { vu } from 'k6/execution';
import { BASE_URL, users } from '../config.js';

export const options = {
    vus: 10, // Reduced to 5 virtual users to avoid overwhelming the database
    duration: '15s', // Run for 30 seconds
};

let iterationCounter = 0;

export default function () {
    // Increment counter for each iteration
    iterationCounter++;

    // Select a random user from the list
    const user = users[Math.floor(Math.random() * users.length)];

    // Create truly unique email using VU ID, iteration counter, and timestamp
    const uniqueId = `${vu.idInTest}${iterationCounter}${Date.now()}${Math.floor(Math.random() * 10000)}`;
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

    const isSuccess = check(response, {
        'registration status is 200': (r) => r.status === 200,
        'response contains authorization header': (r) => r.status === 200 && r.headers['Authorization'] !== undefined,
        'response body contains user data': (r) => {
            if (r.status !== 200) return false;
            try {
                const body = JSON.parse(r.body);
                return body.firstName === uniqueUser.firstName &&
                       body.lastName === uniqueUser.lastName &&
                       body.email === uniqueUser.email;
            } catch (e) {
                console.error(`Failed to parse response body: ${e.message}`);
                return false;
            }
        },
        'authorization header contains Bearer token': (r) => {
            if (r.status !== 200) return false;
            const authHeader = r.headers['Authorization'];
            return authHeader && authHeader.startsWith('Bearer ');
        }
    });

    if (!isSuccess || response.status !== 200) {
        console.error(`VU${vu.idInTest}: Registration failed for user: ${uniqueUser.email}`);
        console.error(`Response status: ${response.status}`);
        console.error(`Response body: ${response.body}`);
        if (response.error) {
            console.error(`Network error: ${response.error}`);
        }
    }
}
