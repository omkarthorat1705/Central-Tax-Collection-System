const cron = require("node-cron");

const { generateArrears } = require("../engines/arrearsEngine");

// =====================================
// YEARLY ARREARS ENGINE
// EVERY YEAR APRIL 1st
// =====================================

cron.schedule("0 0 1 4 *", async () => {
  console.log("Running yearly arrears process...");

  await generateArrears();
});
