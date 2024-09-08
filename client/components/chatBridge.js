"use server";

export async function chatBridge(prompt, messages) {
  try {
    const response = await fetch(`${process.env.SERVER_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, messages }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.body.errorMessage) {
      return {
        errorMessage: errorMessage,
      };
    }

    return {
      response: result.body.message,
    };
  } catch (error) {
    return {
      errorMessage: JSON.stringify(error),
    };
  }
}
