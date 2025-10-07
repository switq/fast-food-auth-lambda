import fetch from "node-fetch";

export class CustomerService {
  static async findByCPF(cpf: string, apiUrl: string): Promise<any> {
    const url = `${apiUrl}/api/customers/identify/${cpf}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  }
}
