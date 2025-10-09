
export interface ParsedSummary {
  "SKILLS SUMMARY"?: string;
  "KEY SKILLS"?: string;
  "EXPERIENCE"?: string;
  "EDUCATION"?: string;
  "ADDITIONAL QUALIFICATIONS"?: string;
}

export function parseSkillSummary(summary: string | null | undefined): ParsedSummary {
  if (!summary || typeof summary !== 'string') {
    return {};
  }

  const sections: ParsedSummary = {};
  const sectionRegex = /([A-Z\s]+)={3,}\s*([\s\S]*?)(?=[A-Z\s]+={3,}|\s*$)/g;
  let match;

  while ((match = sectionRegex.exec(summary)) !== null) {
    const sectionName = match[1].trim();
    const sectionContent = match[2].trim();
    sections[sectionName as keyof ParsedSummary] = sectionContent;
  }

  return sections;
}