// import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import readline from "readline";
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

/* Agent Tool that allows the retrieval of JIRA tickets based on a query. */
const getJiraTicketsTool = tool({
    description: "Returns unordered list of JIRA tickets",
    parameters: z.object({
        query: z.string().describe("Query to search for JIRA tickets.")
    }),
    execute: async ({ query }) => {
        /* Simulating a delay as this will be an API call in the future */
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("Simulating a delay for JIRA ticket retrieval...");
                resolve(tickets);
            }, 1000); // Simulate a 1 second delay
        });
    },
});

/* Set up a system prompt for the agent to understand its purpose */
const systemPrompt = `You are a helpful assistant that can answer questions about JIRA tickets.`;

const tools = [
    getJiraTicketsTool,
];

/**
 * @name jiraAgent
 * @description This function represents an agent with access to JIRA. Ask it anything about your tickets.
 * @param {string} query - The query to search for JIRA tickets.
 * @return {Promise<string>} - The response from the agent
 */
const jiraAgent = async (query) => {
    
    console.log("Querying JIRA tickets with query:", query);
    const result = await generateText({
        model,
        prompt: query,
        system: systemPrompt,
        tools,
        maxSteps: 5,
    });

    // console.dir(await result.steps, { depth: null });
    return result.text;
};

/* Set up chat interface to interact with the agent */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to prompt user
function prompt(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

const promptUser = async () => {
    try {
        const query = await prompt('Enter your query about JIRA tickets (type "exit" or "quit" to stop): ');
        if (query.toLowerCase() === 'exit' || query.toLowerCase() === 'quit') {
            rl.close();
            return;
        }
        const response = await jiraAgent(query);
        console.log(response);
        promptUser(); // Prompt again after response
    }
    catch (error) { 
        console.error("Error fetching JIRA tickets:", error);
        rl.close();
    }
}

// Main async function
async function main() {
    promptUser()
}

main();