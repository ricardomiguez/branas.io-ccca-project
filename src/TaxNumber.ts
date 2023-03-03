export default class TaxNumber {
  readonly value: string;

  constructor(taxNumber: string) {
    if (!this.validate(taxNumber)) throw new Error("Invalid tax number");
    this.value = taxNumber;
  }

  calculateCheckDigit(taxNumber: string, factor: number) {
    let total = 0;
    for (const digite of taxNumber) {
      if (factor > 1) total += parseInt(digite) * factor--;
    }
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
  }

  removePunctuation(taxNumber: string) {
    return taxNumber.replace(/\D/g, "");
  }

  isLenghtValid(taxNumber: string) {
    return taxNumber.length !== 11;
  }

  isRepdigit(taxNumber: string) {
    return taxNumber.split("").every((c) => c === taxNumber[0]);
  }

  extractCheckDigits(taxNumber: string) {
    return taxNumber.substring(taxNumber.length - 2, taxNumber.length);
  }

  validate(taxNumber: string) {
    if (!taxNumber) return false;
    const formattedTaxNumber = this.removePunctuation(taxNumber);
    if (this.isLenghtValid(formattedTaxNumber)) return false;
    if (this.isRepdigit(formattedTaxNumber)) return false;
    const firstDigit = this.calculateCheckDigit(formattedTaxNumber, 10);
    const secondDigit = this.calculateCheckDigit(formattedTaxNumber, 11);
    const actualCheckDigits = this.extractCheckDigits(formattedTaxNumber);
    const calculatedCheckDigits = `${firstDigit}${secondDigit}`;
    return actualCheckDigits == calculatedCheckDigits;
  }
}
