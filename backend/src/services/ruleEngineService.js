const processRule = (rule, parameters) => {
  let area = 0;

  parameters.forEach((item) => {
    if (item.parameter_code === "AREA") {
      area = Number(item.parameter_value || 0);
    }
  });

  const calculatedAmount =
    Number(rule.calculation_value || 0) * Number(area || 1);

  return calculatedAmount;
};

module.exports = {
  processRule,
};
