import Checkout from "./application/usecase/Checkout";

const input: Input = { taxNumber: "", items: [] };
process.stdin.on("data", async function (chunk) {
  const command = chunk.toString().replace(/\n/g, "");
  if (command.startsWith("set-tax-number")) {
    input.taxNumber = command.replace("set-tax-number ", "");
  }
  if (command.startsWith("add-item")) {
    const [idProduct, quantity] = command.replace("add-item ", "").split(" ");
    input.items.push({
      idProduct: parseInt(idProduct),
      quantity: parseInt(quantity),
    });
  }
  if (command.startsWith("checkout")) {
    try {
      const checkout = new Checkout();
      const output = await checkout.execute(input);
      console.log(output);
    } catch (e: any) {
      console.error(e.message);
    }
  }
});

type Input = {
  taxNumber: string;
  items: { idProduct: number; quantity: number }[];
  coupon?: string;
  from?: string;
  to?: string;
};
