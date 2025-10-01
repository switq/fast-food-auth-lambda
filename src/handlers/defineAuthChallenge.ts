// Cognito DefineAuthChallenge trigger (CPF-only custom auth)
// Responsibility: decide whether to issue tokens, fail auth, or present a custom challenge.

export const handler = async (event: any) => {
  // If previous challenge succeeded, issue tokens
  const session = event.request.session || [];

  if (session.length > 0) {
    const last = session[session.length - 1];
    if (last.challengeName === 'CUSTOM_CHALLENGE' && last.challengeResult === true) {
      event.response.issueTokens = true;
      event.response.failAuthentication = false;
      return event;
    }
  }

  // Otherwise, require custom challenge
  event.response.challengeName = 'CUSTOM_CHALLENGE';
  event.response.issueTokens = false;
  event.response.failAuthentication = false;

  // challengeMetadata can be used by CreateAuthChallenge to change behavior
  event.response.challengeMetadata = 'CPF_ONLY';

  return event;
};
