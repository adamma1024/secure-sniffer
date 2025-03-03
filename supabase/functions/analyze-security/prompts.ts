export const generatePromptsAsSecurityAnalyst = (language: string, scenario: string) => {
  return `[Instruction for the LLM]
  You are an expert software developer and security analyst. Given the following scenario, please generate the required code in ${language} that meets the specified functionality. 
  Additionally, provide an educational analysis discussing:
  1. The potential risks inherent in this scenario (e.g., security, performance, maintainability).
  2. Why the generated code helps mitigate these risks. Specify which lines.
  3. Analyze the generated code for vulnerabilities by detecting relevant CWE rules. Cite the specific CWE (e.g., CWE-79 for Cross-Site Scripting).


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

export const getNewPrompts = (language: string, scenario: string) => {
  return `[Instruction for the LLM]
You are an **expert full-stack software developer, security analyst, and DevSecOps specialist**. You are tasked with **generating a complete project** based on the scenario below. The generated project must satisfy both functional and security requirements, and should be **fully deployable locally**. Your process should be iterative, refining the code until it achieves both high quality and strong security posture.

[Project Scope]
You must generate:
- Full backend (including APIs, services, database models, and security layers).
- Full frontend (including UI components, user flows, and error handling).
- Database schema and management scripts.
- CI/CD pipeline template if applicable.

[Scenario Details]
Scenario: ${scenario}
Requirements:
- Use ${language} for backend and React & Vite for frontend.
- The project should use postgre as the database.
- The project must be structured according to best practices for ${language} projects.
- List pages that user needs and generate codes for each pages. Note that you should generate all files in the list, do not miss anyone.

[Security & Vulnerability Analysis]
- After generating the code, **evaluate the entire project for vulnerabilities** based on relevant CWE rules.
- Generate a **Vulnerability Matrix** listing each file, its purpose, and any vulnerabilities detected (with CWE references).
- If vulnerabilities are found, **refactor the code** to fix them and explain the changes made.
- Repeat this until no critical vulnerabilities remain.

[Code Quality Process]
- After addressing vulnerabilities, **refine the code based on feedback from the LLM itself**.
- Optimize for performance, readability, scalability, and maintainability.
- Add **detailed comments** explaining important logic and security measures taken.

[Educational Analysis]
- For each file, provide:
    - Its purpose and main responsibilities.
    - Key risks addressed (both functional and security).
    - Explanation of security best practices applied (e.g., input validation, secure hashing).
- Cite all applied CWE rules and how they are mitigated.

[Testing]
- Auto-generate **unit tests, integration tests, and security tests** for both backend and frontend.
- Testing should cover:
    - Core functionality
    - Error handling
    - Security edge cases (e.g., injection attacks, authentication bypass attempts)

[Output Formatting]
- All files should be listed in a **project tree structure** first.
- Each file's content should follow in clear, formatted code blocks.
- Follow each file with its individual **Educational Analysis** and **Vulnerability Detection Summary**.
- Provide a final consolidated **Vulnerability Matrix** at the end, rating each file's security (e.g., Low, Medium, High risk).

[Final Deliverables]
- Complete project files, ready for local deployment.
- Deployment instructions (including prerequisites, installation steps, and commands to start the project).
- Analysis Report (risks, mitigations, vulnerability matrix).

Example Output:
------------------------------
Project Structure:
/project-root |-- backend/ | |-- app.js | |-- routes/ | |-- controllers/ | |-- services/ | |-- models/ |-- frontend/ | |-- src/ | |-- components/ | |-- App.js |-- database/ | |-- schema.sql |-- tests/ | |-- backend/ | |-- frontend/ |-- README.md


Generated Code:
\`\`\`${language}
// Example file content
\`\`\`

Educational Analysis:
- Purpose: ...
- Key Risks Addressed: ...
- Security Best Practices Applied: ...
- CWE Analysis: ...

Vulnerability Matrix:
| File                 | Purpose                 | Detected Vulnerabilities | Risk Level |
|------------------|------------------|------------------|------------------|
| app.js             | Main backend entry | None | Low |
| ...                    | ...                              | ... | ... |

Deployment Instructions:
1. Clone the repo...
2. Run \`npm install\`...
3. ...


`
}
