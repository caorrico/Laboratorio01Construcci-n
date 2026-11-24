const { test } = require("node:test");
const assert = require("node:assert/strict");
const base = process.env.TEST_API_URL || "http://localhost:3000/persona";
async function request(method, path = "", body) {
  const response = await fetch(base + path, {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { status: response.status, data: await response.json() };
}
test("CRUD Persona del Laboratorio 01 con PostgreSQL", async () => {
  const dto = {
    nombres: "Ana",
    apellidos: "Perez",
    identificacion: `LAB-${Date.now()}`,
    correo: "ana.prueba@example.com",
    telefono: "0991234567",
  };
  const created = await request("POST", "", dto);
  assert.equal(created.status, 201);
  const id = created.data.id_persona;
  try {
    assert.match(id, /^[a-f0-9-]{36}$/);
    assert.equal(created.data.estado, true);
    const list = await request("GET");
    assert.equal(list.status, 200);
    assert.ok(list.data.some((p) => p.id_persona === id));
    const found = await request("GET", "/" + id);
    assert.equal(found.status, 200);
    assert.equal(found.data.correo, dto.correo);
    const updated = await request("PATCH", "/" + id, {
      telefono: "0987654321",
    });
    assert.equal(updated.status, 200);
    assert.equal((await request("GET", "/" + id)).data.telefono, "0987654321");
    assert.equal((await request("POST", "", dto)).status, 409);
    assert.equal(
      (await request("POST", "", { ...dto, correo: "correo-invalido" })).status,
      400,
    );
    assert.equal((await request("GET", "/uuid-invalido")).status, 400);
  } finally {
    assert.equal((await request("DELETE", "/" + id)).status, 200);
  }
  assert.equal((await request("GET", "/" + id)).status, 404);
});
