import { BaseChatModel } from "langchain/chat_models/base";
import {
  ChatGeneration,
  ChatResult,
} from "langchain/schema";
import {
  BaseMessage,
  AIMessage,
} from "langchain/core/messages";
import {
  StructuredTool,
  convertToOpenAIFunction,
} from "langchain/tools";

interface CustomModelParams {
  apiUrl: string;
}

export class CustomChatModel extends BaseChatModel {
  apiUrl: string;
  tools: StructuredTool[] = [];

  constructor(fields: CustomModelParams) {
    super({});
    this.apiUrl = fields.apiUrl;
  }

  _llmType(): string {
    return "custom-chat-model";
  }

  // Tool binding (OpenAI Function Calling style)
  bindTools(tools: StructuredTool[]): this {
    this.tools = tools;

    // Optional: convert to OpenAI-compatible function schema
    const openAIFunctions = tools.map((tool) =>
      convertToOpenAIFunction(tool)
    );

    // If your API expects a "functions" field, store it
    (this as any).functions = openAIFunctions;

    return this;
  }

  async _generate(
    messages: BaseMessage[],
    options: this["ParsedCallOptions"]
  ): Promise<ChatResult> {
    const prompt = messages.map((msg) => msg.content).join("\n");

    const payload: any = {
      prompt,
      functions: (this as any).functions, // ← send tool schema if needed
    };

    const res = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    const message = new AIMessage(json.message?.content ?? "No response");
    const generation: ChatGeneration = {
      text: message.content,
      message,
    };

    return {
      generations: [generation],
    };
  }
}
