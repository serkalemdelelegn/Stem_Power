import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, targetLanguage } = await req.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: "Text and target language are required" },
        { status: 400 }
      );
    }

    // Get API key from environment variable
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

    if (!apiKey || apiKey === "your_api_key_here") {
      console.error("GOOGLE_TRANSLATE_API_KEY is not configured in environment variables");
      return NextResponse.json(
        { 
          error: "Google Translate API key not configured",
          message: "Please set GOOGLE_TRANSLATE_API_KEY in your .env.local file. Get your API key from: https://console.cloud.google.com/apis/credentials",
          details: "The translation service requires a valid Google Cloud Translation API key to function."
        },
        { status: 503 } // Service Unavailable - better status for missing configuration
      );
    }

    // Google Translation API v2 endpoint
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    let response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          format: "text",
        }),
      });
    } catch (fetchError: any) {
      // Handle network errors
      console.error("Network error calling Google Translate API:", fetchError);
      return NextResponse.json(
        {
          error: "Network error",
          message: `Failed to connect to Google Translate API: ${fetchError.message}`,
          details: "Please check your internet connection and try again."
        },
        { status: 503 }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      
      console.error("Google Translate API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      return NextResponse.json(
        { 
          error: "Translation failed", 
          details: errorData,
          message: `Google Translate API returned ${response.status}: ${response.statusText}`
        },
        { status: response.status >= 500 ? 500 : response.status }
      );
    }

    const data = await response.json();
    const translatedText = data.data?.translations?.[0]?.translatedText || text;

    return NextResponse.json({ translatedText });
  } catch (error: any) {
    console.error("Translation error:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Provide more specific error messages
    let errorMessage = "Failed to translate";
    if (error instanceof SyntaxError) {
      errorMessage = "Failed to parse request or response JSON";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        message: "An unexpected error occurred during translation"
      },
      { status: 500 }
    );
  }
}
