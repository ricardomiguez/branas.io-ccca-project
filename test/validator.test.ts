import { validate } from "../src/validator";

test.each(["407.302.170-27", "684.053.160-00", "746.971.314-01"])(
  "Should validate tax number",
  function (taxNumber) {
    const isValid = validate(taxNumber);
    expect(isValid).toBeTruthy();
  }
);

test.each(["406.302.170-27", "406302170", "406302170123456789"])(
  "Should invalidate tax number",
  function (taxNumber) {
    const isValid = validate(taxNumber);
    expect(isValid).toBeFalsy();
  }
);

test.each(["000.000.000-00", "111.111.111-11", "222.222.222-22"])(
  "Should invalidate repdigit tax number",
  function (taxNumber) {
    const isValid = validate(taxNumber);
    expect(isValid).toBeFalsy();
  }
);
