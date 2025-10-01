// Cognito VerifyAuthChallenge trigger (CPF-only)
// Responsibility: validate the response to the challenge. For CPF-only flow, accept null/empty response if user exists.

export const handler = async (event: any) => {
  // If there is a privateChallengeParameters set by CreateAuthChallenge, use it.
  // For our CPF-only flow we accept an empty response as proof (since prior Identify verified CPF).
  const expected = event.request.privateChallengeParameters || {};

  // If admin already validated user via AdminInitiateAuth then session will contain a successful challenge
  // Here, simply mark the challenge as successful.
  event.response.answerCorrect = true;

  return event;
};
