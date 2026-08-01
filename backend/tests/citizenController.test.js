const test = require("node:test");
const assert = require("node:assert/strict");

const citizenController = require("../src/controllers/citizenController");
const citizenService = require("../src/services/citizenService");

test("addCitizen validates required fields before calling the service", async () => {
  const originalAddCitizen = citizenService.addCitizen;
  let serviceCalled = false;

  citizenService.addCitizen = async () => {
    serviceCalled = true;
    return { id: 1 };
  };

  const req = {
    body: {
      mobile_number: "9876543210",
    },
    tenant: {
      tenant_id: 1,
    },
  };

  const res = {};
  let error;

  await new Promise((resolve) => {
    citizenController.addCitizen(req, res, (err) => {
      error = err;
      resolve();
    });
  });

  assert.equal(serviceCalled, false);
  assert.ok(error instanceof Error);
  assert.match(error.message, /Citizen name is required/);

  citizenService.addCitizen = originalAddCitizen;
});
