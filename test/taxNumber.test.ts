import TaxNumber from "../src/domain/entity/TaxNumber";

test.each(["407.302.170-27", "684.053.160-00", "746.971.314-01"])(
  "Should validate tax number",
  function (value) {
    const input = new TaxNumber(value);
    expect(input.value).toBeDefined();
  }
);

test.each(["406.302.170-27", "406302170", "406302170123456789"])(
  "Should invalidate tax number",
  function (value) {
    expect(() => new TaxNumber(value)).toThrow(new Error("Invalid tax number"));
  }
);

test.each(["000.000.000-00", "111.111.111-11", "222.222.222-22"])(
  "Should invalidate repdigit tax number",
  function (value) {
    expect(() => new TaxNumber(value)).toThrow(new Error("Invalid tax number"));
  }
);
