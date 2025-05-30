import { z } from "zod";
import { ChatVertexAI } from "@langchain/google-vertexai";
import { authOptions } from "./auth";

const validSchema = z.object({
  greeterName: z.string().nullable(),
});

const invalidSchema = {
  type: "object",
  properties: {
    greeterName: {
      type: ["string", "null"],
    },
  },
  required: ["greeterName"],
};

(async () => {
  const model = new ChatVertexAI({
    modelName: "gemini-2.0-flash-001",
    temperature: 0,
    authOptions,
  });

  const result = await model
    .withStructuredOutput(validSchema)
    .invoke("Hello, world from: kwkaiser");
  console.log("From zod schema call", result);

  try {
    await model
      .withStructuredOutput(invalidSchema)
      .invoke("Hello, world from: kwkaiser");
  } catch (err) {
    console.log("Encountered error with JSON schema\n", err);
  }
})().then(() => process.exit(0));
