export const cleanMarkdown = (content: string): string => {
  return content
    .split("\n")
    .map((line) => line.trimStart())
    .join("\n");
};
