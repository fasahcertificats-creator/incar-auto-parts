/**
 * Renders a Schema.org structured-data block. `<` is escaped so a string
 * field can never prematurely close the surrounding <script> tag — the
 * standard safe pattern for embedding JSON-LD from React/Next.js.
 */
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
