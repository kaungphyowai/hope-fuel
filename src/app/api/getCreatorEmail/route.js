import {
  AdminGetUserCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

export async function POST(req) {
  try {
    const body = await req.json(); 
    const { AwsId } = body;

    if (!AwsId) {
      return new Response(JSON.stringify({ message: "Missing AwsId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Configure the Cognito Identity Provider Client
    const client = new CognitoIdentityProviderClient({
      region: "us-east-1",
      
    });

    // Create the command to fetch user details
    const command = new AdminGetUserCommand({
      UserPoolId: "us-east-1_se1yJeLv6", // Replace with your User Pool ID
      Username: AwsId,
    });

    // Send the command and fetch the response
    const response = await client.send(command);

    // Extract the email from the response
    const email = response.UserAttributes.find(
      (attr) => attr.Name === "email"
    )?.Value;

    return new Response(JSON.stringify({ email }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching email:", error);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
