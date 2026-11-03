import sanitizeHtml from "sanitize-html"

/**
 * Product descriptions come from supplier feeds and sometimes carry raw
 * HTML (occasionally with clipboard-paste cruft like stray `<meta>` tags
 * or editor `class` attributes). Renders that formatting properly while
 * stripping anything outside this allowlist, since the source isn't fully
 * trusted.
 */
export function sanitizeDescription(description?: string | null): string {
  if (!description) return ""

  return sanitizeHtml(description, {
    allowedTags: [
      "p",
      "br",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "strong",
      "b",
      "em",
      "i",
      "span",
      "div",
    ],
    allowedAttributes: {},
  })
}
