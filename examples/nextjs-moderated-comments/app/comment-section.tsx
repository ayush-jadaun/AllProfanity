"use client";

import { FormEvent, useEffect, useState } from "react";

interface Comment {
  id: number;
  name: string;
  text: string;
  wasCleaned: boolean;
  createdAt: string;
}

interface Feedback {
  status: "accepted" | "cleaned" | "rejected";
  message: string;
  severity?: string;
  detectedCount?: number;
}

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function refresh() {
    const response = await fetch("/api/comments");
    const data = await response.json();
    setComments(data.comments);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, comment }),
      });
      const data = await response.json();
      if (!response.ok && !data.status) {
        setFeedback({ status: "rejected", message: data.error ?? "Failed" });
        return;
      }
      setFeedback(data);
      if (data.status !== "rejected") {
        setComment("");
        await refresh();
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <label>
          Display name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={50}
            required
            placeholder="Your name"
          />
        </label>
        <label>
          Comment
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={1000}
            rows={4}
            required
            placeholder="Say something nice (or try to sneak something past the filter)"
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? "Moderating…" : "Post comment"}
        </button>
        {feedback && (
          <div className={`banner ${feedback.status}`}>
            {feedback.message}
            {feedback.severity && feedback.severity !== "NONE" && (
              <> Severity: {feedback.severity}.</>
            )}
            {feedback.detectedCount ? (
              <> Detected words: {feedback.detectedCount}.</>
            ) : null}
          </div>
        )}
      </form>

      <section className="comments">
        {comments.map((entry) => (
          <article key={entry.id} className="comment">
            <div className="comment-meta">
              <span className="comment-name">{entry.name}</span>
              <span className="comment-time">
                {new Date(entry.createdAt).toLocaleString()}
              </span>
              {entry.wasCleaned && <span className="tag">censored</span>}
            </div>
            <p className="comment-text">{entry.text}</p>
          </article>
        ))}
      </section>
    </>
  );
}
