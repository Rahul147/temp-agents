import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import readline from "readline";

(async function POST() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (query) =>
    new Promise((resolve) => rl.question(query, resolve));

  const userInput = await question("Please enter your message: ");
  rl.close();

  const result = await generateText({
    model: openai("gpt-4o"),
    system: "You are a helpful assistant.",
    prompt: userInput,
    tools: {
      getWeather: {
        description: "Get the weather for a location.",
        parameters: z.object({
          city: z
            .string()
            .describe(
              "The city to get the weather for. Always expand to the full city name"
            ),
          unit: z
            .enum(["C", "F"])
            .describe("The unit to display the temperature in"),
        }),
        execute: async ({ city, unit }) => {
          const weather = {
            value: 24,
            description: "Sunny",
          };

          return `It is currently ${weather.value}°${unit} and ${weather.description} in ${city}!`;
        },
      },
    },
  });

  console.log(result.response.messages.map((m) => m.content));
})();
