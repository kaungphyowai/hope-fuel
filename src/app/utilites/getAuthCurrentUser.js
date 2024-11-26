import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";

export default async function getAuthCurrentUser() {
  try {
    const { userId } = await getCurrentUser();

    const session = await fetchAuthSession();

    console.log("id token", session.tokens.idToken);
    console.log("access token", session.tokens.accessToken);
    // Check if the user is authenticated
    // const currentUser = await Auth.currentAuthenticatedUser();
    // console.log("Authenticated user:", currentUser);

    // const userAttributes = await Auth.userAttributes(currentUser);
    // const email_verified = userAttributes.find(
    //   (attr) => attr.Name === "email_verified"
    // ).Value;

    // const session = await Auth.currentSession();
    // const accessToken = session.tokens.accessToken;
    const email = session.tokens.idToken.payload.email;
    // const userRole = accessTokenPayload["cognito:groups"];

    return { userId, email };
  } catch (err) {
    if (err === "not authenticated") {
      console.error("User is not authenticated");
    } else {
      console.error("Error fetching authentication details:", err);
    }
  }
}
