const express = require("express");
const cors = require("cors");

const app = express();

const db = require("./src/config/db");

app.use(cors());
app.use(express.json());
const authMiddleware = require("./src/middleware/authMiddleware");
const tenantMiddleware = require("./src/middleware/tenantMiddleware");
// =====================================
// ROUTES
// =====================================
const authRoutes = require("./src/routes/authRoutes");
const tenantRoutes = require("./src/routes/tenantRoutes");
const citizenRoutes = require("./src/routes/citizenRoutes");
const assetRoutes = require("./src/routes/assetRoutes");
const assessmentRoutes = require("./src/routes/assessmentRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const taxTypeRoutes = require("./src/routes/taxTypeRoutes");
const parameterRoutes = require("./src/routes/parameterRoutes");
const ruleRoutes = require("./src/routes/ruleRoutes");
const financialYearRoutes = require("./src/routes/financialYearRoutes");
const assessmentLifecycleRoutes = require("./src/routes/assessmentLifecycleRoutes");
// const lifecycleRoutes = require("./src/routes/lifecycleRoutes");
const { applyPenalties } = require("./src/engines/penaltyEngine");
const lifecycleService = require("./src/services/assessmentLifecycleService");

const demandRoutes = require("./src/routes/demandRoutes");

// =====================================
// ROUTE REGISTRATION
// =====================================

app.use("/", authRoutes);
app.use("/", tenantRoutes);
app.use(authMiddleware);
app.use(tenantMiddleware);
app.use("/", citizenRoutes);
app.use("/assets", assetRoutes);
app.use("/", assessmentRoutes);
app.use("/", paymentRoutes);
app.use("/", dashboardRoutes);
app.use("/", taxTypeRoutes);
app.use("/", parameterRoutes);
app.use("/", ruleRoutes);
app.use("/", financialYearRoutes);
app.use("/", assessmentLifecycleRoutes);
app.use("/", demandRoutes);
// app.use("/", lifecycleRoutes);

// cron.schedule("0 0 * * *", async () => {
//   console.log("Running overdue lifecycle engine...");

//   await lifecycleService.markAssessmentOverdue();
// });

// =====================================
// ROOT
// =====================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Enterprise Revenue Platform Running",
  });
});

// =====================================
// SCHEDULER
// =====================================

require("./src/scheduler/yearlyScheduler");

// =====================================
// MIDDLEWARE
// =====================================

const errorMiddleware = require("./src/middleware/errorMiddleware");

app.use(errorMiddleware);

// =====================================
// SERVER
// =====================================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
