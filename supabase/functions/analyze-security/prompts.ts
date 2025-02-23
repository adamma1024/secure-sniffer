export const generatePromptsAsSecurityAnalyst = (language: string, scenario: string) => {
  return `[Instruction for the LLM]
  You are an expert software developer and security analyst. Given the following scenario, please generate the required code in ${language} that meets the specified functionality. 
  Additionally, provide an educational analysis discussing:
  1. The potential risks inherent in this scenario (e.g., security, performance, maintainability).
  2. Why the generated code helps mitigate these risks.
  3. Recommendations tailored for different user roles:
    - Newbie: Explain basics and best practices.
    - Engineer: Outline advanced pitfalls and optimizations.
    - Manager: Summarize the risks and benefits in business terms.
    - Designer: Highlight user experience and interface safety considerations.
  4. Analyze the generated code for vulnerabilities by detecting relevant CWE rules. Cite the specific CWE (e.g., CWE-79 for Cross-Site Scripting).


  [Scenario Details]
  Scenario: ${scenario}
  Requirements:
  - Generate codes for this scenario

  [Formatting Guidelines]
  - Present the generated code in a clear, formatted block.
  - Follow the code with a section titled "Educational Analysis" that explains the risks, mitigation strategies, and recommendations for each user profile.
  - Conclude with a section "Vulnerability Detection" where you list each potential CWE rule that applies, along with its classification (error or warning).
  Example Output Format:
  --------------------------------
  Generated Code:
  \`\`\`[language]
  # Your code here`
}
