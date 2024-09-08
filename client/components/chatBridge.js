"use server";

export async function chatBridge(prompt, messages) {
  try {
    const response = await fetch(`${process.env.SERVER_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, messages: messages }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.body.errorMessage) {
      console.log(`here ${result.body.errorMessage}`);
      return {
        errorMessage: result.body.errorMessage,
      };
    }

    return {
      response: result.body.message,
    };
  } catch (error) {
    console.log(`here2 ${error}`);
    return {
      errorMessage: JSON.stringify(error),
    };
  }
}
