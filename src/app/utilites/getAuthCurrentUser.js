import {
  getCurrentUser,
  fetchUserAttributes,
  fetchAuthSession,
} from 'aws-amplify/auth';

export default async function getAuthCurrentUser() {
  try {
    const { email_verified } = await fetchUserAttributes();

    const session = await fetchAuthSession();
    const userRole = session.tokens.accessToken.payload['cognito:groups'];
    const email = session.tokens.idToken.payload.email;
    const userId = session.tokens.idToken.payload.sub;

    // console.log("The email:", email);
    // console.log("The userRole:", userRole[0]);
    // console.log("The session:", JSON.stringify(session, null, 2));
    // console.log("The details:", JSON.stringify(email_verified, null, 2));
    //console.log(`The userId: ${userId}`);
    // console.log("The signInDetails:", JSON.stringify(signInDetails, null, 2)); // Pretty-print the JSON object
    return { userId, email, email_verified, userRole };
  } catch (err) {
    console.log(err);
  }
}
