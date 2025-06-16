import profanity from "allprofanity";

/**
 * Express middleware that auto-cleans profane words in req.body.content using a custom placeholder.
 * Passes the cleaned content to the next handler.
 * @param {string} placeholder - The placeholder string to use (default: '[CENSORED]')
 */
export function cleanWithCustomPlaceholder(placeholder = "[CENSORED]") {
  return (req, res, next) => {
    const { content } = req.body || {};
    if (typeof content !== "string") {
      return next();
    }

    const result = profanity.detect(content);

    if (result.hasProfanity) {
      req.body.content = profanity.cleanWithPlaceholder(content, placeholder);
      req.profanity = {
        detected: true,
        severity: result.severity,
        words: result.detectedWords,
        cleaned: req.body.content,
      };
    } else {
      req.profanity = { detected: false };
    }

    next();
  };
}
