Please generate a Comprehensive Test Plan for Playwright Test Scripts

## Objective
Create a detailed `plan_testcase-demo.md` document that outlines the implementation strategy for converting the existing test cases into Playwright test scripts. This plan will serve as a roadmap and detailed step-by-step guidances for developers, ensuring consistent implementation that adheres to the project structure and conventions.

## Context Requirements
The plan must:
- Use test cases from #file:testcase-demo.md as implementation targets
- Assume the project is already initialized (skip setup instructions)
- Account for line break characters (`</br>`) in test steps and expected results, treating each as separate actions/verifications
- Exclude API mocking tests
- Organize all test files under a single directory
- Use placeholders for generated locators to increase generation speed.
- Focus exclusively on planning, not implementation code

## Required Sections

### 1. Overview
Provide a concise introduction explaining:
- The purpose of this test plan
- The feature(s) being tested based on the sample test cases
- How this plan connects to the overall test architecture
- Key dependencies and assumptions

### 2. Test Cases Analysis
Include a thorough assessment of the test cases:
- Total number of test cases to implement
- Common patterns across test cases
- Unique challenges presented by specific test cases
- Required test data and preconditions
- Identification of page objects needed

### 3. Implementation Strategy
Detail the approach for:
- File organization within the test directory
- Naming conventions for test files and functions
- Page object organization for identified pages
- Locator organization for identified locators
- Common utilities needed across test cases
- Test data management approach
- Interface definitions for test data
- How to handle preconditions efficiently

### 4. Page Objects Definition
For each page identified in the test cases (e.g., [A. Login], [B. Forgot password]):
1. List all required page objects:
  - Define the name of each page object class.
  - Specify the corresponding locator file (e.g., `login-locators.js`, `dashboard-locators.ts`) used by the page.
2. Outline essential methods each page object should implement:
  - Focus on high-level business flows (e.g., `loginWithValidAccount()`, `resetPassword()`).
  - Avoid duplicating low-level actions like `click`, `fill`, etc.
  - **Prefer reusing common utility methods** from a shared `common-page` to handle generic actions (e.g., clicking, waiting, filling input).
3. Define locators needed for interacting with page elements:
  - **Locators must be defined in separate locator files**, not directly inside the page object class.
  - Each locator file should organize selectors by component or logical grouping.
  - All page-specific locator files must **extend from a shared `common-locator` base**, which includes shared elements and utilities.
  - The base locator class defines an `initializeLocators()` method that is used to set up common selectors and helper methods.
  - Page-specific locators should override or extend these definitions where needed.
  - Page objects should import and use these locator classes consistently.
4. Document expected navigation patterns between pages:
  - Indicate what page should be shown after each method execution (e.g., after `login()`, user should be navigated to `DashboardPage`).
  - Include any expected assertions or URL changes if relevant.
### 5. Test Script Mapping
Create a detailed mapping table:
- Each row represents one test case
- Include columns for:
  * Test case ID
  * Test file name
  * Test function name
  * Page objects required
  * Fixtures needed
  * Special handling requirements (if any)

### 6. Test Data Management
Define strategy for:
- Test data generation (e.g., email addresses)
- Managing test state between runs
- Handling environmental dependencies
- Cleanup procedures

### 7. Verification Approach
Document how to implement assertions for:
1 **Navigation events**  
  - Use `expect.soft` to assert URL or key element presence.
2. **UI state verification**  
  - Use `expect.soft` to check visibility, state (enabled/disabled), and element presence.
3. **Error message validation**  
  - Use `expect.soft` to validate expected error texts.
4. **Email verification (if applicable)**  
  - Use `expect.soft` to assert subject, body, and recipient if emails are checked.
5. **Popup/modal verification**  
  - Use `expect.soft` to verify modal appearance, content, and button behavior.
6. **Soft Assertions Usage**  
  - Prefer `expect.soft` for all verifications to avoid interrupting test execution and ensure complete reporting.

### 8. Special Considerations
Identify any special handling needed:
- Internationalization aspects (Japanese text in buttons/errors)
- Timing/synchronization considerations
- Environment-specific configurations
- Error handling approach

### 9. Quality Assurance
Define processes for:
- Peer review of implemented tests
- Validation criteria for completed scripts
- Documentation requirements
- Maintenance considerations

## Format Requirements
- Use Markdown with clear hierarchical headings
- Include tables for mapping and organization
- Use code block placeholders to illustrate file/function structures
- Bold critical implementation details and patterns
- Include a table of contents with section links

## Special Instructions
- Pay careful attention to the line break characters (`</br>`) in test cases, as each line represents a separate step or verification point
- Note the Japanese text elements that need special handling
- Consider the email verification flow and how to test it without API mocking
- Identify reusable patterns across test cases (e.g., navigation to forgot password page)

The final `plan.md` should provide a comprehensive blueprint that allows any developer to understand exactly how to implement the test scripts consistently and according to project conventions.