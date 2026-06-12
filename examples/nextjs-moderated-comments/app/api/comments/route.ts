import { NextResponse } from "next/server";
import { moderateComment } from "@/lib/moderation";
import { addComment, listComments } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ comments: listComments() });
}

export async function POST(request: Request) {
  let body: { name?: unknown; comment?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const comment = typeof body.comment === "string" ? body.comment.trim() : "";
  if (!name || !comment) {
    return NextResponse.json(
      { error: "Both 'name' and 'comment' are required" },
      { status: 400 }
    );
  }
  if (name.length > 50 || comment.length > 1000) {
    return NextResponse.json({ error: "Input too long" }, { status: 400 });
  }

  // Moderate the display name too - hard reject anything profane there
  const nameVerdict = moderateComment(name);
  if (nameVerdict.status !== "accepted") {
    return NextResponse.json(
      {
        status: "rejected",
        severity: nameVerdict.severity,
        message: "Please choose a different display name.",
      },
      { status: 422 }
    );
  }

  const verdict = moderateComment(comment);
  if (verdict.status === "rejected") {
    return NextResponse.json(
      {
        status: verdict.status,
        severity: verdict.severity,
        detectedCount: verdict.detectedWords.length,
        message: verdict.message,
      },
      { status: 422 }
    );
  }

  const saved = addComment(name, verdict.text, verdict.status === "cleaned");
  return NextResponse.json({
    status: verdict.status,
    severity: verdict.severity,
    detectedCount: verdict.detectedWords.length,
    message: verdict.message,
    comment: saved,
  });
}
