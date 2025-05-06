import { pipeline, type TextGenerationPipeline } from '@xenova/transformers';

const MODEL_NAME = 'Xenova/deepseek-llm-3b-base';

class SimpleLLM {
  private generator: TextGenerationPipeline | null = null;

  async generate(prompt: string): Promise<string> {
    try {
      if (!this.generator) {
        this.generator = await pipeline('text-generation', MODEL_NAME);
      }

      const output = await this.generator(prompt, {
        max_new_tokens: 150,
        temperature: 0.7,
        top_k: 50,
        top_p: 0.9,
        do_sample: true,
      });

      const result = Array.isArray(output) ? output[0] : output;
      return (result as { generated_text?: string })?.generated_text?.trim() || '';
    } catch (err) {
      console.error('Error generating text:', err);
      return '⚠️ Unable to generate a response.';
    }
  }
}

function buildPrompt(soil: string, question: string): string {
  return `
You are Agri Bot 🌿, a helpful assistant for farmers and agriculture students.

Soil Data: ${soil}
Question: ${question}

Respond clearly and helpfully.
  `.trim();
}

const llm = new SimpleLLM();

export async function generateWithLLM(input: { soil: string; question: string }) {
  const finalPrompt = buildPrompt(input.soil, input.question);
  return await llm.generate(finalPrompt);
}
