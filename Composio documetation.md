\---  
title: Introduction  
hide-nav-links: true  
\---

Composio is an integration and tooling platform built for AI agents and LLM applications that lets you:  
\- Add tool-use capabilities to your AI agent from \[300+ apps\](/tools/).  
\- Give agents \[authenticated access to tools\](/auth/introduction).  
\- \[Listen and trigger\](/triggers/using-triggers) agents and workflows from external events (e.g., new Slack message, GitHub issue).  
\- \[Customize tools\](/tool-calling/customizing-tools) for proprietary APIs or specific functions.  
\- Seamlessly integrate tool-calling into frameworks like OpenAI Agents, Vercel AI, LangChain, etc.  
\- Refine tool interactions with \[input/output processing\](/tool-calling/processing-tools) for greater reliability.

You get to connect your AI agents faster without wrestling with individual API integrations and managing their authentication or converting them into LLM tool calls.

We also optimise the tool calls for you for maximum accuracy, free of cost\! 😉

\#\# Getting started  
The fastest way to give your agent tools is with Composio — often with \*\*zero setup\*\* needed on your part. Just:

1\.  \*\*Install the core SDK\*\* (and a framework helper if needed):  
    \<CodeGroup\>  
    \`\`\`bash Python  
    pip install composio\_core composio\_openai \# Example for OpenAI  
    \`\`\`

    \`\`\`bash TypeScript  
    npm install composio-core  
    \`\`\`  
    \</CodeGroup\>  
2\.  \*\*Login and get your API key\*\*:  
    \`\`\`bash  
    composio login  
    \`\`\`  
    \*(Ensure \`COMPOSIO\_API\_KEY\` is set as an environment variable)\*  
3\.  \*\*Connect your first app\*\* (e.g., GitHub):  
    \`\`\`bash  
    composio add github  
    \`\`\`

...and you're ready to integrate tools. Here's what you can do next:  
\- Head to the \[quickstart\](/getting-started/quickstart) guide to learn more.  
\- Browse our \[tools\](/tools) to see what you can integrate with.

\#\# Framework Integrations  
Here are some popular frameworks that Composio supports:

\<CardGroup cols={2}\>  
  \<Card  
    title="OpenAI"  
    icon="sparkles"  
    href="/model-providers/openai"  
  \>  
    Add 250+ tools to your Assistants API with automatic authentication handling and real-time function execution.  
  \</Card\>  
  \<Card title="Vercel AI SDK" icon="code-branch" href="/frameworks/vercel"\>  
    Turn your Vercel AI SDK agents into powerful workflows that interact with external services without managing API connections.  
  \</Card\>  
  \<Card title="LangChain" icon="link-simple" href="/frameworks/langchain"\>  
    Turn your LangChain agents into powerful workflows that interact with external services without managing API connections.  
  \</Card\>  
  \<Card title="CrewAI" icon="users" href="/frameworks/crewai"\>  
    Build specialized CrewAI agent teams that collaborate using external tools and data sources to accomplish complex tasks.  
  \</Card\>  
\</CardGroup\>

\<Card   
    title='All Frameworks'   
    icon='code-branch'   
    href='/frameworks'  
\>  
Check out all the frameworks.  
\</Card\>

\---  
title: Installation  
\---

Composio provides Python and TypeScript SDKs as well as plugins with other LLM frameworks like CrewAI, LangChain, AutoGen.

\#\# Install the SDK

\<Tabs\>  
  \<Tab title="Python"\>  
Before installing the SDK, ensure you have Python 3.8+.  
  \<Steps\>  
  \<Step title="Install Composio"\>  
  \<CodeGroup\>  
    \`\`\`pip pip  
    pip install composio\_core composio\_openai  
    \`\`\`  
    \`\`\`uv uv  
    uv add composio\_core composio\_openai  
    \`\`\`  
  \</CodeGroup\>  
  \</Step\>  
  \<Step title="Install the relevant plugin"\>  
    Depending on what LLM framework you're using, you'll need to install the relevant plugin.  
    \<CodeGroup\>  
    \`\`\`pip pip  
    pip install composio\_crewai      \# For CrewAI  
    pip install composio\_langchain   \# For LangChain  
    \`\`\`  
    \`\`\`uv uv  
    uv add composio\_crewai      \# For CrewAI  
    uv add composio\_langchain   \# For LangChain  
    \`\`\`  
    \</CodeGroup\>  
    \</Step\>  
    \<Step title="Post Installation"\>  
  On new installations, you'll need to generate the SDK types. If you encounter errors related to missing "metadata," it likely means you need to update your types.  
    \`\`\`bash  
    composio apps generate-types  
    \`\`\`  
    \</Step\>  
    \</Steps\>  
  \</Tab\>  
  \<Tab title="TypeScript"\>  
Before installing the SDK, ensure you have NodeJS 16+.  
  \<Steps\>  
  \<Step title="Install Composio"\>  
  \<CodeGroup\>  
    \`\`\`npm npm  
    npm install composio-core  
    \`\`\`  
    \`\`\`pnpm pnpm  
    pnpm add composio-core  
    \`\`\`  
    \`\`\`bun bun  
    bun add composio-core  
    \`\`\`  
  \</CodeGroup\>  
  \</Step\>  
  \<Step title="Plugins"\>  
  The TS package comes installed with support for frameworks like:  
  \- \[OpenAI\](/model-providers/openai)  
  \- \[Vercel AI SDK\](/frameworks/vercel)  
  \- \[LangGraph\](/frameworks/langgraph)  
  \</Step\>  
  \</Steps\>  
  \</Tab\>  
\</Tabs\>

\---  
title: Quickstart  
subtitle: Execute your first tool from Composio  
hide-nav-links: false  
\---  
This guide demonstrates a core Composio feature, executing authenticated tool calls without wrapping complex API calls into LLM tools yourself.

We'll connect to GitHub and fetch your username using a simple script.

\#\# Setup

First, let's get your environment ready. You only need to do this once.

This command will open a browser window for you to authenticate and generate your API key.  
\<CodeGroup\>  
\`\`\`bash  
composio login  
\`\`\`  
\</CodeGroup\>

\<Tip\>  
Make sure to set the retrieved \`COMPOSIO\_API\_KEY\` as an environment variable in your development environment (e.g., in a \`.env\` file or by exporting it).  
Also, if you can't run the \`composio login\` command, you can set the \`COMPOSIO\_API\_KEY\` environment variable manually.  
\</Tip\>

Composio handles the OAuth flow. This command links your GitHub account to your default Composio Entity (user profile).  
\<CodeGroup\>  
\`\`\`bash  
composio add github  
\`\`\`  
\</CodeGroup\>

Follow the prompts in your terminal and browser to authorize Composio.

\<CodeGroup\>  
\`\`\`python Python  
from composio\_openai import ComposioToolSet, Action  
from openai import OpenAI

\# Initialize Composio ToolSet  
\# It automatically picks up COMPOSIO\_API\_KEY from env vars  
\# Uses the 'default' entity\_id if not specified  
toolset \= ComposioToolSet()  
client \= OpenAI()  
\`\`\`

\`\`\`typescript TypeScript  
import { OpenAIToolSet } from "composio-core";  
import { OpenAI } from "openai";

// Initialize Composio ToolSet  
// It automatically picks up COMPOSIO\_API\_KEY from env vars  
// Uses the 'default' entity\_id if not specified  
const toolset \= new OpenAIToolSet();  
const client \= new OpenAI();  
\`\`\`  
\</CodeGroup\>

With setup done, let's write the code.

\#\# Tool-calling with Composio

The code below shows how to give tools to an LLM and letting Composio handle the execution when the LLM decides to use a tool.

\<CodeGroup\>  
\`\`\`python Python  
\# Directly execute the action to get the authenticated user's info  
\# Composio uses the connection linked via 'composio add github'  
tools \= toolset.get\_tools(actions=\[Action.GITHUB\_GET\_THE\_AUTHENTICATED\_USER\])

task \= "Get my GitHub username."  
messages \= \[  
    {"role": "system", "content": "You are a helpful assistant that can use tools."},  
    {"role": "user", "content": task},  
\]

response \= client.chat.completions.create(  
    model="gpt-4o-mini", \# Or another capable model  
    messages=messages,  
    tools=tools,    \# The tools we prepared earlier  
    tool\_choice="auto", \# Let the LLM decide whether to use a tool  
)

result \= toolset.handle\_tool\_calls(response)

print(result)  
\`\`\`

\`\`\`typescript TypeScript  
const tools \= await toolset.getTools({ actions: \["GITHUB\_GET\_THE\_AUTHENTICATED\_USER"\]})  
const task \= "Get my GitHub username."  
const messages \= \[  
    {"role": "system", "content": "You are a helpful assistant that can use tools."},  
    {"role": "user", "content": task},  
\]

const response \= await client.chat.completions.create({  
    model: "gpt-4o-mini", // Or another capable model  
    messages: messages,  
    tools: tools,   // The tools we prepared earlier  
    tool\_choice: "auto", // Let the LLM decide whether to use a tool  
});

const result \= await toolset.handleToolCall(response);

console.log(result);  
\`\`\`

\</CodeGroup\>

After running the script, you should see your GitHub username printed\!

\#\# What just happened?

1\. \*\*Tool Discovery\*\*: You asked Composio for tools (toolset.get\_tools). Composio provided LLM-ready definitions for GitHub actions.  
2\. \*\*LLM Reasoning\*\*: The LLM received your task ("Get my GitHub username") and the available tools. It determined the \`GITHUB\_GET\_THE\_AUTHENTICATED\_USER\` tool was appropriate.  
3\. \*\*Tool Request\*\*: The LLM responded asking to call that specific tool.  
4\. \*\*Composio Execution\*\*: \`toolset.handle\_tool\_calls\` intercepted this request. It found your linked GitHub credentials, made the actual API call, and returned the result.

You focused on the prompt and handling the final outcome, while Composio managed the tool schemas, authentication, and API interaction.

\<Accordion title="Full Code"\>  
\<CodeGroup\>  
\`\`\`python Python  
from composio\_openai import ComposioToolSet, Action  
from openai import OpenAI

toolset \= ComposioToolSet()  
client \= OpenAI()

tools \= toolset.get\_tools(actions=\[Action.GITHUB\_GET\_THE\_AUTHENTICATED\_USER\])  
task \= "Get my GitHub username."  
messages \= \[  
    {"role": "system", "content": "You are a helpful assistant that can use tools."},  
    {"role": "user", "content": task},  
\]  
response \= client.chat.completions.create(  
    model="gpt-4o-mini",   
    messages=messages,  
    tools=tools,  
    tool\_choice="auto",  
)  
result \= toolset.handle\_tool\_calls(response)  
print(result)  
\`\`\`

\`\`\`typescript TypeScript  
import { OpenAIToolSet } from "composio-core";  
import { OpenAI } from "openai";

// Initialize Composio ToolSet  
// It automatically picks up COMPOSIO\_API\_KEY from env vars  
// Uses the 'default' entity\_id if not specified  
const toolset \= new OpenAIToolSet();  
const client \= new OpenAI();

const tools \= await toolset.getTools({ actions: \["GITHUB\_GET\_THE\_AUTHENTICATED\_USER"\]})  
const task \= "Get my GitHub username."  
const messages \= \[  
    {"role": "system", "content": "You are a helpful assistant that can use tools."},  
    {"role": "user", "content": task},  
\]  
const response \= await client.chat.completions.create({  
    model: "gpt-4o-mini",  
    messages: messages,  
    tools: tools,  
    tool\_choice: "auto",  
});  
const result \= await toolset.handleToolCall(response);  
console.log(result);  
\`\`\`  
\</CodeGroup\>  
\</Accordion\>

\---  
title: Introduction  
subtitle: Learn about tool calling with Composio  
\---

Tool calling as a concept was introduced due to LLMs lack of ability to interact with data and influence external systems. Earlier you might be able to ask an LLM to write you a nice email, but you would have to manually send it. With tool calling, you can now provide an LLM a valid tools for example, \[\`GMAIL\_SEND\_EMAIL\`\](/tools/gmail\#gmail\_send\_email) to go and accomplish the task autonomously.

Composio extends this by providing a platform to connect your AI agents to external tools like Gmail, GitHub, Salesforce, etc. It's like a bridge between your AI and the tools it needs to get work done.

\#\# Tool Calling with Composio  
Here’s a typical flow when your agent uses a tool via Composio:

\`\`\`mermaid  
sequenceDiagram  
    participant Agent as Your AI Agent/App  
    participant Composio  
    participant LLM as Language Model  
    participant ExtAPI as External API (e.g., GitHub)

    Agent-\>\>LLM: 1\. User Request \+ Available Tools (via Composio)  
    Note right of Agent: "Get my GitHub username." \+ \[Tool: GITHUB\_GET\_...\]

    LLM-\>\>Agent: 2\. LLM decides to use a tool  
    Note left of LLM: Chooses GITHUB\_GET... tool

    Agent-\>\>Composio: 3\. Request Tool Execution  
    Note right of Agent: Pass LLM's tool call request (\`handle\_tool\_calls\`)

    Composio-\>\>Composio: 4\. Retrieve Credentials  
    Note over Composio: Finds correct auth for user & GitHub

    Composio-\>\>ExtAPI: 5\. Execute API Call  
    Note over Composio, ExtAPI: Makes authenticated call to api.github.com/user

    ExtAPI-\>\>Composio: 6\. API Response  
    Note over Composio, ExtAPI: Returns user data

    Composio-\>\>Agent: 7\. Return Execution Result  
    Note right of Agent: {"data": {"login": "user", ...}, "successful": true}

    Agent-\>\>LLM: 8\. Provide Result to LLM (Optional)  
    Note left of LLM: "Tool Result: User login is 'user'"

    LLM-\>\>Agent: 9\. Final Response  
    Note right of Agent: "Your GitHub username is user."  
\`\`\`

Essentially: Your app gets tool definitions from Composio, the LLM decides which to use, your app tells Composio to run it (\`handle\_tool\_calls\`), and Composio securely executes the real API call.

\#\# Example: Using a Composio Tool with OpenAI

Let's see this in action. We'll ask an OpenAI model to fetch a GitHub username using a pre-built Composio tool.

\*(Assumes you've completed the \[Setup steps\](/getting-started/quickstart\#setup): installed SDKs, run \`composio login\`, and \`composio add github\`)\*

\*\*1. Initialize Clients & Toolset\*\*  
Get your LLM client and Composio toolset ready.

\<CodeGroup\>  
\`\`\`python Python  
from composio\_openai import ComposioToolSet, App, Action  
from openai import OpenAI  
\# Assumes .env file with API keys is loaded

client \= OpenAI()  
toolset \= ComposioToolSet() \# Uses default entity\_id  
\`\`\`  
\`\`\`typescript TypeScript  
import { OpenAIToolSet, App, Action } from "composio-core";  
import { OpenAI } from "openai";  
// Assumes .env file with API keys is loaded

const client \= new OpenAI();  
const toolset \= new OpenAIToolSet(); // Uses default entityId  
\`\`\`  
\</CodeGroup\>

\*\*2. Get the Composio Tool\*\*  
Fetch the specific tool definition from Composio, formatted for your LLM.

\<CodeGroup\>  
\`\`\`python Python  
\# Fetch the tool for getting the authenticated user's GitHub info  
tools \= toolset.get\_tools(actions=\[Action.GITHUB\_GET\_THE\_AUTHENTICATED\_USER\])  
print(f"Fetched {len(tools)} tool(s) for the LLM.")  
\`\`\`  
\`\`\`typescript TypeScript  
// Fetch the tool for getting the authenticated user's GitHub info  
const tools \= await toolset.getTools({ actions: \["GITHUB\_GET\_THE\_AUTHENTICATED\_USER"\] });  
console.log(\`Fetched ${tools.length} tool(s) for the LLM.\`);  
\`\`\`  
\</CodeGroup\>

\*\*3. Send Request to LLM\*\*  
Provide the user's task and the Composio tools to the LLM.

\<CodeGroup\>  
\`\`\`python Python  
task \= "What is my GitHub username?"  
messages \= \[{"role": "user", "content": task}\]

print(f"Sending task to LLM: '{task}'")  
response \= client.chat.completions.create(  
    model="gpt-4o-mini",  
    messages=messages,  
    tools=tools,  
    tool\_choice="auto" \# Instruct LLM to choose if a tool is needed  
)  
\`\`\`  
\`\`\`typescript TypeScript  
const task \= "What is my GitHub username?";  
const messages \= \[{ role: "user" as const, content: task }\];

console.log(\`Sending task to LLM: '${task}'\`);  
const response \= await client.chat.completions.create({  
    model: "gpt-4o-mini",  
    messages: messages,  
    tools: tools,  
    tool\_choice: "auto" // Instruct LLM to choose if a tool is needed  
});  
\`\`\`  
\</CodeGroup\>

\*\*4. Handle Tool Call via Composio\*\*  
If the LLM decided to use a tool, pass the response to \`handle\_tool\_calls\`. Composio takes care of the execution.

\<CodeGroup\>  
\`\`\`python Python  
execution\_result \= None  
response\_message \= response.choices\[0\].message

if response\_message.tool\_calls:  
    print("LLM requested tool use. Executing via Composio...")  
    \# Composio handles auth, API call execution, and returns the result  
    execution\_result \= toolset.handle\_tool\_calls(response)  
    print("Execution Result from Composio:", execution\_result)  
else:  
    print("LLM responded directly (no tool used):", response\_message.content)

\# Now 'execution\_result' holds the data returned by the GitHub API call  
\# You could parse it or feed it back to the LLM for a final summary.  
\`\`\`  
\`\`\`typescript TypeScript  
let executionResult: any \= null;  
const responseMessage \= response.choices\[0\].message;

if (responseMessage.tool\_calls) {  
    console.log("LLM requested tool use. Executing via Composio...");  
    // Composio handles auth, API call execution, and returns the result  
    executionResult \= await toolset.handleToolCall(response);  
    console.log("Execution Result from Composio:", executionResult);  
} else {  
    console.log("LLM responded directly (no tool used):", responseMessage.content);  
}

// Now 'executionResult' holds the data returned by the GitHub API call  
// You could parse it or feed it back to the LLM for a final summary.  
\`\`\`  
\</CodeGroup\>

This example showcases how Composio seamlessly integrates with the LLM's tool-calling mechanism, handling the complex parts of API interaction securely and reliably.

\---  
title: Fetching Tools  
subtitle: Learn how to filter and go through Composio tools programmatically  
\---

Composio has 9000+ tools that one can view, fetch and filter from.

To view the tools, you can use the \*\*\[Composio Tool Directory\](/tools/)\*\*. It's a searchable catalog of tools from all our apps. It has the following info for each app:  
\- Authentication details for the app.  
\- List of available actions.  
\- Schema for each action.

Once you know which tools you need, you can fetch their definitions programmatically using the methods below.

\#\# Fetching Specific Actions

This is the most precise method. Use it when you know exactly which tool(s) your agent needs access to for a specific task. You can pass specific \`Action\` enums or their string equivalents.

\<CodeGroup\>  
\`\`\`python Python  
from composio\_openai import ComposioToolSet, Action

\# Initialize ToolSet (assuming API key is in env)  
toolset \= ComposioToolSet()

\# Fetch only the tool for starring a GitHub repo  
github\_star\_tool \= toolset.get\_tools(  
    actions=\[Action.GITHUB\_STAR\_A\_REPOSITORY\_FOR\_THE\_AUTHENTICATED\_USER\]  
)

print(github\_star\_tool)  
\# Output will contain the schema for the specified action.  
\`\`\`

\`\`\`typescript TypeScript  
import { OpenAIToolSet } from "composio-core";

// Initialize ToolSet (assuming API key is in env)  
const toolset \= new OpenAIToolSet();

async function fetchSpecificTool() {  
    // Fetch only the tool for starring a GitHub repo  
    const githubStarTool \= await toolset.getTools({  
        actions: \["GITHUB\_STAR\_A\_REPOSITORY\_FOR\_THE\_AUTHENTICATED\_USER"\]  
    });

    console.log(githubStarTool);  
    // Output will contain the schema for the specified action.  
}

fetchSpecificTool();  
\`\`\`  
\</CodeGroup\>

\#\# Fetching Tools by App

If you want to give an LLM general capabilities for a connected application (like "manage my GitHub issues"), you can fetch tools by specifying the \`App\`.

\<CodeGroup\>  
\`\`\`python Python  
\# Fetch default tools for the connected GitHub app  
github\_tools \= toolset.get\_tools(apps=\[App.GITHUB\])

print(f"Fetched {len(github\_tools)} tools for GitHub.")  
\# Output contains schemas for 'important' GitHub tools.  
\`\`\`

\`\`\`typescript TypeScript  
async function fetchAppTools() {  
  // Fetch default tools for the connected GitHub app  
  const githubTools \= await toolset.getTools({ apps: \["github"\] });

  console.log(\`Fetched ${githubTools.length} tools for GitHub.\`);  
  // Output contains schemas for 'important' GitHub tools.  
}

fetchAppTools();  
\`\`\`  
\</CodeGroup\>

\<Warning title="Default App Tool Filtering"\>  
By default, fetching tools using only the \`apps\` filter returns actions tagged as \`important\`. This prevents overwhelming the LLM's context window with too many tools. If you need \*all\* actions for an app, you'll need to fetch them explicitly or explore the app's page in the \[Tool Directory\](/tools/).  
\</Warning\>

\#\# Fetching Specific Tools  
You can fetch specific tools by their action names.

\<CodeGroup\>  
\`\`\`python Python  
\# Fetch specific tools by action name  
github\_tools \= toolset.get\_tools(  
    actions=\[  
        Action.GITHUB\_GET\_THE\_AUTHENTICATED\_USER,  
        Action.GITHUB\_LIST\_REPOSITORIES\_FOR\_THE\_AUTHENTICATED\_USER  
    \]  
)

print(f"Fetched {len(github\_tools)} tools.")  
\# Output contains schemas for the specified actions.  
\`\`\`

\`\`\`typescript TypeScript  
async function fetchSpecificTools() {  
  // Fetch specific tools by action name  
  const githubTools \= await toolset.getTools({  
      actions: \["GITHUB\_GET\_THE\_AUTHENTICATED\_USER", "GITHUB\_LIST\_REPOSITORIES\_FOR\_THE\_AUTHENTICATED\_USER"\]  
  });

  console.log(\`Fetched ${githubTools.length} tools.\`);  
  // Output contains schemas for the specified actions.  
}

fetchSpecificTools();  
\`\`\`  
\</CodeGroup\>

\#\# Filtering App Tools by Tags

You can refine the tools fetched for an app by adding \`tags\`. This is useful for focusing the LLM on a specific category of actions within an app.

\<CodeGroup\>  
\`\`\`python Python  
\# Fetch only Jira tools related to 'Issues'  
jira\_issue\_tools \= toolset.get\_tools(  
    apps=\[App.JIRA\],  
    tags=\["Issues"\] \# Tag names are case-sensitive  
)

print(f"Fetched {len(jira\_issue\_tools)} Jira tools tagged with 'Issues'.")  
\`\`\`

\`\`\`typescript TypeScript  
async function fetchTaggedTools() {  
  // Fetch only Jira tools related to 'Issues'  
  const jiraIssueTools \= await toolset.getTools({  
      apps: \[App.JIRA\],  
      tags: \["Issues"\] // Tag names are case-sensitive  
  });

  console.log(\`Fetched ${jiraIssueTools.length} Jira tools tagged with 'Issues'.\`);  
}

fetchTaggedTools();  
\`\`\`  
\</CodeGroup\>

\#\# Finding Tools by Use Case (Experimental)

For creating more agentic flows when creating general agents over a broad problem statement, you can search for actions based on a natural language description of the task and then inject it in.

\<Tip\>This feature uses semantic search and is currently experimental. Results may vary.\</Tip\>

\<CodeGroup\>  
\`\`\`python Python  
\# Describe the task  
query \= "create a new page in notion"

\# Find relevant action ENUMS (Python-specific helper)  
relevant\_actions \= toolset.find\_actions\_by\_use\_case(  
    use\_case=query,  
    apps=\[App.NOTION\] \# Optionally scope the search to specific apps  
    \# advanced=True \# Use for complex queries needing multiple tools  
)

print(f"Found relevant actions: {relevant\_actions}")

\# Fetch the actual tool schemas for the found actions  
if relevant\_actions:  
    notion\_tools \= toolset.get\_tools(actions=relevant\_actions)  
    print(f"Fetched {len(notion\_tools)} tool(s) for the use case.")  
else:  
    print("No relevant actions found for the use case.")

\# Use the \`notion\_tools\` in your agent

\`\`\`

\`\`\`typescript TypeScript  
async function fetchToolsByUseCase() {  
  // Describe the task  
  const query \= "create a new page in notion";

  // Find relevant action ENUMS  
  const relevantActions \= await toolset.client.actions.findActionEnumsByUseCase({  
      useCase: query,  
      apps: \[App.NOTION\] // Optionally scope the search  
      // advanced: true // Use for complex queries needing multiple tools  
  });

  console.log("Found relevant action enums:", relevantActions);

  // Fetch the actual tool schemas for the found actions  
  if (relevantActions && relevantActions.length \> 0\) {  
      const notionTools \= await toolset.getTools({ actions: relevantActions });  
      console.log(\`Fetched ${notionTools.length} tool(s) for the use case.\`);  
  } else {  
      console.log("No relevant actions found for the use case.");  
  }  
}

// Use the \`notionTools\` in your agent

fetchToolsByUseCase();  
\`\`\`  
\</CodeGroup\>

Use the \`advanced=True\` (Python) / \`advanced: true\` (TypeScript) flag if the use case might require multiple tools working together in sequence. Composio's search will attempt to find a suitable chain of actions.

\#\# Inspecting Tool Schemas

Sometimes, you might need to examine the raw JSON schema definition of a tool, rather than getting it pre-formatted for a specific LLM framework via \`get\_tools\`. This can be useful for:

\*   Understanding exact input parameters and output structures.  
\*   Building custom logic around tool definitions.  
\*   Debugging tool interactions.  
\*   Research and experimentation.

You can retrieve the raw action schemas using the \`get\_action\_schemas\` method.

\<Tip title="Bypass Connection Checks"\>  
A key feature for inspection is setting \`check\_connected\_accounts=False\`. This allows you to fetch the schema for any tool, even if you haven't connected the corresponding app via \`composio add \<app\>\`, making it ideal for exploration.  
\</Tip\>

\<CodeGroup\>  
\`\`\`python Python  
from composio import ComposioToolSet, Action, App \# Use base ComposioToolSet for schema inspection

\# Initialize base ToolSet  
base\_toolset \= ComposioToolSet()

\# Get the raw schema for a specific Google Calendar action  
\# Bypass the check for an active Google Calendar connection  
calendar\_schemas \= base\_toolset.get\_action\_schemas(  
    actions=\[Action.GOOGLECALENDAR\_LIST\_CALENDARS\],  
    check\_connected\_accounts=False  
)

if calendar\_schemas:  
    import json  
    print("Raw Schema for GOOGLECALENDAR\_LIST\_CALENDARS:")  
    \# calendar\_schemas is a list, access the first element  
    print(json.dumps(calendar\_schemas\[0\].model\_dump(), indent=2))  
else:  
    print("Schema not found.")

\# You can also fetch schemas by app or tags similarly  
\# github\_schemas \= base\_toolset.get\_action\_schemas(  
\#    apps=\[App.GITHUB\], check\_connected\_accounts=False  
\# )  
\`\`\`

\`\`\`typescript TypeScript  
import { ComposioToolSet, Action, App } from "composio-core"; // Use base ComposioToolSet

// Initialize base ToolSet  
const baseToolset \= new ComposioToolSet();

async function inspectSchema() {  
    // Get the raw schema for a specific Google Calendar action  
    // Bypass the check for an active Google Calendar connection  
    const calendarSchemas \= await baseToolset.getActionsSchema( // Note: Method name might differ slightly or require client access depending on SDK version/structure  
       { actions: \[Action.GOOGLECALENDAR\_LIST\_CALENDARS\] },  
       undefined, // entityId \- not relevant here  
       // Pass underlying client option if needed, or use client directly:  
       // await baseToolset.client.actions.get({ actions: \[Action.GOOGLECALENDAR\_LIST\_CALENDARS\] })  
       // The exact TS equivalent depends on how schema fetching bypassing checks is exposed.  
       // Assuming getActionsSchema handles it conceptually:  
       // check\_connected\_accounts=false equivalent might be implicit or require direct client usage.  
       // This example assumes a conceptual equivalent exists on the toolset for simplicity.  
    );

    if (calendarSchemas && calendarSchemas.length \> 0\) {  
        console.log("Raw Schema for GOOGLECALENDAR\_LIST\_CALENDARS:");  
        // calendarSchemas is an array, access the first element  
        console.log(JSON.stringify(calendarSchemas\[0\], null, 2));  
         // Adjust access based on actual return type (might be ActionModel-like objects)  
    } else {  
        console.log("Schema not found.");  
    }

     // Fetching by app:  
     // const githubSchemas \= await baseToolset.getActionsSchema({ apps: \["github"\] });  
}

inspectSchema();

// Note: The TypeScript example is conceptual. Direct schema fetching bypassing connection checks  
// might require using \`baseToolset.client.actions.get(...)\` directly if \`getActionsSchema\`  
// on the ToolSet enforces checks or framework formatting. Refer to TS SDK specifics.

\`\`\`  
\</CodeGroup\>

This method returns detailed \`ActionModel\` objects containing the full parameter and response schemas, version information, and more, without the framework-specific wrappers applied by \`get\_tools\`.  
\`\`\`

\---  
title: Executing Tools  
subtitle: Learn how to run Composio tools via LLM frameworks or directly from your code  
\---

Once you have fetched or defined your tools (\[Fetching Tools\](/tool-calling/fetching-tools)), the next step is to execute them. This means triggering the actual API call or function execution that the tool represents.

There are two primary ways to execute Composio tools:

1\. \*\*\[Automatic execution\](\#automatic-execution)\*\*: Your chosen LLM decides which tool to call, and a framework (like Vercel AI SDK, LangChain) handles triggering the execution logic provided by Composio.  
2\. \*\*\[Direct execution\](\#direct-execution)\*\*: Your LLM/agent decides to call a tool and the code explicitly invokes the specific Composio tool using the \`execute\_action\` method, often used for testing or simple automation.

\#\# Automatic execution  
Frameworks like the Vercel AI, LangGraph often have features to automatically \`execute\` the tools. The framework will handle the execution logic provided by Composio.

\*\*Here's an example of how Vercel AI SDK automatically executes tools\*\*

\`\`\`typescript Vercel AI SDK maxLines=100  
// Conceptual illustration within Vercel AI SDK context  
import { VercelAIToolSet } from "composio-core";  
import { generateText } from 'ai';  
import { openai } from '@ai-sdk/openai';

const toolset \= new VercelAIToolSet(); // Gets API key from env

async function runVercelExample() {  
  const { tool } \= await import('ai'); // Vercel AI SDK tool definition type

  // 1\. Fetch tool \- Composio formats it for Vercel, including an 'execute' function  
  const tools \= await toolset.getTools({ actions: \["GITHUB\_GET\_THE\_AUTHENTICATED\_USER"\] });

  // 2\. Use the tool with the framework's function (e.g., generateText)  
  const { text, toolResults } \= await generateText({  
    model: openai('gpt-4o-mini'),  
    prompt: 'Get my GitHub username',  
    tools: tools // Provide the Composio-generated tool definitions  
  });

  // 3\. Framework internally calls the 'execute' method on the chosen tool.  
  //    Composio's wrapper inside 'execute' handles the actual API call.  
  console.log("Tool Results:", toolResults);  
  console.log("Final Text:", text);  
}  
\`\`\`

\*\*Key Takeaway:\*\* When using a framework integration, you typically fetch tools using the corresponding Composio ToolSet (e.g., \`VercelAIToolSet\`) and then use the framework's standard way to handle tool calls. Composio's ToolSet ensures the execution logic is correctly wired behind the scenes.

\<Tip\>  
Refer to the specific \*\*\[Framework Integration Guide\](/frameworks/)\*\* for your chosen framework (e.g., Vercel AI, LangChain, CrewAI) to see the exact code patterns for handling tool execution within that ecosystem.  
\</Tip\>

\#\# Direct execution

For scenarios where you want to run a specific tool programmatically without an LLM making the decision, use the \`execute\_action\` method. This is available on the base \`ComposioToolSet\` and framework-specific ToolSets.

\<Note\>Use this when you want to run a specific tool programmatically without an LLM making the decision.\</Note\>

Let's create a \*\*\[GitHub issue\](/tools/github\#github\_create\_an\_issue)\*\* using Composio.

\<CodeGroup\>  
\`\`\`python Python maxLines=100  
\# Example: Create a GitHub Issue Directly  
from composio\_openai import ComposioToolSet, Action  
\# Assumes toolset is initialized and authenticated

toolset \= ComposioToolSet()

print("Creating GitHub issue directly...")  
try:  
    result \= toolset.execute\_action(  
        action=Action.GITHUB\_CREATE\_AN\_ISSUE,  
        params={  
            "owner": "composiohq",  \# Replace with actual owner  
            "repo": "agi",  \# Replace with actual repo  
            "title": "New Issue via Composio execute\_action",  
            "body": "This issue was created directly using the Composio SDK.",  
            \# Other optional params like 'assignees', 'labels' can be added here  
        },  
        \# entity\_id="your-user-id" \# Optional: Specify if not 'default'  
    )

    if result.get("successful"):  
        print("Successfully created issue\!")  
        \# Issue details are often in result\['data'\]  
        print("Issue URL:", result.get("data", {}).get("html\_url"))  
    else:  
        print("Failed to create issue:", result.get("error"))

except Exception as e:  
    print(f"An error occurred: {e}")  
\`\`\`

\`\`\`typescript TypeScript maxLines=100  
// Example: Create a GitHub Issue Directly  
import { OpenAIToolSet } from "composio-core";  
// Assumes toolset is initialized and authenticated

const toolset \= new OpenAIToolSet();

async function createIssue() {  
  console.log("Creating GitHub issue directly...");  
  try {  
    const result \= await toolset.executeAction({  
      action: "GITHUB\_CREATE\_AN\_ISSUE", // Use Enum for type safety  
      params: {  
        owner: "composiohq", // Replace with actual owner  
        repo: "agi", // Replace with actual repo  
        title: "New Issue via Composio executeAction",  
        body: "This issue was created directly using the Composio SDK.",  
      },  
      // entityId: "your-user-id" // Optional: Specify if not 'default'  
    });

    if (result.successful) {  
      console.log("Successfully created issue\!");  
      // Issue details are often in result.data  
      console.log("Issue URL:", (result.data as any)?.html\_url);  
    } else {  
      console.error("Failed to create issue:", result.error);  
    }  
  } catch (error) {  
    console.error("An error occurred:", error);  
  }  
}

createIssue();

\`\`\`  
\</CodeGroup\>

This directly triggers the specified Composio action using the associated user's credentials.

\#\# Specifying Users

\#\#\# By using \`entity\_id\`

Composio needs to know \*which user's\* connection/credentials to use when executing an authenticated action. You provide this context using \`entity\_id\` and sometimes \`connected\_account\_id\`.

By default it uses the default entity ID \`"default"\`.

For multi-tenant applications (multi-user apps), you need to provide the \`entity\_id\`.

\<CodeGroup\>  
\`\`\`python Python  
\# Direct Execution with entity\_id  
toolset.execute\_action(  
    action=Action.GITHUB\_CREATE\_AN\_ISSUE,  
    params={...},  
    entity\_id="user-from-my-db-123"  
)  
\`\`\`  
\`\`\`typescript TypeScript  
// Direct Execution with entityId  
await toolset.executeAction({  
    action: "GITHUB\_CREATE\_AN\_ISSUE",  
    params: {...},  
    entityId: "user-from-my-db-123"  
});  
\`\`\`  
\</CodeGroup\>

\#\#\# By using \`connected\_account\_id\`

\`connected\_account\_id\` offers more precision by identifying a \*specific instance\* of a connection (e.g., a user's work Gmail vs. personal Gmail). 

You typically only need this if an \`entity\_id\` has multiple active connections for the \*same app\*.

If \`connected\_account\_id\` is not provided, Composio generally uses the most recently added \*active\* connection matching the \`entity\_id\` and the app being used. You can pass it when needed, primarily with \`execute\_action\`:

\<CodeGroup\>  
\`\`\`python Python  
\# Direct Execution targeting a specific connection  
toolset.execute\_action(  
    action=Action.GMAIL\_SEND\_EMAIL,  
    params={...},  
    connected\_account\_id="conn\_abc123xyz" \# The specific Gmail connection  
)  
\`\`\`  
\`\`\`typescript TypeScript  
// Direct Execution targeting a specific connection  
await toolset.executeAction({  
    action: "GMAIL\_SEND\_EMAIL",  
    params: {...},  
    connectedAccountId: "conn\_abc123xyz" // The specific Gmail connection  
});  
\`\`\`  
\</CodeGroup\>

{/\* \#\# Direct Execution with Custom Authentication

If you are managing authentication tokens outside of Composio's connection flow (e.g., obtaining a temporary token via a different process), you can still use \`execute\_action\` by providing the necessary credentials directly.

\<CodeGroup\>  
\`\`\`python Python  
\# Example: Create GitHub Issue with a provided Bearer token  
bearer\_token \= "gho\_YourTemporaryOrManagedToken"

try:  
    result \= toolset.execute\_action(  
        action=Action.GITHUB\_CREATE\_ISSUE,  
        params={  
            "owner": "target-owner",  
            "repo": "target-repo",  
            "title": "Issue via Custom Auth",  
            "body": "Using a provided Bearer token."  
        },  
        \# Provide auth details directly  
        auth={  
            "parameters": \[  
                {"name": "Authorization", "value": f"Bearer {bearer\_token}", "in\_": "header"}  
            \]  
            \# 'base\_url' can be added if needed for self-hosted instances  
            \# 'body' can be added for auth methods requiring it  
        }  
    )  
    print(result)  
except Exception as e:  
    print(f"An error occurred: {e}")  
\`\`\`  
\`\`\`typescript TypeScript  
// Example: Create GitHub Issue with a provided Bearer token  
import { ComposioToolSet, Action, ParamPlacement } from "composio-core";

const bearerToken \= "gho\_YourTemporaryOrManagedToken";  
const toolset \= new ComposioToolSet(); // Init ToolSet

async function createWithCustomAuth() {  
    try {  
        const result \= await toolset.executeAction({  
            action: Action.GITHUB\_CREATE\_ISSUE,  
            params: {  
                owner: "target-owner",  
                repo: "target-repo",  
                title: "Issue via Custom Auth",  
                body": "Using a provided Bearer token."  
            },  
            // Provide auth details directly  
            auth: {  
                parameters: \[  
                    { name: "Authorization", value: \`Bearer ${bearerToken}\`, in: ParamPlacement.Header }  
                \]  
                // 'baseUrl' can be added if needed  
                // 'body' can be added if needed  
            }  
        });  
        console.log(result);  
    } catch (error) {  
        console.error("An error occurred:", error);  
    }  
}

createWithCustomAuth();  
\`\`\`  
\</CodeGroup\>

This allows leveraging Composio's action execution logic even when authentication is handled externally. Refer to the \[\`CustomAuthParameter\`\](/sdk-reference/python/client/collections/CustomAuthParameter) details for parameter placement options (\`header\`, \`query\`, etc.). \*/}

\---  
title: Creating Custom Tools  
subtitle: 'Define your own functions as tools, extend apps, or use custom authentication'  
\---

While Composio offers a vast library of pre-built tools, you often need to integrate your own custom logic or interact with APIs in specific ways. This guide covers how to create and use custom tools within the Composio ecosystem.

\*\*You can create custom tools to:\*\*  
\- \[Wrap your existing functions\](\#defining-tools-from-your-functions), making them callable by LLMs.  
\- \[Extend the functionality of existing Composio-integrated apps\](\#extending-composio-toolkits) by calling their APIs using Composio's managed authentication.  
\- Inject and \[use your own external authentication\](\#adding-custom-authentication-to-tools) credentials to execute any Composio tool.

\#\# Defining Tools from Your Functions

The most straightforward way to create a custom tool is to wrap an existing function in your codebase. Composio provides decorators (Python) and methods (TypeScript) to make these functions discoverable and executable by LLMs.

\#\#\# Python (\`@action\`)  
Use the \`@action\` decorator from \`composio\` to designate a Python function as a tool. Composio automatically infers the tool's schema and description from the following:

\- \*\*Function Name:\*\* Becomes the default tool name (can be overridden).  
\- \*\*Docstring:\*\* Used as the tool's description for the LLM. Make it clear and concise\!  
\- \*\*Type Hints:\*\* Define the input parameters and their types for the LLM and for validation.  
\- \*\*Return Type Hint:\*\* Informs the expected output structure.

\*\*Example:\*\*

\`\`\`python Python maxLines=100  
from composio import action  
from typing import Annotated \# Recommended for descriptions

\# Define a simple function  
@action \# Decorate it to make it a Composio tool  
def add\_numbers(  
    a: Annotated\[int, "The first number to add"\],  
    b: Annotated\[int, "The second number to add"\]  
) \-\> int:  
    """Adds two integers and returns the result."""  
    print(f"Executing add\_numbers: Adding {a} and {b}")  
    return a \+ b

\# Optionally, provide a custom name for the tool  
@action(toolname="calculator\_multiply")  
def multiply\_numbers(  
    a: Annotated\[int, "The first number"\],  
    b: Annotated\[int, "The second number"\]  
) \-\> int:  
    """Multiplies two integers."""  
    print(f"Executing multiply\_numbers: Multiplying {a} by {b}")  
    return a \* b  
\`\`\`

\#\#\# TypeScript (\`createAction\`)

Use the \`createAction\` method on your ToolSet instance (\`OpenAIToolSet\`, \`LangchainToolSet\`, etc.). You provide the configuration, including a \[Zod\](https://zod.dev/) schema for input parameters and an async callback function containing your logic.

\*\*Example:\*\*

\`\`\`typescript TypeScript maxLines=100  
import { OpenAIToolSet } from "composio-core"; // Or your specific framework ToolSet  
import { z } from "zod";

const toolset \= new OpenAIToolSet(); // Initialize ToolSet

// Define the input schema using Zod  
const addSchema \= z.object({  
    a: z.number().describe("The first number to add"),  
    b: z.number().describe("The second number to add"),  
});

// Register the custom action  
await toolset.createAction({  
    actionName: "add\_numbers", // Unique name for this tool  
    description: "Adds two numbers and returns the sum.",  
    inputParams: addSchema, // Provide the Zod schema  
    // The callback function containing your logic  
    callback: async (input) \=\> {  
        // Safely access validated input (casting based on schema)  
        const params \= input as z.infer\<typeof addSchema\>;  
        console.log(\`Executing add\_numbers: Adding ${params.a} and ${params.b}\`);  
        const sum \= params.a \+ params.b;  
        // Return a JSON-serializable result  
        return { result: sum };  
    },  
});

console.log("Custom action 'add\_numbers' registered.");  
\`\`\`

\#\#\# Using Your Custom Function Tools

Once defined (\`@action\`) or registered (\`createAction\`), these tools behave like any other Composio tool:

1\.  \*\*Fetch them:\*\* Use \`get\_tools\`, referencing the function object (Python) or the \`actionName\` string (Python/TS).  
2\.  \*\*Execute them:\*\* Use framework handlers (like Vercel's \`execute\`) or \`execute\_action\`.

\<CodeGroup\>  
\`\`\`python Python maxLines=100  
\# Fetch custom and built-in tools together  
tools \= toolset.get\_tools(  
    actions=\[  
        Action.GITHUB\_GET\_THE\_AUTHENTICATED\_USER, \# Built-in  
        add\_numbers,                         \# Custom (by function object)  
        "calculator\_multiply"                \# Custom (by toolname string)  
    \]  
)  
\# Pass 'tools' to your LLM or framework  
\`\`\`  
\`\`\`typescript TypeScript maxLines=100  
// Fetch custom and built-in tools together  
const tools \= await toolset.getTools({  
    actions: \[  
        "GITHUB\_GET\_THE\_AUTHENTICATED\_USER", // Built-in  
        "add\_numbers"                        // Custom (by actionName string)  
    \]  
});  
// Pass 'tools' to your LLM or framework  
\`\`\`  
\</CodeGroup\>

\#\# Extending Composio Toolkits

A powerful feature is creating custom tools that leverage Composio's \*\*managed authentication\*\* for an existing app (like GitHub, Slack, etc.). This allows you to call API endpoints for that app without handling credentials yourself.

\*\*Example: Get GitHub Repository Topics\*\*

Let's create a tool to fetch topics for a GitHub repo, using Composio's managed GitHub auth.

\<CodeGroup\>  
\`\`\`python Python maxLines=100  
\# Python Example using execute\_request  
from composio import action, ComposioToolSet  
import typing as t

toolset \= ComposioToolSet()

@action(toolname="github") \# Associate with GitHub app for auth  
def get\_github\_repo\_topics(  
    owner: Annotated\[str, "Repository owner username"\],  
    repo: Annotated\[str, "Repository name"\],  
    execute\_request: t.Callable \# Injected by Composio  
) \-\> dict:  
    """Gets the topics associated with a specific GitHub repository."""  
    print(f"Getting topics for {owner}/{repo} using Composio-managed GitHub auth...")  
    try:  
        \# Call the GitHub API endpoint using the injected function  
        response\_data \= execute\_request(  
            endpoint=f"/repos/{owner}/{repo}/topics", \# API path relative to base URL  
            method="GET"  
            \# Body/parameters usually not needed when relying on managed auth  
        )  
        \# Ensure response\_data is a dictionary before accessing 'names'  
        if isinstance(response\_data, dict):  
             return {"topics": response\_data.get("names", \[\])}  
        else:  
             \# Handle unexpected response format  
             print(f"Warning: Unexpected response format from execute\_request: {type(response\_data)}")  
             return {"error": "Failed to parse topics", "raw\_response": response\_data}

    except Exception as e:  
        print(f"Error executing request for topics: {e}")  
        return {"error": str(e)}

\# \--- Example Usage \---  
\# You would fetch this tool like any other:  
\# tools \= toolset.get\_tools(actions=\[get\_github\_repo\_topics\])  
\# result \= toolset.execute\_action(get\_github\_repo\_topics, params={"owner": "composiohq", "repo": "composio"})  
\# print(result)  
\`\`\`  
\`\`\`typescript TypeScript maxLines=100  
// TypeScript Example using executeRequest  
import { OpenAIToolSet, App, RawExecuteRequestParam, ActionExecutionResDto, ParamPlacement } from "composio-core";  
import { z } from "zod";

const toolset \= new OpenAIToolSet();

await toolset.createAction({  
    actionName: "get\_github\_repo\_topics",  
    toolName: "github", // Associate with GitHub app for managed auth  
    description: "Gets the topics associated with a specific GitHub repository.",  
    inputParams: z.object({  
        owner: z.string().describe("Repository owner username"),  
        repo: z.string().describe("Repository name"),  
    }),  
    // Callback receives input, credentials (usually undefined here), and executeRequest  
    callback: async (inputParams, \_authCredentials, executeRequest): Promise\<ActionExecutionResDto\> \=\> {  
         // Type assertion for validated input  
         const { owner, repo } \= inputParams as { owner: string, repo: string };  
         console.log(\`Getting topics for ${owner}/${repo} using Composio-managed GitHub auth...\`);  
         try {  
             // Call executeRequest \- Composio injects auth for 'github'  
             const response \= await executeRequest({  
                 endpoint: \`/repos/${owner}/${repo}/topics\`, // API path  
                 method: "GET",  
                 // No body/parameters needed for standard managed auth GET request  
             });

             // Process response and return in Composio's expected format  
             // Assuming response directly contains the API data structure  
             const topics \= (response as any)?.names ?? \[\]; // Safely extract topics  
             return { successful: true, data: { topics: topics } };

         } catch (e) {  
             console.error("Error calling executeRequest for topics:", e);  
             // Return error in Composio's expected format  
             return { successful: false, error: String(e) };  
         }  
    }  
});

// \--- Example Usage \---  
// You would fetch this tool like any other:  
// const tools \= await toolset.getTools({ actions: \["get\_github\_repo\_topics"\] });  
// const result \= await toolset.executeAction({ action: "get\_github\_repo\_topics", params: { owner: "composiohq", repo: "composio" } });  
// console.log(result);  
\`\`\`  
\</CodeGroup\>

This allows you to extend Composio's capabilities for any integrated app without managing the authentication flow yourself.

\---  
title: Processing Tools  
subtitle: 'Customize tool behavior by modifying schemas, inputs, and outputs'  
\---

Composio allows you to refine how tools interact with LLMs and external APIs through \*\*Processors\*\*. These are custom functions you provide to modify data at key stages:  
\- before the LLM sees the tool's definition  
\- before Composio executes the tool  
\- after Composio executes the tool

\*\*Why use Processors?\*\*

\- \*\*Improve Reliability:\*\* Remove confusing parameters or inject required values the LLM might miss.  
\- \*\*Guide LLMs:\*\* Simplify tool schemas or descriptions for better tool selection.  
\- \*\*Manage Context & Cost:\*\* Filter large API responses to send only relevant data back to the LLM, saving tokens.  
\- \*\*Adapt to Workflows:\*\* Transform tool inputs or outputs to match your application's specific needs.

\<Warning title="Python SDK Only"\>  
Tool Processors described on this page are currently only available in Composio's \*\*Python SDK\*\*. Support for TypeScript is planned for the future.  
\</Warning\>

\#\# How Processors Work

Processors are Python functions you define and pass to \`get\_tools\` within a \`processors\` dictionary. The dictionary maps the processing stage (\`"schema"\`, \`"pre"\`, \`"post"\`) to another dictionary, which maps the specific \`Action\` to your processor function.

\`\`\`python Python  
\# Conceptual structure for applying processors

def my\_schema\_processor(schema: dict) \-\> dict: ...  
def my\_preprocessor(inputs: dict) \-\> dict: ...  
def my\_postprocessor(result: dict) \-\> dict: ...

tools \= toolset.get\_tools(  
    actions=\[Action.SOME\_ACTION\],  
    processors={  
        \# Applied BEFORE the LLM sees the schema  
        "schema": {Action.SOME\_ACTION: my\_schema\_processor},

        \# Applied BEFORE the tool executes  
        "pre": {Action.SOME\_ACTION: my\_preprocessor},

        \# Applied AFTER the tool executes, BEFORE the result is returned  
        "post": {Action.SOME\_ACTION: my\_postprocessor}  
    }  
)  
\`\`\`

Let's look at each type.

\#\# Schema Processing (\`schema\`)

\*\*Goal:\*\* Modify the tool's definition (schema) \*before\* it's provided to the LLM.

\*\*Example: Simplifying \`GMAIL\_SEND\_EMAIL\` Schema\*\*

Let's hide the \`recipient\_email\` and \`attachment\` parameters from the LLM, perhaps because our application handles the recipient logic separately and doesn't support attachments in this flow.

\`\`\`python Python  
from composio\_openai import ComposioToolSet, Action

toolset \= ComposioToolSet()

def simplify\_gmail\_send\_schema(schema: dict) \-\> dict:  
    """Removes recipient\_email and attachment params from the schema."""  
    params \= schema.get("parameters", {}).get("properties", {})  
    params.pop("recipient\_email", None)  
    params.pop("attachment", None)  
    \# We could also modify descriptions here, e.g.:  
    \# schema\["description"\] \= "Sends an email using Gmail (recipient managed separately)."  
    return schema

\# Get tools with the modified schema  
processed\_tools \= toolset.get\_tools(  
    actions=\[Action.GMAIL\_SEND\_EMAIL\],  
    processors={  
        "schema": {Action.GMAIL\_SEND\_EMAIL: simplify\_gmail\_send\_schema}  
    }  
)

\# Now, when 'processed\_tools' are given to an LLM, it won't see  
\# the 'recipient\_email' or 'attachment' parameters in the schema.  
\# print(processed\_tools\[0\]) \# To inspect the modified tool definition  
\`\`\`

\#\# Preprocessing (\`pre\`)

\*\*Goal:\*\* Modify the input parameters provided by the LLM \*just before\* the tool executes.

Use this to inject required values hidden from the LLM (like the \`recipient\_email\` from the previous example), add default values, clean up or format LLM-generated inputs, or perform last-minute validation.

\*\*Example: Injecting \`recipient\_email\` for \`GMAIL\_SEND\_EMAIL\`\*\*

Continuing the previous example, since we hid \`recipient\_email\` from the LLM via schema processing, we now need to inject the correct value before Composio executes the \`GMAIL\_SEND\_EMAIL\` action.

\`\`\`python Python  
def inject\_gmail\_recipient(inputs: dict) \-\> dict:  
    """Injects a fixed recipient email into the inputs."""  
    \# Get the recipient from app logic, context, or hardcode it  
    inputs\["recipient\_email"\] \= "fixed.recipient@example.com"  
    \# Ensure subject exists, providing a default if necessary  
    inputs\["subject"\] \= inputs.get("subject", "No Subject Provided")  
    return inputs

\# Combine schema processing and preprocessing  
processed\_tools \= toolset.get\_tools(  
    actions=\[Action.GMAIL\_SEND\_EMAIL\],  
    processors={  
        "schema": {Action.GMAIL\_SEND\_EMAIL: simplify\_gmail\_send\_schema},  
        "pre": {Action.GMAIL\_SEND\_EMAIL: inject\_gmail\_recipient}  
    }  
)

\# Now, when the LLM calls this tool (without providing recipient\_email),  
\# the 'inject\_gmail\_recipient' function will run automatically  
\# before Composio executes the action, adding the correct email.  
\# result \= toolset.handle\_tool\_calls(llm\_response\_using\_processed\_tools)  
\`\`\`

\<Tip title="Schema vs. Preprocessing"\>  
Think of \`schema\` processing as changing the \*\*tool's instructions\*\* for the LLM, while \`pre\` processing adjusts the \*\*actual inputs\*\* right before execution based on those instructions (or other logic).  
\</Tip\>

\#\# Postprocessing (\`post\`)

\*\*Goal:\*\* Modify the result returned by the tool's execution \*before\* it is passed back.

This is invaluable for filtering large or complex API responses to extract only the necessary information, reducing the number of tokens sent back to the LLM, improving clarity, and potentially lowering costs.

\*\*Example: Filtering \`GMAIL\_FETCH\_EMAILS\` Response\*\*

The \`GMAIL\_FETCH\_EMAILS\` action can return a lot of data per email. Let's filter the response to include only the \`sender\` and \`subject\`, significantly reducing the payload sent back to the LLM.

\`\`\`python Python  
import json \# For pretty printing example output

def filter\_email\_results(result: dict) \-\> dict:  
    """Filters email list to only include sender and subject."""  
    \# Pass through errors or unsuccessful executions unchanged  
    if not result.get("successful") or "data" not in result:  
        return result

    original\_messages \= result\["data"\].get("messages", \[\])  
    if not isinstance(original\_messages, list):  
        return result \# Return if data format is unexpected

    filtered\_messages \= \[\]  
    for email in original\_messages:  
        filtered\_messages.append({  
            "sender": email.get("sender"),  
            "subject": email.get("subject"),  
        })

    \# Construct the new result dictionary  
    processed\_result \= {  
        "successful": True,  
        \# Use a clear key for the filtered data  
        "data": {"summary": filtered\_messages},  
        "error": None  
    }  
    return processed\_result

\# Get tools with the postprocessor  
processed\_tools \= toolset.get\_tools(  
    actions=\[Action.GMAIL\_FETCH\_EMAILS\],  
    processors={  
        "post": {Action.GMAIL\_FETCH\_EMAILS: filter\_email\_results}  
    }  
)

\# \--- Simulate Execution and Postprocessing \---  
\# Assume 'raw\_execution\_result' is the large dictionary returned by  
\# executing GMAIL\_FETCH\_EMAILS without postprocessing.  
\# raw\_execution\_result \= toolset.execute\_action(Action.GMAIL\_FETCH\_EMAILS, params={...})

\# Apply the postprocessor manually to see the effect (handle\_tool\_calls does this automatically)  
\# filtered\_result \= filter\_email\_results(raw\_execution\_result)  
\# print("Filtered Result (much smaller for LLM):")  
\# print(json.dumps(filtered\_result, indent=2))  
\`\`\`

By using postprocessing, you can make tool results much more manageable and useful for the LLM, preventing context overflow and focusing its attention on the most relevant information.

\---  
title: Adding Your Own App  
\---  
\#\# OpenAPI based Apps and Tools

Composio supports installing \[custom apps and tools\](https://app.composio.dev/custom\_tools) based on an OpenAPI specification.

Make sure to have \`info\` section in your OpenAPI Specification. In the info section, you should have the following fields:

\* \`title\`: Name of the tool  
\* \`version\`: Version of the tool/spec

\#\#\# Integration YAML Configuration

This README provides an overview of the \`integration.yaml\` file structure used for configuring app integrations, with a focus on custom fields.

\#\#\# YAML Structure

The \`integration.yaml\` file typically includes the following key sections:

1\. \*\*Basic Information\*\*  
   \* \`name\`: App name  
   \* \`unique\_key\`: Unique identifier for the app  
   \* \`description\`: Brief description of the app  
   \* \`logo\`: URL to the app's logo  
   \* \`categories\`: List of categories the app belongs to. Examples include:  
     \* productivity  
     \* marketing  
     \* social  
     \* crm  
   \* \`docs\`: Link to the app's documentation

2\. \*\*Authentication Schemes\*\*  
   \* \`auth\_schemes\`: List of authentication methods supported  
     \* \`name\`: Name of the auth scheme  
     \* \`auth\_mode\`: Authentication mode (Supported modes: OAUTH2, BASIC, API\\\_KEY, OAUTH1)  
     \* For OAuth2:  
       \* \`authorization\_url\`: OAuth authorization URL  
       \* \`token\_url\`: Token endpoint URL  
       \* \`default\_scopes\`: Default OAuth scopes  
       \* \`available\_scopes\`: List of all available scopes  
       \* \`authorization\_params\`: Additional parameters for authorization (e.g., \`response\_type\`, \`user\_scopes\`)  
     \* For OAuth1:  
       \* \`authorization\_url\`: OAuth authorization URL  
       \* \`request\_url\`: Request token URL  
       \* \`token\_url\`: Access token URL  
       \* \`signature\_method\`: Signature method (e.g., HMAC-SHA1)  
       \* \`default\_scopes\`: Default OAuth scopes  
       \* \`scope\_separator\`: Character used to separate scopes  
     \* For API Key:  
       \`\`\`yaml  
       proxy:  
         base\_url: "{{base\_url}}"  
         headers:  
           Authorization: "{{api\_key}}"  
       \`\`\`  
     \* For Basic Auth:  
       \`username\` and \`password\` fields are required. You can use them in the proxy/header section directly like:  
       \`\`\`yaml  
       proxy:  
         headers:  
           username: "{{username}}"  
           password: "{{password}}"  
       \`\`\`

3\. \*\*Endpoints\*\*  
   \* \`get\_current\_user\_endpoint\`: Endpoint for retrieving current user info. This is used to check if the auth is valid and refresh the token if it is expired.

4\. \*\*Custom Fields\*\*  
   Custom fields are defined within the \`auth\_schemes\` section and provide additional configuration options for the integration. They are typically found under the \`fields\` key of an auth scheme.

   Common attributes for custom fields include:

   \* \`name\`: Unique identifier for the field  
   \* \`display\_name\`: Human-readable name for the field  
   \* \`description\`: Detailed explanation of the field's purpose  
   \* \`type\`: Data type of the field (e.g., string, boolean)  
   \* \`required\`: Whether the field is mandatory  
   \* \`expected\_from\_customer\`: Indicates if the end customer needs to provide this information  
   \* \`default\`: Default value for the field (if applicable)

   Examples of custom fields:

   a. API Key field:

   \`\`\`yaml  
   fields:  
     \- name: api\_key  
       display\_name: API Key  
       description: "Your API key for authentication."  
       type: string  
       required: true  
       expected\_from\_customer: true  
   \`\`\`

   b. Instance URL field (e.g., for Salesforce):

   \`\`\`yaml  
   fields:  
     \- name: instanceUrl  
       display\_name: Instance URL  
       description: "The base URL for your instance, used for API requests."  
       type: string  
       required: true  
       expected\_from\_customer: true  
   \`\`\`

   c. Subdomain field (e.g., for PostHog):

   \`\`\`yaml  
   fields:  
     \- name: subdomain  
       display\_name: Sub Domain  
       description: "Your PostHog subdomain (e.g., 'app' for app.posthog.com)."  
       type: string  
       required: true  
       default: "app"  
   \`\`\`

5\. \*\*Additional Configuration\*\*

   \* \`callback\_url\`: URL for OAuth callback  
   \* \`token\_response\_metadata\`: List of metadata fields expected in the token response  
   \* \`proxy\`: Configuration for API request proxying. This section defines the data to be used in the request. It can use the fields defined via jinja templating \`{{field\_name}}\`. It can include:  
     \* \`base\_url\`: The base URL for API requests  
     \* \`headers\`: Custom headers to be included in the request  
     \* \`query\_params\`: Custom query parameters to be included in the request  
     \* \`path\_params\`: Custom path parameters to be included in the request

   Example of a proxy configuration:

   \`\`\`yaml  
   proxy:  
     base\_url: "https://api.example.com/v1"  
     headers:  
       Authorization: "Bearer {{access\_token}}"  
       Content-Type: "application/json"  
     query\_params:  
       api\_key: "{{api\_key}}"  
   \`\`\`

   In this example, \`{{access\_token}}\` and \`{{api\_key}}\` are placeholders that will be replaced with actual values from the authentication process or custom fields.

\#\#\# Usage of Custom Fields

Custom fields are used to gather necessary information from users or provide default configurations for the integration. They can be referenced in other parts of the configuration using placeholders, typically in the format \`{{field\_name}}\`.

\---  
title: Introduction  
subtitle: Securely connect your AI agents to user accounts on external apps  
\---

AI agents often need to perform actions on behalf of users like;  
\- sending an email from their Gmail  
\- creating an issue in their Jira  
\- or posting to their Slack

Doing this securely requires handling complex authentication flows like OAuth 2.0, managing API keys, storing sensitive tokens, and refreshing credentials. This distracts from building the core agent logic.

Let's see how Composio Auth works in a basic example where we connect a user to their GitHub account.

\#\# Quickstart with Composio Auth

\*\*1. Identify the User (Entity) & App\*\*

Composio lets you specify a unique \`entity\_id\` for each user in your application. This is the user's identifier in your application.

\<CodeGroup\>  
\`\`\`python Python  
\# User identifier from your application  
user\_id\_in\_my\_app \= "user-alice-456"    \# Can be UUID from DB  
app\_to\_connect \= "github" \# The app key  
\`\`\`  
\`\`\`typescript TypeScript  
// User identifier from your application  
const userIdInMyApp \= "user-alice-456"; // Can be UUID from DB  
const appToConnect \= "github"; // The app key  
\`\`\`  
\</CodeGroup\>

\*\*2. Initiate the Connection\*\*

You'll need the \`integration\_id\` for the app (which you typically set up once \- see \[Integrations\](/auth/set-up-integrations)) and the \`entity\_id\` you specified for your user.

\<CodeGroup\>  
\`\`\`python Python  
from composio\_openai import ComposioToolSet, Action \# Or framework-specific ToolSet

toolset \= ComposioToolSet()  
entity \= toolset.get\_entity(id=user\_id\_in\_my\_app) \# Get Entity object

print(f"Initiating GitHub connection for entity: {entity.id}")  
\# Initiate connection using the app's Integration and the user's Entity ID  
connection\_request \= entity.initiate\_connection(app\_name=app\_to\_connect)

\# Composio returns a redirect URL for OAuth flows  
if connection\_request.redirectUrl:  
    print(f"Please direct the user to visit: {connection\_request.redirectUrl}")  
\`\`\`  
\`\`\`typescript TypeScript  
import { OpenAIToolSet } from "composio-core"; // Or framework-specific ToolSet

// Assume GITHUB\_INTEGRATION\_ID is fetched from config/env  
const GITHUB\_INTEGRATION\_ID \= "int\_xxxxxxxx...";  
const toolset \= new OpenAIToolSet(); // Or other ToolSet

async function initiate() {  
    const entity \= await toolset.getEntity(userIdInMyApp); // Get Entity object

    console.log(\`Initiating GitHub connection for entity: ${entity.id}\`);  
    // Initiate connection using the app's Integration and the user's Entity ID  
    const connectionRequest \= await entity.initiateConnection({  
        appName: appToConnect  
    });

    // Composio returns a redirect URL for OAuth flows  
    if (connectionRequest.redirectUrl) {  
        console.log(\`Please direct the user to visit: ${connectionRequest.redirectUrl}\`);  
    }  
}

initiate();  
\`\`\`  
\</CodeGroup\>

\*\*3. Wait for Connection Activation (OAuth)\*\*

For OAuth flows, the user needs to visit the \`redirectUrl\` and authorize the connection. Your application can wait for the connection to become active.

\<CodeGroup\>  
\`\`\`python Python  
\# Wait for the user to complete the OAuth flow in their browser  
print("Waiting for connection to become active...")  
try:  
    \# This polls until the connection status is ACTIVE or timeout occurs  
    active\_connection \= connection\_request.wait\_until\_active(  
        client=toolset.client, \# Pass the underlying client  
        timeout=120 \# Wait for up to 2 minutes  
    )  
    print(f"Connection successful\! ID: {active\_connection.id}")  
    \# Store active\_connection.id associated with user\_id\_in\_my\_app  
except Exception as e:  
    print(f"Connection timed out or failed: {e}")  
\`\`\`  
\`\`\`typescript TypeScript  
async function waitForActive(connectionRequest: ConnectionRequest) { // Assuming connectionRequest from step 2  
    console.log("Waiting for connection to become active...");  
    try {  
        // This polls until the connection status is ACTIVE or timeout occurs  
        const activeConnection \= await connectionRequest.waitUntilActive(120); // Wait up to 2 minutes  
        console.log(\`Connection successful\! ID: ${activeConnection.id}\`);  
        // Store activeConnection.id associated with userIdInMyApp  
    } catch (e) {  
        console.error("Connection timed out or failed:", e);  
    }  
}

// You would call waitForActive after the user interaction is expected  
// Example call (needs connectionRequest object from previous step):  
waitForActive(connectionRequest);  
\`\`\`  
\</CodeGroup\>

\*\*4. Execute Actions Using the Connection\*\*

Once the connection is active, you (or realistically, an agent) can execute actions for that app \*on behalf of that specific user\* by providing their \`entity\_id\`

\<CodeGroup\>  
\`\`\`python Python  
\# Execute using the user's entity\_id (Composio finds the right connection)  
print(f"\\nFetching GitHub username for entity: {user\_id\_in\_my\_app}")  
user\_info \= toolset.execute\_action(  
    action=Action.GITHUB\_GET\_THE\_AUTHENTICATED\_USER,  
    params={},  
    entity\_id=user\_id\_in\_my\_app \# Specify the user context  
)

if user\_info.get("successful"):  
    print("GitHub username:", user\_info.get("data", {}).get("login"))  
else:  
    print("Failed to fetch user:", user\_info.get("error"))  
\`\`\`  
\`\`\`typescript TypeScript  
console.log(\`\\nFetching GitHub username for entity: ${userIdInMyApp}\`);  
try {  
    const user\_info \= await toolset.executeAction({  
        action: Action.GITHUB\_GET\_THE\_AUTHENTICATED\_USER,  
        params: {},  
        entityId: userIdInMyApp // Specify the user context  
        // Or use connectionId if you have it and need precision:  
        // connectedAccountId: activeConnection?.id  
    });

    if (user\_info.successful) {  
        console.log("GitHub username:", (user\_info.data as any)?.login);  
    } else {  
        console.error("Failed to fetch user:", user\_info.error);  
    }  
} catch (error) {  
    console.error("Error during execution:", error);  
}  
\`\`\`  
\</CodeGroup\>

Alternatively, you can execute actions directly using the connection ID if you have it:  
\<CodeGroup\>  
\`\`\`python  
user\_info\_direct \= toolset.execute\_action(  
    action=Action.GITHUB\_GET\_THE\_AUTHENTICATED\_USER,  
    params={},  
    connected\_account\_id=active\_connection.id  
)  
\`\`\`  
\`\`\`typescript TypeScript  
const user\_info\_direct \= await toolset.executeAction({  
    action: Action.GITHUB\_GET\_THE\_AUTHENTICATED\_USER,  
    params: {},  
    connectedAccountId: activeConnection.id  
});  
\`\`\`  
\</CodeGroup\>

This flow demonstrates how Composio uses \*\*Integrations\*\* (app config), \*\*Entities\*\* (your users), and \*\*Connections\*\* (the secure link between them) to simplify authenticated interactions for your AI agents.

\!\[Composio Auth Concepts Diagram\](file:528a9787-280b-4eaa-b9db-e48998f41b06)

\<AccordionGroup\>  
  \<Accordion title="Full Runnable Example Code"\>  
    \<CodeGroup\>  
      \`\`\`python Python  
      \# filename: connect\_and\_fetch\_github.py  
      from composio\_openai import ComposioToolSet, Action, App  
      from dotenv import load\_dotenv  
      import os  
      import sys  
      import time

      \# Load environment variables from .env file  
      \# Ensure COMPOSIO\_API\_KEY is set  
      load\_dotenv()

      def run\_auth\_flow():  
          \# \--- 1\. Identify User & App \---  
          user\_id\_in\_my\_app \= "user-quickstart-py-example" \# Example user ID  
          app\_to\_connect \= App.GITHUB \# Use Enum for clarity

          print(f"--- Starting GitHub connection for Entity: {user\_id\_in\_my\_app} \---")

          toolset \= ComposioToolSet()  
          entity \= toolset.get\_entity(id=user\_id\_in\_my\_app)

          active\_connection \= None \# Initialize variable

          try:  
              \# \--- 2\. Initiate Connection \---  
              print(f"Initiating {app\_to\_connect.value} connection...")  
              \# Use app\_name; SDK finds appropriate integration  
              connection\_request \= entity.initiate\_connection(app\_name=app\_to\_connect)

              \# \--- 3\. Handle Redirect & Wait for Activation (OAuth) \---  
              if connection\_request.redirectUrl:  
                  print("\\n\!\!\! ACTION REQUIRED \!\!\!")  
                  print(f"Please visit this URL to authorize the connection:\\n{connection\_request.redirectUrl}\\n")  
                  print("Waiting for connection to become active (up to 120 seconds)...")

                  try:  
                      \# Poll Composio until the connection is marked active  
                      active\_connection \= connection\_request.wait\_until\_active(  
                          client=toolset.client, \# Pass the underlying client  
                          timeout=120  
                      )  
                      print(f"\\nConnection successful\! ID: {active\_connection.id}")  
                      \# In a real app, you'd store active\_connection.id linked to user\_id\_in\_my\_app  
                  except Exception as e:  
                      print(f"Error waiting for connection: {e}", file=sys.stderr)  
                      print("Please ensure you visited the URL and approved the connection.")  
                      return \# Exit if connection failed

              else:  
                  \# Handle non-OAuth flows if needed (e.g., API Key where connection is instant)  
                  print("Connection established (non-OAuth flow). Fetching details...")  
                  \# Fetch the connection details using the ID from the request  
                  active\_connection \= toolset.client.connected\_accounts.get(connection\_id=connection\_request.connectedAccountId)  
                  if active\_connection.status \!= "ACTIVE":  
                       print(f"Connection is not active (Status: {active\_connection.status}). Exiting.", file=sys.stderr)  
                       return

              \# \--- 4\. Execute Action \---  
              if active\_connection and active\_connection.status \== "ACTIVE":  
                  print(f"\\nExecuting action using connection ID: {active\_connection.id}")  
                  print(f"Fetching GitHub username for entity: {user\_id\_in\_my\_app}...")

                  user\_info \= toolset.execute\_action(  
                      action=Action.GITHUB\_GET\_THE\_AUTHENTICATED\_USER,  
                      params={},  
                      \# Provide context via entity\_id (recommended)  
                      entity\_id=user\_id\_in\_my\_app  
                      \# OR precisely target the connection (if ID was stored)  
                      \# connected\_account\_id=active\_connection.id  
                  )

                  print("\\n--- Execution Result \---")  
                  if user\_info.get("successful"):  
                      username \= user\_info.get("data", {}).get("login", "N/A")  
                      print(f"Successfully fetched GitHub username: {username}")  
                  else:  
                      print(f"Failed to fetch user info: {user\_info.get('error', 'Unknown error')}")  
                  \# import json  
                  \# print("\\nFull response:")  
                  \# print(json.dumps(user\_info, indent=2))  
              else:  
                   print("\\nSkipping action execution as connection is not active.")

          except Exception as e:  
              print(f"\\nAn unexpected error occurred: {e}", file=sys.stderr)

      if \_\_name\_\_ \== "\_\_main\_\_":  
          run\_auth\_flow()  
      \`\`\`  
      \`\`\`typescript TypeScript  
      // filename: connectAndFetchGithub.ts  
      import { OpenAIToolSet, Action, App, ConnectionRequest } from "composio-core";  
      import dotenv from "dotenv";

      // Load environment variables from .env file  
      // Ensure COMPOSIO\_API\_KEY is set  
      dotenv.config();

      // Helper function to introduce delay  
      const sleep \= (ms: number) \=\> new Promise(resolve \=\> setTimeout(resolve, ms));

      async function main() { // Renamed to main for standard practice  
          // \--- 1\. Identify User & App \---  
          const userIdInMyApp \= "user-quickstart-ts-example"; // Example user ID  
          const appToConnect \= App.GITHUB; // Use Enum

          console.log(\`--- Starting GitHub connection for Entity: ${userIdInMyApp} \---\`);

          const toolset \= new OpenAIToolSet(); // Initialize ToolSet  
          let connectionRequest: ConnectionRequest | null \= null;  
          let activeConnection: any \= null; // Initialize variable

          try {  
              const entity \= await toolset.getEntity(userIdInMyApp);

              // \--- 2\. Initiate Connection \---  
              console.log(\`Initiating ${appToConnect} connection...\`);  
              // Use appName; SDK finds appropriate integration  
              connectionRequest \= await entity.initiateConnection({  
                  appName: appToConnect,  
              });

              // \--- 3\. Handle Redirect & Wait for Activation (OAuth) \---  
              if (connectionRequest?.redirectUrl) {  
                  console.log("\\n\!\!\! ACTION REQUIRED \!\!\!");  
                  console.log(\`Please visit this URL to authorize the connection:\\n${connectionRequest.redirectUrl}\\n\`);  
                  console.log("Waiting for connection to become active (up to 120 seconds)...");

                  try {  
                      // Poll Composio until the connection is marked active  
                      activeConnection \= await connectionRequest.waitUntilActive(120); // Wait up to 120 seconds  
                      console.log(\`\\nConnection successful\! ID: ${activeConnection.id}\`);  
                      // In a real app, you'd store activeConnection.id linked to userIdInMyApp  
                  } catch (e) {  
                      console.error("Error waiting for connection:", e);  
                      console.error("Please ensure you visited the URL and approved the connection.");  
                      return; // Exit if connection failed  
                  }  
              } else if (connectionRequest?.connectedAccountId) {  
                   // Handle non-OAuth flows if needed  
                   console.log("Connection established (non-OAuth flow). Fetching details...");  
                   // Wait a moment for backend processing if needed, then fetch details  
                   await sleep(2000); // Small delay might be needed  
                   activeConnection \= await toolset.client.connectedAccounts.get({  
                       connectedAccountId: connectionRequest.connectedAccountId  
                   });  
                    if (activeConnection.status \!== "ACTIVE") {  
                       console.error(\`Connection is not active (Status: ${activeConnection.status}). Exiting.\`);  
                       return;  
                    }  
                    console.log(\`Connection active\! ID: ${activeConnection.id}\`);  
              } else {  
                   console.error("Failed to initiate connection properly.");  
                   return;  
              }

              // \--- 4\. Execute Action \---  
              if (activeConnection && activeConnection.status \=== "ACTIVE") {  
                  console.log(\`\\nExecuting action using connection ID: ${activeConnection.id}\`);  
                  console.log(\`Fetching GitHub username for entity: ${userIdInMyApp}...\`);

                  const user\_info \= await toolset.executeAction({  
                      action: Action.GITHUB\_GET\_THE\_AUTHENTICATED\_USER, // Use Enum  
                      params: {},  
                      // Provide context via entityId (recommended)  
                      entityId: userIdInMyApp  
                      // OR precisely target the connection (if ID was stored)  
                      // connectedAccountId: activeConnection.id  
                  });

                  console.log("\\n--- Execution Result \---");  
                  if (user\_info.successful) {  
                      const username \= (user\_info.data as any)?.login ?? "N/A";  
                      console.log(\`Successfully fetched GitHub username: ${username}\`);  
                  } else {  
                      console.error(\`Failed to fetch user info: ${user\_info.error ?? 'Unknown error'}\`);  
                  }  
                  // console.log("\\nFull response:");  
                  // console.log(JSON.stringify(user\_info, null, 2));

              } else {  
                   console.log("\\nSkipping action execution as connection is not active.");  
              }

          } catch (error) {  
              console.error("\\nAn unexpected error occurred:", error);  
          }  
      }

      // Run the async function  
      main();  
      \`\`\`  
    \</CodeGroup\>  
  \</Accordion\>  
\</AccordionGroup\>

\---  
title: Integrations Setup  
subtitle: Configure external apps to prepare them for user connections  
\---

An \*\*Integration\*\* is the developer-level configuration within Composio for a specific external app (like GitHub, Slack, Google Calendar). It acts as the \*\*blueprint\*\* defining \*how\* Composio should interact with that app, including its authentication method (OAuth, API Key, etc.) and API details.

\*   Integrations \*\*do not\*\* store individual user credentials.  
\*   You typically \*\*create an Integration once per app\*\*, per environment (e.g., one for development, one for production).  
\*   The main outcome is obtaining a unique \*\*\`integration\_id\`\*\*, which you'll use later to \[connect your users\](/auth/connection).

\#\# Creating an Integration

You can set up Integrations via the Composio Dashboard (recommended for visual configuration) or the CLI.

\<Tabs\>  
\<Tab title="Dashboard (Recommended)"\>  
The dashboard offers a guided process for all app types.

\<Steps\>  
\<Step title="Select App"\>  
Navigate to the \[Apps page\](https://app.composio.dev/apps) and choose the app you want to integrate (e.g., Slack).  
\<Frame background="subtle" title="Application Selection Screen"\>  
  \<img src="file:8265e495-977e-4ecf-8cbf-7e10e42b7aa8" /\>  
\</Frame\>  
\</Step\>  
\<Step title="Initiate Setup"\>  
Click the \*\*"Setup Integration"\*\* button.  
\<Frame background="subtle" title="Integration Setup Interface"\>  
  \<img src="file:d9e54742-8f67-4118-93c0-15e594cfc11b" /\>  
\</Frame\>  
\</Step\>  
\<Step title="Configure Integration Settings (If Required)"\>  
The next steps depend on the app's authentication method:

\- \*\*For OAuth 2.0 Apps:\*\* You'll need to decide whether to use Composio's default OAuth app or your own developer credentials. For more details, see \*\*\[Handling OAuth Connections\](/auth/connection/oauth)\*\* and \*\*\[White-labelling\](/auth/white-labelling)\*\*.  
\- \*\*For API Key/Token Apps:\*\* The keys are typically provided by the end-user later in the connection flow. See \*\*\[Handling API Key Connections\](/auth/connection/non-oauth)\*\* for that process.

You might also configure default scopes or API base URLs here if applicable.  
\</Step\>  
\<Step title="(Optional) Limit Actions"\>  
You can restrict which specific tools (actions) are enabled for this Integration, providing an extra layer of security.  
\<Frame background="subtle" title="Action Limitation Configuration"\>  
  \<img src="file:27eadd5d-c8ec-4077-8cbf-85018d5eb48c" /\>  
\</Frame\>  
\</Step\>  
\<Step title="Create and Get ID"\>  
Click \*\*"Create Integration"\*\*. After creation, \*\*copy the displayed \`integration\_id\`\*\*. You'll need this ID in your application code.

\<Info\>  
Ensure you save the \`integration\_id\` in a secrets manager or environment variable for later use.  
\</Info\>  
\</Step\>  
\</Steps\>  
\</Tab\>

\<Tab title="CLI"\>  
The \`composio add \<app\>\` command provides an interactive setup, usually defaulting to the simplest configuration (like using Composio's shared OAuth app).

\`\`\`bash CLI Example  
\# Add a Slack integration using defaults  
composio add slack  
\`\`\`  
Follow the prompts, which may include browser authentication for OAuth apps. Upon success, the CLI will output the \*\*\`integration\_id\`\*\*.

\`\`\`bash Output Example  
\# ... authentication steps ...  
\# ✔ slack added successfully with ID: int\_abc123def456...  
\`\`\`  
\<Note\>  
Setting up integrations with custom credentials (like your own OAuth app) via the CLI might be less straightforward than using the Dashboard. Use the Dashboard for complex configurations.  
\</Note\>  
\</Tab\>

\<Tab title="Code (Advanced)"\>  
Programmatic creation is useful for infrastructure-as-code or dynamic setups. Use \`create\_integration\` (Python) or \`integrations.create\` (TypeScript).

This example creates a basic integration using Composio's default settings where applicable (like for OAuth).

\<CodeGroup\>  
\`\`\`python Python  
from composio\_openai import App, ComposioToolSet

toolset \= ComposioToolSet()

integration \= toolset.create\_integration(  
    app=App.GITHUB,  
    auth\_mode="OAUTH2",  
    use\_composio\_oauth\_app=True,  
    \# For use\_composio\_oauth\_app=False, you can provide your own OAuth app credentials here  
    \# auth\_config={  
    \#     "client\_id": "123456",  
    \#     "client\_secret": "123456"  
    \# }  
)  
print(integration.id)

\`\`\`  
\`\`\`typescript TypeScript  
import { OpenAIToolSet } from "composio-core";

const composioToolset \= new OpenAIToolSet();

const integration \= await composioToolset.integrations.create({  
    name: "gmail\_integration",  
    appUniqueKey: "gmail",  
    useComposioAuth: true,  
    forceNewIntegration: true,  
})

console.log(integration.id)  
\`\`\`  
\</CodeGroup\>  
\<Info\>  
For details on providing specific \`auth\_config\` parameters programmatically (e.g., for custom OAuth or other schemes), consult the \[SDK Reference\](/sdk-reference/) and the relevant guides like \[Handling OAuth\](/auth/connection/oauth) or \[White-labelling\](/auth/white-labelling).  
\</Info\>  
\</Tab\>  
\</Tabs\>

\#\# Using the Integration ID

The key outcome of this setup process is the \*\*\`integration\_id\`\*\*. This unique identifier represents the specific configuration you've created for an app within Composio.

You will use this \`integration\_id\` in the next step to initiate the authentication flow for your end-users.

➡️ \*\*Next: \[Connecting Users Overview\](/auth/connection/)\*\*

\---  
title: Connecting Users Overview  
subtitle: Establishing Secure Connections for User Authorization  
\---

After \[setting up an Integration\](/auth/integrations) for an external app, the next step is to enable your individual end-users to authorize Composio to act on their behalf. This process creates a \*\*Connection\*\*.

It securely stores the user-specific credentials (like OAuth tokens or API keys) obtained during the authorization process. Every authenticated action executed via Composio happens through one of these Connections.

\#\# Identifying Your User: The \`entity\_id\`

A fundamental concept when creating Connections is the \`entity\_id\`.

\- \*\*What:\*\* A unique ID that represents \*your\* end-user within Composio. Can map to DB/UUID in your app.  
\- \*\*Why:\*\* It allows Composio to use the correct credentials for your end-user in multi-tenant scenarios.  
\- \*\*Default:\*\* Composio uses the default ID \`"default"\`. This is suitable only for single-user scripts, personal testing.

You will pass the \`entity\_id\` when initiating the connection process using the SDK, typically by first getting an \`Entity\` object:

\<CodeGroup\>  
\`\`\`python Python  
from composio\_openai import ComposioToolSet, Action, App

toolset \= ComposioToolSet()  
user\_identifier\_from\_my\_app \= "user\_7a9f3b\_db\_id" \# Example

\# Get the Composio Entity object for your user  
entity \= toolset.get\_entity(id=user\_identifier\_from\_my\_app)  
\# Use this 'entity' object to initiate connections  
\`\`\`  
\`\`\`typescript TypeScript  
import { OpenAIToolSet } from "composio-core";

const toolset \= new OpenAIToolSet();  
const userIdentifierFromMyApp \= "user\_7a9f3b\_db\_id"; // Example

// Get the Composio Entity object for your user  
const entity \= await toolset.getEntity(userIdentifierFromMyApp);  
// Use this 'entity' object to initiate connections

\`\`\`  
\</CodeGroup\>

\#\# Initiating a Connection (Conceptual)

The process generally starts by calling \`initiate\_connection\` (Python) or \`initiateConnection\` (TS) on the \`entity\` object, providing the \`integration\_id\` or \`app\_name\`.

\<CodeGroup\>  
\`\`\`python Python  
\# Conceptual initiation \- details depend on auth type  
connection\_request \= toolset.initiate\_connection(  
    integration\_id=YOUR\_INTEGRATION\_ID, entity\_id=user\_identifier\_from\_my\_app  
)  
\# or  
connection\_request \= toolset.initiate\_connection(  
    app\_name=App.GITHUB, entity\_id=user\_identifier\_from\_my\_app  
)

toolset.execute\_action(  
    action=Action.GITHUB\_CREATE\_AN\_ISSUE, params={...}, entity\_id=user\_identifier\_from\_my\_app  
)

toolset.execute\_action(  
    action=Action.GITHUB\_CREATE\_AN\_ISSUE,  
    params={...},  
    entity\_id=user\_identifier\_from\_my\_app  
)  
\`\`\`  
\`\`\`typescript TypeScript  
// Conceptual initiation \- details depend on auth type  
const connectionRequest \= await toolset.connectedAccounts.initiate({  
  integrationId: YOUR\_INTEGRATION\_ID,  
});  
// or  
// const connectionRequest \= await entity.initiateConnection({ appName: "github" });

toolset.executeAction({  
  action: "GITHUB\_CREATE\_AN\_ISSUE",  
  params: {},  
  entityId: userIdentifierFromMyApp  
});  
\`\`\`  
\</CodeGroup\>

The specific steps that follow (handling redirects, waiting for activation, or providing parameters) depend heavily on whether the app uses OAuth or requires user-provided tokens.

\*\*Follow the detailed guides for your specific scenario:\*\*

\*   \*\*\[Connecting to OAuth Apps\](/auth/connect/oauth)\*\*  
\*   \*\*\[Connecting to Token/API Key Apps\](/auth/connect/non-oauth)\*\*

\#\# Managing Existing Connections

Once connections are established, you can retrieve and manage them using the SDK.

\#\#\# \*\*List Connections for a User\*\*   
Get all active connections associated with a specific \`entity\_id\`.  
    \<CodeGroup\>  
    \`\`\`python Python wordWrap  
    user\_identifier\_from\_my\_app \= "user\_7a9f3b\_db\_id"  \# Example  
    entity \= toolset.get\_entity(id=user\_identifier\_from\_my\_app)  
    try:  
        connections \= toolset.get\_connected\_accounts(entity\_id=user\_identifier\_from\_my\_app) \# Returns list of active connections  
        print(f"Found {len(connections)} active connections for {entity.id}:")  
        for conn in connections:  
            print(f"- App: {conn.appName}, ID: {conn.id}, Status: {conn.status}")  
        \# You can also filter directly via the client:  
        \# connections \= toolset.client.connected\_accounts.get(entity\_ids=\[entity.id\], active=True)  
    except Exception as e:  
        print(f"Error fetching connections: {e}")  
    \`\`\`  
    \`\`\`typescript TypeScript wordWrap  
    const entity \= await toolset.getEntity(userIdentifierFromMyApp);  
    const connections \= await toolset.connectedAccounts.list({  
        entityId: entity.id,  
    }); // Returns list of active connections  
    console.log(  
        \`Found ${connections.items.length} active connections for ${entity.id}:\`  
    );  
    connections.items.forEach((conn) \=\> {  
        console.log(\`- App: ${conn.appName}, ID: ${conn.id}, Status: ${conn.status}\`);  
    });  
    \`\`\`  
    \</CodeGroup\>

\#\#\# \*\*Get a Specific Connection\*\*   
Retrieve details using its unique \`connected\_account\_id\`.  
    \<CodeGroup\>  
    \`\`\`python Python wordWrap  
    connection\_id \= "1d28bbbb-91d0-4181-b4e5-088bab0d7779"

    connection \= toolset.get\_connected\_account(connection\_id)  
    print(f"Details for {connection.id}: App={connection.appName}, Status={connection.status}")  
    \`\`\`  
    \`\`\`typescript TypeScript wordWrap  
    const connectionId \= "1d28bbbb-91d0-4181-b4e5-088bab0d7779";

    const connection \= await toolset.connectedAccounts.get({  
        connectedAccountId: connectionId,  
    });  
    console.log(  
        \`Details for ${connection.id}: App=${connection.appName}, Status=${connection.status}\`  
    );  
    \`\`\`  
    \</CodeGroup\>

\---  
title: Connecting to OAuth Apps  
subtitle: 'Handle the user connection flow for apps like Google, GitHub, Slack'  
\---

This guide details the programmatic steps required to connect your users (Entities) to external applications that use \*\*OAuth 2.0\*\* for authorization (e.g., Google Workspace, GitHub, Slack, Salesforce).

This flow involves redirecting the user to the external service's login and consent screen in their browser.

\*\*Prerequisites:\*\*

\*   An \[Integration\](/auth/set-up-integrations) for the OAuth app must be configured in Composio, providing you with an \`integration\_id\`. Ensure it's set up correctly for OAuth (using Composio's shared app or your own credentials).  
\*   A unique \`entity\_id\` representing the user within your application.

\#\# OAuth Connection Flow

The process involves initiating the connection, redirecting the user for authorization, and then waiting for Composio to confirm the connection is active.

\#\#\# Step 1: Initiate the Connection

Use the \`initiate\_connection\` (Python) or \`initiateConnection\` (TypeScript) method on the user's \`Entity\` object. Provide the \`integration\_id\` for the OAuth app you configured.

\<CodeGroup\>  
\`\`\`python Python wordWrap  
from composio\_openai import ComposioToolSet, App

\# Assumes toolset is initialized  
toolset \= ComposioToolSet()  
user\_id \= "your\_user\_unique\_id"  
\# Get this from your Composio Integration setup  
google\_integration\_id \= "int\_google\_xxxxxxxx..."

entity \= toolset.get\_entity(id=user\_id)

try:  
    print(f"Initiating OAuth connection for entity {entity.id}...")  
    connection\_request \= toolset.initiate\_connection(  
        integration\_id=google\_integration\_id,  
        entity\_id=user\_id,  
        \# Optionally add: redirect\_url="https://yourapp.com/final-destination"  
        \# if you want user sent somewhere specific \*after\* Composio finishes.  
        \# Optional add: app=App.APP\_NAME  
    )

    \# Check if a redirect URL was provided (expected for OAuth)  
    if connection\_request.redirectUrl:  
        print(f"Received redirect URL: {connection\_request.redirectUrl}")  
    else:  
        print("Error: Expected a redirectUrl for OAuth flow but didn't receive one.")  
        \# Handle error: Maybe the integration is misconfigured?

    \# Store connection\_request.connectedAccountId if needed for Step 3 polling  
    \# connection\_id\_in\_progress \= connection\_request.connectedAccountId

except Exception as e:  
    print(f"Error initiating connection: {e}")  
\`\`\`  
\`\`\`typescript TypeScript  
import { OpenAIToolSet } from "composio-core";

// Assumes toolset is initialized  
const toolset \= new OpenAIToolSet();  
const userId \= "your\_user\_unique\_id";  
// Get this from your Composio Integration setup  
const googleIntegrationId \= "int\_google\_xxxxxxxx...";

console.log(\`Initiating OAuth connection for entity ${userId}...\`);  
const connectionRequest \= await toolset.connectedAccounts.initiate({  
    integrationId: googleIntegrationId,  
    entityId: userId,  
    // Optionally add: redirectUri: "https://yourapp.com/final-destination"  
    // if you want user sent somewhere specific \*after\* Composio finishes.  
});

// Check if a redirect URL was provided (expected for OAuth)  
if (connectionRequest?.redirectUrl) {  
    console.log(\`Received redirect URL: ${connectionRequest.redirectUrl}\`);  
    // Proceed to Step 2: Redirect the user  
    // Return or pass connectionRequest to the next stage  
} else {  
    console.error("Error: Expected a redirectUrl for OAuth flow but didn't receive one.");  
    // Handle error  
}  
\`\`\`  
\</CodeGroup\>

The key output here is the \`redirectUrl\`.

\#\#\# Step 2: Redirect the User

Your application \*\*must\*\* now direct the user's browser to the \`redirectUrl\` obtained in Step 1\.

\*   \*\*How:\*\* This typically involves sending an HTTP 302 Redirect response from your backend, or using \`window.location.href \= redirectUrl;\` in your frontend JavaScript.

The user will see the external service's login page (if not already logged in) followed by an authorization screen asking them to grant the permissions (scopes) defined in your Composio Integration.

\#\#\# Step 3: Wait for Connection Activation

After the user authorizes the app, the external service redirects back (typically to Composio's callback URL). Composio exchanges the authorization code for access/refresh tokens and securely stores them, marking the Connection as \`ACTIVE\`.

Your application needs to wait for this confirmation. Use the \`wait\_until\_active\` (Python) / \`waitUntilActive\` (TypeScript) method on the \`connection\_request\` object obtained in Step 1\.

\<CodeGroup\>  
\`\`\`python Python  
\# Assuming 'connection\_request' from Step 1

print("Waiting for user authorization and connection activation...")  
try:  
    \# Poll Composio until the status is ACTIVE  
    active\_connection \= connection\_request.wait\_until\_active(  
        client=toolset.client, \# Pass the Composio client instance  
        timeout=180 \# Wait up to 3 minutes (adjust as needed)  
    )  
    print(f"Success\! Connection is ACTIVE. ID: {active\_connection.id}")  
    \# Store active\_connection.id associated with your user (entity\_id)  
    \# Now ready for Step 4\.  
except Exception as e: \# Catches TimeoutError, etc.  
    print(f"Connection did not become active within timeout or failed: {e}")  
    \# Implement retry logic or inform the user  
\`\`\`  
\`\`\`typescript TypeScript  
// Assuming 'connectionRequest' from Step 1  
console.log("Waiting for user authorization and connection activation...");  
try {  
    // Poll Composio until the status is ACTIVE  
    const activeConnection \= await connectionRequest.waitUntilActive(180); // Wait up to 3 minutes

    console.log(\`Success\! Connection is ACTIVE. ID: ${activeConnection.id}\`);  
    // Store activeConnection.id associated with your user (entityId)  
    // Now ready for Step 4\.  
} catch (error) {  
    console.error("Connection did not become active within timeout or failed:", error);  
    // Implement retry logic or inform the user  
}  
\`\`\`  
\</CodeGroup\>

\#\#\# Step 4: Use the Connection

Once \`wait\_until\_active\` completes successfully, the Connection is ready. You can now use the \`entity\_id\` or the obtained \`active\_connection.id\` to \[execute actions\](/tool-calling/executing-tools) on behalf of this user for the connected app.

\#\#\# Step 5 (Optional): Refresh the Connection  
Sometimes, a user's connection to an external service might become invalid. This can happen if:  
\- The access token expires (though Composio handles automatic refresh for many OAuth 2.0 flows).  
\- The user revokes access permissions directly on the third-party service.

You may see errors like:  
\`\`\`  
Composio SDK while executing action 'GMAIL\_FETCH\_EMAILS':

{"status":400,"message":"Connected account is disabled","requestId":"000000000000","type":"BadRequestError","details":{}}  
\`\`\`

When a connection is invalid you need to guide the user through the authentication process again to re-establish a valid connection.

\<Note\>🚧 We don't currently support the ability to re-initiate connections using our Python SDK. You may use the \[\`v1/connections/reinitiate-connection\`\](/api-reference/api-reference/v-1/connections/reinitiate-connection) endpoint.\</Note\>

    \<CodeGroup\>  
    \`\`\`python Python   
    \# Create the connection using the same parameters.  
    user\_id \= "alice"   
    entity \= toolset.get\_entity(user\_id)  
    connection\_req \= entity.initiate\_connection(  
        app\_name=App.GMAIL,  
        entity\_id=user\_id,  
        \# You can use integration\_id as well  
        \# integration\_id=GMAIL\_INTEGRATION\_ID,  
        \# Add redirect\_url if needed for your app flow  
        \# redirect\_url="https://yourapp.com/post-auth"   
    )

    print(f"Please re-authenticate your Gmail account: {connection\_req.redirectUrl}")  
    print(f"Initial status: {connection\_req.connectionStatus}") \# Will likely be INITIATED  
    \`\`\`

    \`\`\`typescript TypeScript   
    const userId \= "alice";  
    const entity \= await toolset.getEntity(userId);

    const connectionReq \= await toolset.connectedAccounts.reinitiateConnection({  
      connectedAccountId: "00000000-0000-0000-0000-000000000000",  
      data: {},  
      redirectUri: "https://example.com/callback",  
    });  
      
    // Alternatively you can create a new connection altogether  
      
    const integrationId \= GMAIL\_INTEGRATION\_ID;   
    const connectionReq \= await entity.initiateConnection({  
        integrationId: integrationId,  
        // appName: "gmail"  
    });

    console.log(\`Please re-authenticate your Gmail account: ${connectionReq.redirectUrl}\`);  
    console.log(\`Initial status: ${connectionReq.connectionStatus}\`); // Will likely be INITIATED  
    \`\`\`  
    \`\`\`bash curl  
    curl \--location 'https://backend.composio.dev/api/v1/connectedAccounts/\<connectedAccountId\>/reinitiate' \\  
    \--header 'x-api-key: \<api\_key\>' \\  
    \--header 'Content-Type: application/json' \\  
    \--data '{  
        "data": {}  \# Data stays empty  
    }'  
    \`\`\`  
      
    \</CodeGroup\>

\---  
title: Connecting to Token/API Key Apps  
subtitle: 'Handle connections where users provide their own credentials (e.g., API Keys)'  
\---

This guide covers the connection process for external apps that use authentication methods like \*\*static API Keys\*\*, \*\*Bearer Tokens\*\*, or other credentials that the \*\*end-user must provide\*\* (e.g., OpenAI, Stripe, Twilio, many database connections).

Unlike OAuth, this flow doesn't typically involve redirecting the user's browser. Instead, your application securely collects the necessary credentials from the user and passes them to Composio during the connection setup.

\*\*Prerequisites:\*\*

\*   An \[Integration\](/auth/set-up-integrations) for the target app must be configured in Composio, specifying the correct authentication scheme (e.g., \`API\_KEY\`, \`BEARER\_TOKEN\`).  
\*   A unique \`entity\_id\` representing the user within your application.

\#\# Token/API Key Connection Flow

\*\*Step 1: Discover Required Fields\*\*

Before prompting your user, determine exactly which credentials they need to provide. Use \`get\_expected\_params\_for\_user\` (Python) or \`apps.getRequiredParamsForAuthScheme\` (TypeScript) to query Composio.

\<CodeGroup\>  
\`\`\`python Python wordWrap  
from composio\_openai import ComposioToolSet, App

toolset \= ComposioToolSet()

\# Replace with your actual integration ID  
YOUR\_INTEGRATION\_ID \= "int\_shopify\_xxxxxxxx..."

auth\_scheme\_for\_shopify \= "API\_KEY"  \# Check Integration config or Tool Directory  
try:  
    required\_info \= toolset.get\_expected\_params\_for\_user(  
        app=App.SHOPIFY, auth\_scheme=auth\_scheme\_for\_shopify, integration\_id=YOUR\_INTEGRATION\_ID  
    )  
    field\_names \= \[field\["name"\] for field in required\_info\["expectedInputFields"\]\]  
    print(f"Required fields for {App.SHOPIFY.value} ({auth\_scheme\_for\_shopify}): {field\_names}")  
    \# Use required\_info\["expectedInputFields"\] for descriptions to show the user  
except Exception as e:  
    print(f"Error fetching required params: {e}")

\`\`\`  
\`\`\`typescript TypeScript wordWrap  
import { OpenAIToolSet } from "composio-core";

const toolset \= new OpenAIToolSet();  
// Example: Find required fields for Stripe (which uses API Key)  
const appKey \= "SHOPIFY";  
const authSchemeForShopify \= "API\_KEY"; // Check Integration config or Tool Directory

try {  
  const requiredInfo \= await toolset.client.apps.getRequiredParamsForAuthScheme(  
    {  
      appId: appKey,  
      authScheme: authSchemeForShopify,  
    }  
  );  
  const fieldNames \= requiredInfo.required\_fields;  
  console.log(  
    \`Required fields for ${appKey} (${authSchemeForShopify}): ${fieldNames}\`  
  );  
  // Example Output for Stripe: \['api\_key'\]  
  // Use requiredInfo.fields for descriptions to show the user  
} catch (error) {  
  console.error("Error fetching required params:", error);  
}  
\`\`\`  
\</CodeGroup\>

This tells your application which fields (e.g., \`api\_key\`, \`account\_sid\`, \`token\`) to request from the user.

\*\*Step 2: Securely Collect Credentials from User\*\*

Your application's UI must now prompt the user to enter the credentials identified in Step 1\.

\<Warning title="Handle Credentials Securely"\>  
Always transmit credentials over HTTPS. Avoid storing them unnecessarily client-side. Mask input fields for keys/tokens. \*\*Never log raw credentials.\*\*  
\</Warning\>

\*\*Step 3: Initiate Connection with User Credentials\*\*

Call \`initiate\_connection\` (Python) or \`initiateConnection\` (TypeScript) on the user's \`Entity\` object. Provide the \`integration\_id\` (or \`app\_name\`) and \`entity\_id\`. Crucially, pass the credentials collected from the user inside the \`connected\_account\_params\` (Python) or \`connectionParams\` (TypeScript) dictionary.

\<CodeGroup\>  
\`\`\`python Python wordWrap  
user\_id \= "user\_shopify\_456"

\# Assume user provided this value securely via your UI  
user\_provided\_shopify\_key \= "sk\_live\_xxxxxxxxxxxxxxx"

\# Assume entity and integration ID are known  
\# entity \= toolset.get\_entity(id="user\_stripe\_456")  
SHOPIFY\_INTEGRATION\_ID \= "int\_shopify\_yyyyyyyy..."

try:  
    print(f"Initiating Shopify connection for entity {user\_id}...")  
    connection\_request \= toolset.initiate\_connection(  
        integration\_id=SHOPIFY\_INTEGRATION\_ID, \# Or app\_name=App.SHOPIFY  
        entity\_id=user\_id,  
        auth\_scheme="API\_KEY", \# Must match the integration's config  
        \# Pass the user-provided key(s) here  
        connected\_account\_params={  
            "api\_key": user\_provided\_shopify\_key  
            \# Add other fields if the app requires more (e.g., account\_id)  
        },  
    )  
    print("Connection initiation response:", connection\_request)  
    \# Status should be ACTIVE almost immediately  
    \# connection\_id \= connection\_request.connectedAccountId

except Exception as e:  
    print(f"Error initiating connection: {e}")

\`\`\`  
\`\`\`typescript TypeScript wordWrap  
const userId \= "user\_shopify\_456";  
// Assume user provided this value securely via your UI  
const userProvidedShopifyKey \= "sk\_live\_xxxxxxxxxxxxxxx";

try {  
    console.log(\`Initiating Shopify connection for entity ${userId}...\`);  
    const connectionRequest \= await toolset.connectedAccounts.initiate({  
        integrationId: "int\_shopify\_yyyyyyyy...",  
        authMode: "API\_KEY", // Must match the integration's config  
        // Pass the user-provided key(s) here  
        connectionParams: {  
            api\_key: userProvidedShopifyKey  
            // Add other fields if the app requires more  
        }  
    });  
    console.log("Connection initiation response:", connectionRequest);  
    // Status should be ACTIVE almost immediately  
    // const connectionId \= connectionRequest.connectedAccountId;  
} catch (error) {  
    console.error("Error initiating connection:", error);  
}  
\`\`\`  
\</CodeGroup\>

\*\*Step 4: Connection Activation (Immediate)\*\*

For these types of connections, the \`connectionStatus\` in the response from \`initiate\_connection\` should usually be \*\*\`ACTIVE\`\*\* immediately, as no external user authorization step is needed. The \`redirectUrl\` will typically be null.

You can optionally fetch the connection details using the \`connectedAccountId\` from the response to confirm the \`ACTIVE\` status before proceeding.

Once active, the Connection is ready, and you can use the \`entity\_id\` or \`connectedAccountId\` to \[execute actions\](/tool-calling/executing-tools) for this user and app.

\---  
title: White-labelling  
subtitle: Guide to white-labelling the OAuth Flow  
\---

\#\# Using custom auth app (aka white-labelling)  
When going to production, it's recommended to use your own developer credentials.

\<Steps\>  
\<Step title="Set up a 301 redirect"\>  
The endpoint \`https://backend.composio.dev/api/v1/auth-apps/add\` is what captures the user's credentials to manage the auth. However, OAuth consent screens show the callback URL \- and if it isn't the same as your application, that creates distrust.

It's recommended to specify the redirect URL to your own domain and create a redirect logic, either through your DNS or in your application to redirect that endpoint to \`https://backend.composio.dev/api/v1/auth-apps/add\`

\<Accordion title="Setting up a redirect through DNS"\>  
\- \[Cloudflare URL Forwarding Guide\](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-dashboard/)

\- \[GoDaddy Domain Forwarding Guide\](https://www.godaddy.com/en-in/help/forward-my-godaddy-domain-12123)

\- \[Namecheap URL Redirect Setup Guide\](https://www.namecheap.com/support/knowledgebase/article.aspx/385/2237/how-to-set-up-a-url-redirect-for-a-domain/)  
\</Accordion\>

\<Note\>Whether using DNS or application-level redirects, ensure you're preserving the query string and all params and headers are forwarded correctly\</Note\>

This diagram shows the entire redirect sequence.  
\`\`\`mermaid  
sequenceDiagram  
    participant User  
    participant App as Your App  
    participant OAuth as OAuth Service  
    participant YourDomain as yourapp.com/redirect  
    participant Composio as backend.composio.dev  
      
    User-\>\>App: 1\. Initiates connection  
    App-\>\>OAuth: 2\. Redirects to consent screen  
    User-\>\>OAuth: 3\. Grants permission  
    OAuth-\>\>YourDomain: 4\. Redirects with auth code  
    YourDomain-\>\>Composio: 5\. Forwards to Composio backend  
    Composio-\>\>OAuth: 6\. Exchanges code for tokens  
    Composio-\>\>Composio: 7\. Creates Connection  
    Composio-\>\>App: 8\. Returns to your app  
    App-\>\>User: 9\. Shows success  
\`\`\`

\</Step\>

\<Step title="Create the integration"\>  
Create your integration, specifying the redirect URL in the auth configuration.

\<Tip\>Make sure to set the \`use\_composio\_oauth\_app\` / \`useComposioAuth\` flag to False\!\</Tip\>

Refer to the \[concepts\](/auth/introduction\#retrieve-connection-parameters) page for more information on how to retrieve the auth configuration for an integration.  
\<CodeGroup\>  
\`\`\`python Python {8-12}  
from composio\_openai import App, ComposioToolSet

toolset \= ComposioToolSet()  
integration \= toolset.create\_integration(  
    app=App.GOOGLECALENDAR,  
    auth\_mode="OAUTH2",  
    use\_composio\_oauth\_app=False,  
    auth\_config={  
      "client\_id": "12345678",  
      "client\_secret": "12345678",  
      "redirect\_uri": "https://yourapp.com/redirect"  
    }  
)

entity \= toolset.get\_entity("default")

connection\_request \= entity.initiate\_connection(  
    app\_name=App.GOOGLECALENDAR, integration=integration  
)  
print(connection\_request)  
\`\`\`

\`\`\`typescript TypeScript {9-13}  
import { OpenAIToolSet } from "composio-core";  
const composioToolset \= new OpenAIToolSet();

const integration \= await composioToolset.integrations.create({  
  appUniqueKey: "googlecalendar",  
  name: "Google Calendar",  
  authScheme: "OAUTH2",  
  useComposioAuth: false,  
  authConfig: {  
    client\_id: "12345678",  
    client\_secret: "12345678",  
    redirect\_uri: "https://yourapp.com/redirect",  
  },  
});  
\`\`\`  
\</CodeGroup\>

\</Step\>

\<Step title="Create the connection"\>  
Now you can create the connection. Make sure to include the \`redirectUri\` parameter and set it to where the user should be redirected to after the auth process is finished.

\<CodeGroup\>  
\`\`\`python Python {10-11}  
user\_id \= "00000000-0000-0000-0000-000000000000"  
entity \= toolset.get\_entity(user\_id)

thread\_id \= "12345678"  
redirect\_url \= "https://yourapp.com/thread/{thread\_id}" \# Example redirect URL

conn\_req \= entity.initiate\_connection(  
    app\_name=App.GOOGLECALENDAR,  
    auth\_mode="OAUTH2",  
    use\_composio\_auth=False,  
    redirect\_url=redirect\_url  
)

print(conn\_req.redirect\_url)  
\`\`\`

\`\`\`typescript TypeScript {9-10}  
const user\_id \= "00000000-0000-0000-0000-000000000000";  
const entity \= await composioToolset.getEntity(user\_id);

const thread\_id \= "12345678";   
const redirect\_url \= \`https://yourapp.com/thread/${thread\_id}\`; // Example redirect URL

const connectionRequest \= await entity.initiateConnection({  
  integrationId: integration.id,  
  useComposioAuth: false,  
  redirectUri: redirect\_url,  
});

console.log(connectionRequest.redirectUrl);  
\`\`\`  
\</CodeGroup\>  
\</Step\>  
\</Steps\>

The connection request returns a redirect URL that you can emit to the user to start the auth process. They see the custom consent screen that you configured.  
In this case, it's "usefulagents.com"

\<Frame background="subtle" title="Custom Auth Consent Screen"\>  
  \<img src="file:c3dd0871-fc95-4086-a0bf-39b144442d2f" /\>  
\</Frame\>

\---  
title: Injecting Custom Credentials  
subtitle: Execute actions using authentication tokens or keys provided at runtime  
\---

While Composio excels at managing user connections via \[Integrations\](/auth/set-up-integrations) and the \[connection flow\](/auth/connection), there are scenarios where you might need to provide authentication credentials \*\*directly\*\* when executing an action. This bypasses Composio's stored Connections entirely.

This is achieved using the \`auth\` parameter within the \`execute\_action\` method.

\#\# The \`auth\` parameter in \`execute\_action\`

When calling \`execute\_action\`, you can include an \`auth\` object (Python \`dict\` / TS \`object\`) to specify the credentials Composio should use for that specific API call. This overrides any attempt Composio would normally make to look up credentials based on \`entity\_id\` or \`connected\_account\_id\`.

The core of the \`auth\` object is the \`parameters\` list, which defines the credentials and how they should be injected into the API request.

\*\*\`CustomAuthParameter\` Structure:\*\*

Each item in the \`parameters\` list should be an object with:

\*   \`name\`: (\`str\`) The name of the credential parameter (e.g., \`"Authorization"\`, \`"X-Api-Key"\`, \`"api\_key"\`).  
\*   \`value\`: (\`str\`) The actual secret value (e.g., \`"Bearer xyz..."\`, \`"sk-abc..."\`).  
\*   \`in\_\` (Python) / \`in\` (TS): (\`str\` or \`ParamPlacement\`) Where to place the parameter in the HTTP request. Common values include:  
    \*   \`"header"\` / \`ParamPlacement.Header\`: In the request headers.  
    \*   \`"query"\` / \`ParamPlacement.Query\`: As a URL query parameter.  
    \*   \`"path"\` / \`ParamPlacement.Path\`: As part of the URL path (less common for auth).  
    \*   \`"subdomain"\` / \`ParamPlacement.Subdomain\`: As part of the subdomain.

\*(Optional fields like \`base\_url\` and \`body\` can also exist within the top-level \`auth\` object for very specific authentication schemes, but \`parameters\` is the most common.)\*

\#\# Adding Custom Authentication to Tools

You can also execute \*any\* Composio tool (pre-built or custom-defined) using your own authentication credentials provided at runtime. This is useful if you manage tokens or API keys separately from Composio's connection system.

Use the \`execute\_action\` method and provide the \`auth\` parameter.

\*\*Example: Create GitHub Issue with an existing Bearer Token\*\*

\<CodeGroup\>  
\`\`\`python Python  
\# Python example providing a custom Bearer token  
from composio\_openai import ComposioToolSet, Action, App  
from composio.client.collections import CustomAuthParameter

toolset \= ComposioToolSet()  
bearer\_token \= "ghp\_YourPersonalAccessToken..."  \# Replace with your actual token

toolset.add\_auth(  
    app=App.GITHUB,  
    parameters=\[  
        CustomAuthParameter(  
            name="Authorization",  
            in\_="header",  
            value=bearer\_token,  
        )  
    \],  
)

print("Creating issue using custom auth...")  
try:  
    result \= toolset.execute\_action(  
        action=Action.GITHUB\_CREATE\_ISSUE,  
        params={  
            "owner": "your-username",  
            "repo": "test-repo",  
            "title": "Issue Created with Custom Token",  
            "body": "This issue uses an externally provided auth token.",  
        },  
    )  
    print(result)  
except Exception as e:  
    print(f"An error occurred: {e}")

\`\`\`  
\</CodeGroup\>

\#\#\# Using DescopeAuth (for Descope)  
You can also use \`DescopeAuth\` for simpler Descope integration.

\> To learn more, visit our Outbound Apps \[docs\](https://docs.descope.com/identity-federation/outbound-apps)

\<CodeGroup\>  
\`\`\`python Python  
from composio.utils.descope import DescopeAuth

\# Initialize DescopeAuth with your credentials  
descope \= DescopeAuth(  
    project\_id="your\_project\_id",    \# Or uses DESCOPE\_PROJECT\_ID env var  
    management\_key="your\_management\_key"  \# Or uses DESCOPE\_MANAGEMENT\_KEY env var  
)

toolset \= ComposioToolSet()

\# Add authentication using DescopeAuth  
toolset.add\_auth(  
    app=App.GITHUB,  
    parameters=descope.get\_auth(  
        app=App.GITHUB,  
        user\_id="your\_user\_id",  
        scopes=\["user", "public\_repo"\]  \# Permissions for the token  
    )  
)  
\`\`\`  
\</CodeGroup\>

The \`DescopeAuth\` utility simplifies authentication with Descope by:  
\- Generating the necessary authentication tokens for external services  
\- Managing the authorization headers and metadata  
\- Setting appropriate scopes for the required permissions  
\- Managing tokens at both a user and tenant level  
\- Associating tokens with pre-existing app identities (using Descope as an auth provider)

\*\*Additional Context for DescopeAuth Usage\*\*

To use \`DescopeAuth\`, ensure you have the required \`project\_id\` and \`management\_key\` from your Descope account. These credentials are necessary to authenticate and generate the required headers for API calls. The \`scopes\` parameter defines the permissions for the generated token.

\---  
title: Triggers  
subtitle: Send payloads to your system based on external events  
\---

\#\# Overview

Triggers act as a notification system for your AI applications, enabling your agents to respond dynamically to external events occurring within your integrations.

When these events take place, triggers capture relevant information and deliver structured payloads directly to your system, facilitating timely and context-aware responses.

For instance, imagine building a Slack bot designed to generate humorous responses to messages from your co-workers. To achieve this, your application needs to receive notifications whenever someone posts a new message in a specific Slack channel. Triggers fulfill this role by listening for these events and promptly notifying your system, allowing your bot to respond appropriately.

\<Frame caption="Triggers through Composio" background="subtle"\>  
\!\[Triggers Overview\](file:d0014ed9-544a-4648-82f3-95751ad0780a)  
\</Frame\>

Composio supports two primary methods for delivering these payloads:

\- \*\*\[Webhooks\](\#specifying-listeners-through-webhooks)\*\*: HTTP POST requests sent to a publicly accessible URL that you configure. Webhooks are ideal for scenarios where your application needs to handle events asynchronously and independently from the event source.

\- \*\*\[Websockets\](\#specifying-listeners-through-websockets)\*\*: Persistent, real-time connections that push event data directly to your application. Websockets are suitable for applications requiring immediate, continuous, and low-latency communication.

\#\# Managing triggers  
Before proceeding, ensure you've created an integration and established a connection to your external account (e.g., Slack, GitHub).

\<Card title="Adding Integrations" href="/auth/introduction" icon="fa-solid fa-plug"\>  
You need to have an integration set up in order to listen on it's triggers. Learn how to set it up here.  
\</Card\>

\#\#\# Enable the Trigger  
Enable the "New Message Received" trigger for your Slack app through the dashboard, CLI, or code.  
\<Tabs\>  
\<Tab title="Code"\>  
\<CodeGroup\>  
\`\`\`python Python {9-13}  
from composio\_openai import ComposioToolSet

toolset \= ComposioToolSet()

user\_id \= "default" \# User ID referencing an entity retrieved from application logic  
entity \= toolset.get\_entity(id=user\_id)  
triggers \= toolset.get\_trigger("SLACK\_RECEIVE\_MESSAGE")

res \= entity.enable\_trigger(  
    app=App.SLACK,  
    trigger\_name="SLACK\_RECEIVE\_MESSAGE",  
    config={}  
)

print(res\["status"\])  
\`\`\`

\`\`\`TypeScript TypeScript  
import { ComposioToolSet } from "composio-core";  
const toolset \= new ComposioToolSet();

const userId \= "default";

const entity \= await toolset.getEntity(userId);

const trigger \= await toolset.triggers.get({  
  triggerId: "SLACK\_RECEIVE\_MESSAGE",  
});

const res \= await entity.setupTrigger({  
  triggerName: "SLACK\_RECEIVE\_MESSAGE",  
  app: "slack",  
  config: {},  
});

console.log(res.status);  
\`\`\`  
\</CodeGroup\>

\</Tab\>  
\<Tab title="CLI"\>  
In the command-line run:  
\`\`\`bash  
composio triggers enable SLACK\_RECEIVE\_MESSAGE  
\`\`\`  
\</Tab\>  
\<Tab title="Dashboard"\>  
Head to the \[Slack app\](https://app.composio.dev/app/slack) in the dashboard and enable the "New Message Recieved" trigger  
\<video   
    src="file:8f92c85a-f9a2-4880-9734-a1d18afd1558"  
    width="854"  
    height="480"  
    autoplay  
    loop  
    playsinline  
    controls  
\>  
\</video\>  
\</Tab\>

\</Tabs\>

\<Card title="Specifying Trigger Configuration" icon="fa-solid fa-cog"\>  
Some triggers expect certain configuration to set the correct events. You can inspect and add these properties while enabling the triggers.  
\</Card\>  
\<Steps\>  
\<Step title="Viewing the configuration"\>  
\<CodeGroup\>  
\`\`\`python  
\# Using same imports as above  
trigger \= toolset.get\_trigger("GITHUB\_STAR\_ADDED\_EVENT")  
print(trigger.config.model\_dump\_json(indent=4))  
\`\`\`  
\`\`\`typescript TypeScript  
// Using same imports as above

const trigger \= await toolset.triggers.get({  
  triggerId: "GITHUB\_STAR\_ADDED\_EVENT",  
});  
\`\`\`  
\</CodeGroup\>  
\</Step\>

\`\`\`json Expected properties focus {2-15} maxLines=20  
{  
    "properties": {  
        "owner": {  
            "description": "Owner of the repository",  
            "title": "Owner",  
            "default": null,  
            "type": "string"  
        },  
        "repo": {  
            "description": "Repository name",  
            "title": "Repo",  
            "default": null,  
            "type": "string"  
        }  
    },  
    "title": "WebhookConfigSchema",  
    "type": "object",  
    "required": \[  
        "owner",  
        "repo"  
    \]  
}  
\`\`\`

\<Step title="Specifying the configuration"\>  
\<CodeGroup\>  
\`\`\`python Python  
response \= entity.enable\_trigger(  
    app=App.GITHUB,  
    trigger\_name="GITHUB\_PULL\_REQUEST\_EVENT",  
    config={"owner": "composiohq", "repo": "composio"},  
)  
\`\`\`  
\`\`\`typescript TypeScript  
const res \= await entity.setupTrigger({  
  triggerName: "GITHUB\_PULL\_REQUEST\_EVENT",  
  app: "github",  
  config: {  
    owner: "composiohq",  
    repo: "composio",  
  },  
});

\`\`\`  
\</CodeGroup\>  
\</Step\>  
\</Steps\>

\#\# Listeners

Once you have the triggers set up, you can specify listener functions using websockets through the SDK or webhooks.

\#\#\# Specifying Listeners through Websockets  
We create a listener and then define a callback function that executes when a listener recieves a payload.  
\<CodeGroup\>  
\`\`\`python Python  
listener \= toolset.create\_trigger\_listener()

@listener.callback(  
    filters={  
        "trigger\_name": "SLACK\_RECEIVE\_MESSAGE",  
    }  
)  
def handle\_slack\_message(event):  
    print(event)

listener.wait\_forever()  
\`\`\`  
\`\`\`typescript TypeScript  
const listener \= toolset.triggers.subscribe(  
    (data) \=\> {  
        console.log(data);  
    },  
    {  
        triggerName: "SLACK\_RECEIVE\_MESSAGE"  
    }  
)  
\`\`\`  
\</CodeGroup\>

\#\#\# Specifying Listeners through Webhooks  
Assuming you've already set up a trigger as discussed in previous steps, here's how you can use webhooks instead to listen in on new events happening in an app.

\<Steps\>  
\<Step title="Configure Webhook URL"\>  
To receive trigger events via webhooks, you need to configure a publicly accessible URL where Composio can send the event payloads. This URL should point to an endpoint in your application that can process incoming webhook requests.

\<video   
    src="file:8531ccde-6f73-4566-8af1-af25b7c4549a"  
    width="854"  
    height="480"  
    autoplay  
    loop  
    playsinline  
    controls  
\>  
\</video\>

\</Step\>

\<Step title="Listening on the webhooks"\>  
To demonstrate, here's an example of a server to handle incoming webhook requests.  
\<CodeGroup\>  
\`\`\`python Python maxLines=100  
from fastapi import FastAPI, Request  
from typing import Dict, Any  
import uvicorn  
import json

app \= FastAPI(title="Webhook Demo")

@app.post("/webhook")  
async def webhook\_handler(request: Request):  
    \# Get the raw payload  
    payload \= await request.json()  
      
    \# Log the received webhook data  
    print("Received webhook payload:")  
    print(json.dumps(payload, indent=2))  
      
    \# Return a success response  
    return {"status": "success", "message": "Webhook received"}

if \_\_name\_\_ \== "\_\_main\_\_":  
    uvicorn.run(app, host="0.0.0.0", port=8000)

\`\`\`  
\`\`\`typescript TypeScript  
import express from 'express';  
import type { Request, Response } from 'express';  
import bodyParser from 'body-parser';

const app \= express();  
app.use(bodyParser.json());

app.post('/webhook', async (req: Request, res: Response) \=\> {  
    const payload \= req.body;  
    console.log('Received webhook payload:');  
    console.log(JSON.stringify(payload, null, 2));  
    res.status(200).json({ status: 'success', message: 'Webhook received' });  
});

const PORT \= process.env.PORT || 8000;

app.listen(PORT, () \=\> {  
    console.log(\`Server is running on http://0.0.0.0:${PORT}\`);  
});  
\`\`\`  
\</CodeGroup\>  
\</Step\>

\<Tip\>To test out webhooks locally, use an SSH tunnel like \[ngrok\](https://ngrok.com/docs/agent/)\</Tip\>

\</Steps\>

\#\# Demo: Roast Slack Messages

Let's build a fun bot that generates snarky greentext responses to Slack messages using \`gpt-4.5\`.

\<Steps\>  
  \<Step title="Set up the FastAPI Server"\>  
    First, let's create a FastAPI server to handle webhook events:

    \`\`\`python  
    from fastapi import FastAPI, Request  
    from openai import OpenAI  
    from composio\_openai import ComposioToolSet, App, Action  
    from dotenv import load\_dotenv  
    import uvicorn

    load\_dotenv()  
    app \= FastAPI()  
    client \= OpenAI()  
    toolset \= ComposioToolSet()  
    entity \= toolset.get\_entity(id="default")  
    \`\`\`  
  \</Step\>

  \<Step title="Track Responded Threads"\>  
    Create a set to avoid duplicate responses:

    \`\`\`python  
    \# Set to keep track of threads we've already responded to  
    responded\_threads \= set()  
    \`\`\`  
  \</Step\>

  \<Step title="Implement Response Generation"\>  
    Create a function to generate snarky responses using \`gpt-4.5\`. We'll also set up a preprocessor to handle Slack-specific message parameters:

    \`\`\`python focus{11-16}  
    async def generate\_response(payload: Dict\[str, Any\]):  
        ts \= payload.get("data", {}).get("ts", "")  
        thread\_ts \= payload.get("data", {}).get("thread\_ts", ts)  
        channel \= payload.get("data", {}).get("channel", "")  
          
        \# Skip if already responded  
        if thread\_ts in responded\_threads:  
            return  
          
        responded\_threads.add(thread\_ts)  
          
        \# Preprocessor to automatically inject Slack-specific parameters  
        def slack\_send\_message\_preprocessor(inputs: Dict\[str, Any\]) \-\> Dict\[str, Any\]:  
            inputs\["thread\_ts"\] \= ts          \# Ensure reply goes to the correct thread  
            inputs\["channel"\] \= channel       \# Target the specific channel  
            inputs\["mrkdwn"\] \= False         \# Disable markdown for greentext formatting  
            return inputs  
    \`\`\`  
  \</Step\>

  \<Step title="Configure the tools"\>  
    Set up the tools for sending Slack messages. We attach our preprocessor to automatically handle message threading and formatting:

    \`\`\`python focus{1-9}  
    \# Configure tools with the preprocessor to handle Slack-specific parameters  
    tools \= toolset.get\_tools(  
        \[Action.SLACK\_SENDS\_A\_MESSAGE\_TO\_A\_SLACK\_CHANNEL\],  
        processors={  
            "pre": {  
                Action.SLACK\_SENDS\_A\_MESSAGE\_TO\_A\_SLACK\_CHANNEL: slack\_send\_message\_preprocessor  
            }  
        }  
    )  
      
    response \= client.chat.completions.create(  
        model="gpt-4.5-preview",  
        messages=\[  
            {"role": "system", "content": "Given a slack text. Generate a snarky greentext response mocking the user. Render the response in \`\`\` codeblocks"},  
            {"role": "user", "content": payload.get("data", {}).get("text")}  
        \],  
        tools=tools,  
        tool\_choice="required"  
    )  
    toolset.handle\_tool\_calls(response, entity\_id="default")  
    \`\`\`

    \<Note\>  
    The preprocessor ensures that every message is automatically configured with the correct thread, channel, and formatting settings, reducing the chance of misconfigured responses.  
    \</Note\>  
  \</Step\>

  \<Step title="Create Webhook Handler"\>  
    Set up the webhook endpoint to process incoming messages:

    \`\`\`python focus{1-10}  
    @app.post("/webhook")  
    async def webhook\_handler(request: Request):  
        payload \= await request.json()  
        if payload.get("type") \== "slack\_receive\_message":  
            channel \= payload.get("data", {}).get("channel")  
            if channel \== "YOUR\_CHANNEL\_ID":  \# Replace with your channel ID  
                await generate\_response(payload)  
        return {"status": "success", "message": "Webhook received"}

    uvicorn.run(app, host="0.0.0.0", port=8000)  
    \`\`\`  
  \</Step\>  
\</Steps\>

\<Card title="Testing Locally" icon="terminal"\>  
Run your server locally and use ngrok to expose it:

\`\`\`bash  
\# Start your FastAPI server  
python webhook.py

\# In another terminal, start ngrok  
ngrok http 8000  
\`\`\`  
\</Card\>

\<Tip\>  
Remember to update your webhook URL in the Composio dashboard with your ngrok URL.  
\</Tip\>

\#\# Troubleshooting

If you encounter issues with triggers or webhook listeners, you can use the Composio dashboard to inspect detailed trigger logs. The dashboard allows you to review event payloads, identify errors, and manually resend events for testing purposes.

Access the trigger logs \[here\](https://app.composio.dev/trigger\_logs)

\<video   
    src="file:60f1e606-62f7-46b5-a17b-665b99d84e57"  
    width="854"  
    height="480"  
    autoplay  
    loop  
    playsinline  
    controls  
\>  
\</video\>

\---  
title: Composio MCP Servers  
\---  
Composio MCP (Model Control Protocol) servers provide a powerful way to expose and integrate tools from various applications, making them accessible to any compatible MCP client or SDK. This creates a seamless bridge between your tools and AI agents, enabling rich, interactive functionality across your ecosystem.

To learn about the MCP clients, see the \[clients\](/mcp/clients) page.  
To build with agents, one can customize the MCP server too.

\<Tip\>  
Interested in embedding Composio MCP servers into your MCP clients or applications? Reach out via Slack or \[Contact us\](mailto:support@composio.dev) to get started\!  
\</Tip\>

\#\# Creating Custom MCP Servers  
\<Steps\>  
  \<Step title="Configure Authentication"\>  
    \- \*\*Configure app permissions:\*\*  
      Select the specific scopes and permissions your integration requires for each connected application. This ensures your MCP server has the right level of access.

    \- \*\*Customize the authentication experience (Optional):\*\*  
      Create a seamless, branded experience by providing your own OAuth credentials and customizing the consent screens.

    \*\*Learn more:\*\*  
    \- \[Integration setup guide\](https://docs.composio.dev/auth/set-up-integrations) \- Detailed walkthrough of configuring app integrations  
    \- \[White-labeling guide\](https://docs.composio.dev/auth/white-labelling) \- Instructions for customizing the authentication UI  
  \</Step\>  
  \<Step title="Create and configure an MCP server"\>  
    Making the following request:  
    \`\`\`bash  
    curl \-X POST https://backend.composio.dev/api/v3/mcp/servers \\  
      \-H "x-api-key: \<YOUR\_API\_KEY\>" \\  
      \-H "Content-Type: application/json" \\  
      \-d '{  
        "name": "Gmail",  
        "apps": \[  
          "gmail"  
        \],  
        "auth\_config\_id": {}  
      }'  
    \`\`\`  
    The response looks like:

    \`\`\`json  
    {  
      "id": "5bc757cc-7a8e-431c-8616-7f57cbed2423",  
      "name": "gdrive\_searcher",  
      "auth\_config\_id": "a8a244c4-4a52-488e-8a01-2e504d069d16",  
      "allowed\_tools": \[  
        "GOOGLEDRIVE\_FIND\_FILE",  
        "GOOGLEDRIVE\_FIND\_FOLDER",  
        "GOOGLEDRIVE\_DOWNLOAD\_FILE"  
      \],  
      "mcp\_url": "https://mcp.composio.dev/composio/server/5bc757cc-7a8e-431c-8616-7f57cbed2423?transport=sse",  
      "commands": {  
        "cursor": "npx @composio/mcp@latest setup \\"\<mcp\_url\>\\" \--client cursor",  
        "claude":  "npx @composio/mcp@latest setup \\"\<mcp\_url\>\\" \--client claude",  
        "windsurf": "npx @composio/mcp@latest setup \\"\<mcp\_url\>\\" \--client windsurf"  
      },  
      "created\_at": "2025-05-18T22:15:25.926Z",  
      "updated\_at": "2025-05-18T22:15:25.926Z"  
    }  
    \`\`\`  
  \</Step\>  
  \<Step title="Client applications connect to the server"\>  
    The resultant \`mcp\_url\`; (\`https://mcp.composio.dev/composio/server/\<UUID\>?transport=sse\`) is used by the client applications to connect to the server.    
    The URL accepts three optional query parameters:

| Query param | Purpose |  
|-------------|---------|  
| \`user\_id\` | Bind the session to a user identifier from your app. |  
| \`connected\_account\_id\` | Pin the session to a specific Composio \`connectedAccount\` (skip account selection). |  
| \`include\_composio\_helper\_actions=true\` | Inject helper tools so the agent can walk the user through authentication when needed. |

  \</Step\>  
\</Steps\>

\<Tip\>  
  Currently, the default transport is \`sse\`. Support for \`transport=http-stream\` will be available soon.  
\</Tip\>

\#\#\# Configuring authentication  
You or your users need to authenticate against an app to use it's MCP server through Composio\!  
This can be done in two ways:

\* Authenticate users upfront via the Composio SDK/API. Follow \[this guide\](/auth/connection) to learn how to connect users. This is recommended for most use cases  
\* Let the agent authenticate users on demand. Passing \`include\_composio\_helper\_actions=true\` in the URL will include Composio's helper actions and the agent will guide the user through auth on demand.

