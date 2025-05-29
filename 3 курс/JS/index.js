const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const n = parseInt(input[0]);
const A = input[1].split(' ').map(Number);

const subarrays = new Set();
const positions = Array(11).fill().map(() => []);
for (let i = 0; i < n; i++) {
    positions[A[i]].push(i);
}

for (let j = 1; j < n - 1; j++) {
    const b = A[j];
    for (let a = 1; a <= 10; a++) {
        const c = 2 * b - a;
        if (c >= 1 && c <= 10 && positions[a].length > 0 && positions[c].length > 0) {
            const left = positions[a][positions[a].findIndex(x => x < j) || -1];
            const right = positions[c][positions[c].findLastIndex(x => x > j) || n];
            if (left >= 0 && right < n) {
                subarrays.add(`${left},${right}`);
            }
        }
    }
}

console.log(subarrays.size);