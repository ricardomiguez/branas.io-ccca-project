function calculateCheckDigit(taxNumber: string, factor: number) {
  let total = 0;
  for (const digite of taxNumber) {
    if (factor > 1) total += parseInt(digite) * factor--;
  }
  const rest = total % 11;
  return rest < 2 ? 0 : 11 - rest;
}

function removePunctuation(taxNumber: string) {
  return taxNumber.replace(/\D/g, "");
}

function isLenghtValid(taxNumber: string) {
  return taxNumber.length !== 11;
}

function isRepdigit(taxNumber: string) {
  return taxNumber.split("").every((c) => c === taxNumber[0]);
}

function extractCheckDigits(taxNumber: string) {
  return taxNumber.substring(taxNumber.length - 2, taxNumber.length);
}

export function validate(taxNumber: string) {
  if (!taxNumber) return false;
  const formattedTaxNumber = removePunctuation(taxNumber);
  if (isLenghtValid(formattedTaxNumber)) return false;
  if (isRepdigit(formattedTaxNumber)) return false;
  const firstDigit = calculateCheckDigit(formattedTaxNumber, 10);
  const secondDigit = calculateCheckDigit(formattedTaxNumber, 11);
  const actualCheckDigits = extractCheckDigits(formattedTaxNumber);
  const calculatedCheckDigits = `${firstDigit}${secondDigit}`;
  return actualCheckDigits == calculatedCheckDigits;
}
