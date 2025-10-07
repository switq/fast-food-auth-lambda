import { CognitoIdentityProviderClient, AdminInitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

export class CognitoService {
  static async adminLogin(username: string, password: string, userPoolId: string, clientId: string): Promise<any> {
    const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || "us-east-1" });
    const command = new AdminInitiateAuthCommand({
      UserPoolId: userPoolId,
      ClientId: clientId,
      AuthFlow: "ADMIN_NO_SRP_AUTH",
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    });
    try {
      const response = await client.send(command);
      return response;
    } catch (err) {
      return null;
    }
  }
}
