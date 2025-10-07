import { CognitoService } from "../services/cognitoService";
import { JwtService } from "../services/jwtService";

export const adminLoginHandler = async (event: any): Promise<any> => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { username, password } = body;
    const userPoolId = process.env.COGNITO_USER_POOL_ID;
    const clientId = process.env.COGNITO_CLIENT_ID;
    if (!userPoolId || !clientId) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Cognito config missing" })
      };
    }
    // Autentica no Cognito
    const cognitoRes = await CognitoService.adminLogin(username, password, userPoolId, clientId);
    if (!cognitoRes || !cognitoRes.AuthenticationResult) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Credenciais inválidas" })
      };
    }
    // Gera JWT local para API (pode usar o token do Cognito se preferir)
    const payload = {
      id: cognitoRes.AuthenticationResult.AccessToken,
      username,
      role: "admin"
    };
    const secret = process.env.JWT_ADMIN_SECRET || "admin_secret";
    const token = new JwtService(secret).sign(payload);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, admin: { username } })
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "internal error", detail: err?.message || "unknown error" })
    };
  }
};
