import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

/**
 * This endpoint handles Prismic webhooks and triggers a Netlify build.
 * It's called when content is published, updated, or deleted in Prismic.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify the secret if provided
    const webhookSecret = process.env.PRISMIC_WEBHOOK_SECRET;
    if (webhookSecret) {
      const providedSecret = request.headers.get("prismic-webhook-secret");
      if (providedSecret !== webhookSecret) {
        return NextResponse.json(
          { error: "Invalid webhook secret" },
          { status: 401 }
        );
      }
    }

    // Get the webhook body
    const body = await request.json();
    
    console.log("Received Prismic webhook:", {
      type: body.type,
      domain: body.domain,
      apiUrl: body.apiUrl,
      releases: body.releases,
      documents: body.documents?.map((doc: any) => ({
        id: doc.id,
        type: doc.type,
        uid: doc.uid,
        lang: doc.lang
      }))
    });

    // Revalidate Next.js cache
    revalidateTag("prismic");

    // Trigger Netlify build hook if available
    const netlifyBuildHook = process.env.NETLIFY_BUILD_HOOK_URL;
    
    if (netlifyBuildHook) {
      const netlifyResponse = await fetch(netlifyBuildHook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trigger_title: "Prismic Content Update",
          trigger_branch: "main", // o il branch che usi per il deploy
        }),
      });

      if (!netlifyResponse.ok) {
        console.error("Failed to trigger Netlify build:", netlifyResponse.statusText);
        return NextResponse.json(
          { 
            error: "Failed to trigger build",
            revalidated: true,
            netlifyTriggered: false
          },
          { status: 500 }
        );
      }

      console.log("Successfully triggered Netlify build");
      
      return NextResponse.json({
        success: true,
        revalidated: true,
        netlifyTriggered: true,
        timestamp: new Date().toISOString(),
      });
    }

    // If no Netlify hook is configured, just return success for cache revalidation
    return NextResponse.json({
      success: true,
      revalidated: true,
      netlifyTriggered: false,
      message: "Cache revalidated. Configure NETLIFY_BUILD_HOOK_URL for automatic deploys.",
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for webhook verification
export async function GET() {
  return NextResponse.json({
    message: "Prismic to Netlify webhook endpoint is active",
    timestamp: new Date().toISOString(),
  });
}