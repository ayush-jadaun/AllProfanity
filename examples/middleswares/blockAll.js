import profanity from 'allprofanity';

/**
 * Express middleware that blocks and responds with an error if profanity is detected.
 * Checks req.body.content by default.
 */
export function blockAllProfanity(req, res, next) {
  const { content } = req.body || {};
  if (typeof content !== "string") {
    // Optionally, skip or block if field missing
    return next();
  }

  const result = profanity.detect(content);

  if (result.hasProfanity) {
    return res.status(400).json({
      error: 'Profanity detected in content.',
      severity: result.severity,
      detectedWords: result.detectedWords,
      cleanedContent: result.cleanedText,
      positions: result.positions,
    });
  }

  next();
}