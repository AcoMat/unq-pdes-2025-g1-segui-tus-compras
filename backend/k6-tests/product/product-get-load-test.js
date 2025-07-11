import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from '../config.js';

export const options = {
    vus: 30,
};

export default function () {
    const res = http.get(`${BASE_URL}/products/MLA16211422`);
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
    });
}