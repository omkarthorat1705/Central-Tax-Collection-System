const db = require("../config/db");

const { createAuditLog } = require("./auditService");

const closeFinancialYear = async () => {
  try {
    db.get(
      `
        SELECT *
        FROM financial_years
        WHERE is_current = 1
        LIMIT 1
        `,
      [],
      async (err, currentFY) => {
        if (err || !currentFY) {
          console.log("Current FY not found");
          return;
        }

        db.run(
          `
            UPDATE financial_years

            SET

              status = 'CLOSED',

              is_current = 0

            WHERE id = ?
            `,
          [currentFY.id],
        );

        const parts = currentFY.financial_year.split("-");

        const startYear = Number(parts[0]) + 1;

        const endYear = Number(parts[1]) + 1;

        const nextFY = `${startYear}-${endYear}`;

        db.run(
          `
            INSERT INTO financial_years (

              tenant_id,

              financial_year,

              start_date,

              end_date,

              status,

              is_current

            )

            VALUES (?, ?, ?, ?, ?, ?)
            `,
          [1, nextFY, `${startYear}-04-01`, `${endYear}-03-31`, "OPEN", 1],
        );

        await createAuditLog(
          "FINANCIAL_YEAR",

          "FINANCIAL_YEAR",

          currentFY.id,

          "FY_CLOSED",

          {
            financial_year: currentFY.financial_year,
          },
        );

        console.log(`Financial Year Closed: ${currentFY.financial_year}`);

        console.log(`New Financial Year Opened: ${nextFY}`);
      },
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  closeFinancialYear,
};
