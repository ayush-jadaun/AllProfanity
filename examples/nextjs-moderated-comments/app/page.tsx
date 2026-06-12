import CommentSection from "./comment-section";

export default function Home() {
  return (
    <main>
      <h1>Community Comments</h1>
      <p className="subtitle">
        Every submission is moderated server-side by{" "}
        <code>allprofanity</code> — try <code>f*ck</code>,{" "}
        <code>f u c k</code>, <code>fuuuuck</code>, <code>sh1t</code> or{" "}
        <code>ｆｕｃｋ</code>. Mild profanity is censored, severe profanity is
        rejected, and "Scunthorpe", "bass" or "classic" always pass.
      </p>
      <CommentSection />
    </main>
  );
}
