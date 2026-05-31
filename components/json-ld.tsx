/**
 * Embeds a JSON-LD structured-data block. Server-safe — render it anywhere in a
 * page (including inside Client Component pages) and it ships in the SSR HTML.
 */
export const JsonLd: React.FC<{ data: object }> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      // Structured data is build-time/server constant; no user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};
