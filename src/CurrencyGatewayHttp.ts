import axios from "axios";

export default class CurrencyGatewayHttp {
  async getCurrencies() {
    const response = await axios.get("http://localhost:3001/currencies");
    return response.data;
  }
}
