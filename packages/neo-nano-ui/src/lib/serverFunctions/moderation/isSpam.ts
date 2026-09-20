import { generateText, Output } from 'ai'
import { z } from 'zod'

const ReviewDecision = z.object({
  isInappropriate: z.boolean(),
  confidence: z.number().min(0).max(1),
  category: z.enum(['spam', 'sexual-content', 'harrassment']),
})

export async function classifyComment(text: string) {
  const { output } = await generateText({
    model: 'anthropic/claude-sonnet-5',
    output: Output.object({ schema: ReviewDecision }),
    prompt: `Classify this forum comment. Flag inappropriate comments, including spam, sexual content, and harrassment.
Comment: ${JSON.stringify(text)}`,
  })

  return output
}

