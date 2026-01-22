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
Some of the codes on this project is created with the help of Cursor as my coding assistant, using model Claude Sonnet 4.5. My flow of works for this project are :
1. Do a research about the architecture and the best practice of the industry
2. Determining the technical and detailed specification, and arranging the specs onto the prompts
3. Reviewing the result. The consideration I use to judge if the code are up to standard are :
    - Specification, if the resulted code are behave like I asked, with considering edge cases.
    - Code standard, if the resulted code are following the standardization (e.g. naming convention, tab/space convention, etc)
    - Style, if the resulted code are following the design rule.

I am ready to release my prompt that I used whenever asked, and I am also ready to prove my blind skill without AI-powered coding assistant.

My reasoning on using LLM for the completion of this work is that I hereby believe that AI (LLM in this context) is really helpful to deliver faster, but since doing it without any thoughtful manner could be damaging to our codebase, ranging from non-standardized code for already large codebase, to introducing security vulnerability and instability if the engineer doesn't know the fundamentals of the tech stacks that I use. I believe that the engineer job, especially in the AI era, is to provide a tight guardrail for the LLM-generated code to keep them up to standard, while still delivering fast and stable code.