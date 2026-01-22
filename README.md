This is a Next.js project for containing blog and todo list.

## Features
[] Todo List
    [v] Add new task
    [v] Mark task as completed
    [v] Delete Tasks
    [] Persist tasks items using localStorage (Optional / Bonus)
    [v] Filter by all / completed / pending (Optional / Bonus)
[] Blog
    [] Fetch post from `https://jsonplaceholder.typicode.com/posts`
    [] Search post
    [] Display post detail, and show comment in `https://jsonplaceholder.typicode.com/comments?postId=[ID]`

## Technical Specifications
- Node v22
- npm v10.9
- NextJS v16.1
- Tailwind v4.0
- shadcn v3.7 

## How to Run
1. Clone this project from GitHub
2. Using terminal (either from Linux/Mac terminal or using terminal from VSCode), go to the project directory
3. Run `npm install` to install the dependencies
4. Run `npm run dev` to run the development server. The server would ran in port 3000 (`localhost:3000`) and should be accessible in your browser. 

## LLM Usage Disclaimer

Some of the code in this project was created with the assistance of Cursor as my coding assistant, using the Claude Sonnet 4.5 model. My workflow for this project is as follows:

1. Conduct research on the system architecture and industry best practices.
2. Define detailed technical specifications and translate them into prompts.
3. Review the generated results. The criteria I use to evaluate whether the code meets my standards include:
   - Specification compliance: whether the generated code behaves as intended, including proper handling of edge cases.
   - Code standards: whether the code follows established conventions (e.g., naming conventions, indentation, formatting).
   - Style: whether the code adheres to the intended design and architectural guidelines.

I am willing to share the prompts I used upon request, and I am also prepared to demonstrate my ability to write the same code without the use of an AI-powered coding assistant.

My reasoning for using an LLM in this project is that I believe AI (LLMs, in this context) can significantly accelerate development. However, using such tools without careful oversight can be harmful to a codebase—ranging from introducing non-standardized code into an already large system to creating security vulnerabilities or instability when the engineer lacks a solid understanding of the underlying technology stack.

I believe that an engineer's role, especially in the AI era, is to provide strong guardrails for LLM-generated code to ensure it meets quality and security standards, while still enabling fast and reliable delivery.
