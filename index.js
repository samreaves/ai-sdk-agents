// import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();


// const model = anthropic('claude-3-5-haiku-latest'); // Specify the model you want

const model = openai('gpt-4o-mini') // Specify the model you want

/* An array of JIRA tickets */
const tickets = [
    { id: "JIRA-1", title: "Configure Batches", status: "in progress" },
    { id: "JIRA-2", title: "Configure Payments", status: "done" },
    { id: "JIRA-3", title: "Configure Contacts" , status: "in progress" },
    { id: "JIRA-4", title: "Configure Places", status: "done" },
    { id: "JIRA-5", title: "Configure Statements" , status: "backlog" },
]

const getJiraTicketsTool = tool({
    description: "Returns unordered list of JIRA tickets",
    parameters: z.object({
        query: z.string().describe("Query to search for JIRA tickets.")
    }),
    execute: async ({ query }) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("Simulating a delay for JIRA ticket retrieval...");
                resolve(tickets);
            }, 1000); // Simulate a 1 second delay
        });
    },
});

const prompt = `You are a helpful assistant that can answer questions about JIRA tickets.`;

const tools = [
    getJiraTicketsTool,
];

const getJiraTicketsResponse = async (query) => {
    
    console.log("Querying JIRA tickets with query:", query);
    const result = await generateText({
        model,
        prompt: query,
        system: prompt,
        tools,
        maxSteps: 5,
    });

    // console.dir(await result.steps, { depth: null });
    return result.text;
};

try {
  console.log("Fetching JIRA tickets...");
  const response = await getJiraTicketsResponse("How many JIRA tickets are in progress?");
  console.log(response);
} catch (error) {
  console.error("Error fetching JIRA tickets:", error);
}