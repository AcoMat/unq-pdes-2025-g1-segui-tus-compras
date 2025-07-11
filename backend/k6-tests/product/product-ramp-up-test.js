import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from '../config.js';

export let options = {
    stages: [
        { duration: '10s', target: 10 },
        { duration: '30s', target: 30 },
        { duration: '10s', target: 0 },
    ],
};

export default function () {
    const res = http.get(`${BASE_URL}/products/MLA16211422`);

    const statusCheck = check(res, {
        'status is 200': (r) => {
            const isOk = r.status === 200;
            if (!isOk) {
                console.error(`Status check failed: Expected 200, got ${r.status}. Response body: ${r.body}`);
            }
            return isOk;
        },
    });

    const responseTimeCheck = check(res, {
        'response time < 500ms': (r) => {
            const isOk = r.timings.duration < 500;
            if (!isOk) {
                console.error(`Response time check failed: ${r.timings.duration}ms (expected < 500ms)`);
            }
            return isOk;
        },
    });
}
