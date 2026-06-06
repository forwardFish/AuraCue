import assert from "node:assert/strict";
import { createServer } from "../src/server.mjs";

const server = createServer();
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const response = await fetch(`http://127.0.0.1:${port}/api/health`);
const body = await response.json();
server.close();

assert.equal(response.status, 200);
assert.equal(body.status, "ready");
assert.equal(body.mode, "local-mock");
assert.equal(body.services.payment, "mock-only");

console.log(JSON.stringify({ status: "PASS", health: body }, null, 2));
