// Cognito CreateAuthChallenge trigger (CPF-only)
// Responsibility: prepare the challenge (in CPF-only flow we can skip OTP and mark challenge as ready)

export const handler = async (event: any) => {
  // For CPF_ONLY flow we don't need to send an OTP. We set public challenge parameters
  // and private challenge parameters used later by VerifyAuthChallenge.
  if (event.request.challengeMetadata === 'CPF_ONLY') {
    // Optionally attach any data here
    event.response.publicChallengeParameters = { info: 'cpf-only' };
    event.response.privateChallengeParameters = { }
    event.response.challengeMetadata = 'CPF_ONLY';
  }

  return event;
};
