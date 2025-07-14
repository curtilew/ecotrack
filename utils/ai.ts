import { ChatOpenAI } from '@langchain/openai'
import { StructuredOutputParser } from 'langchain/output_parsers'
import z from 'zod'
import { PromptTemplate } from '@langchain/core/prompts'

const parser = StructuredOutputParser.fromZodSchema(
    z.object({
        total: z
            .number()
            .describe('The estimated total CO2 carbon footprint in kilograms (kg) as a decimal number with up to 2 decimal places'),
        breakdown: z.object({
            transportation: z.number().optional().describe('CO2 from transportation activities in g'),
            energy: z.number().optional().describe('CO2 from energy consumption in g'),
            food: z.number().optional().describe('CO2 from food consumption in g'),
            shopping: z.number().optional().describe('CO2 from purchases/shopping in g')
        }).describe('Breakdown of carbon footprint by category'),
        confidence: z
            .enum(['high', 'medium', 'low'])
            .describe('Confidence level in the carbon footprint calculation'),
        methodology: z
            .string()
            .describe('Brief recommendation on how to reduce carbon footprint based on totals')
    })
)
// @ts-expect-error Database returns null but component expects undefined
const getPromptForCarbonTotal = async (content) => {
    const formatted_instructions = parser.getFormatInstructions()

    const prompt = new PromptTemplate({
        template: 
            "You are an expert carbon footprint analyst specializing in calculating accurate CO2 emissions from activity data.\n\n" +
            "CONTEXT: You're analyzing activity log entries from EcoTrack, a personal carbon footprint tracking application. Users log activities across four categories: Transportation, Energy, Food, and Shopping.\n\n" +
            "TASK: Calculate the total carbon footprint in kilograms of CO2 equivalent (kg CO2e) for the given activity data.\n\n" +
            "CALCULATION GUIDELINES:\n" +
            "- Use scientifically-backed emission factors from reputable sources (EPA, DEFRA, etc.)\n" +
            "- For transportation: Consider fuel type, vehicle efficiency, distance\n" +
            "- For energy: Account for regional electricity grid mix, usage amounts\n" +
            "- For food: Include production, processing, and transportation emissions\n" +
            "- For shopping: Consider product lifecycle, manufacturing, shipping\n\n" +
            "ACTIVITY DATA TO ANALYZE:\n{entry}\n\n" +
            "REQUIREMENTS:\n" +
            "1. Provide precise calculations with realistic emission factors\n" +
            "2. Round final total to 2 decimal places maximum\n" +
            "3. Break down emissions by category when applicable\n" +
            "4. Assess confidence based on data completeness and estimation accuracy\n" +
            "5. Provide a specific, easy motivational recommendation on how to lower carbon footprint based on totals\n\n" +
            "{formatted_instructions}\n\n" +
            "Remember: Accuracy is crucial for helping users make informed environmental decisions. Use conservative estimates when data is incomplete.",
        inputVariables: ['entry'],
        partialVariables: { formatted_instructions }, 
    })

    const input = await prompt.format({
        entry: content,
    })

    return input
}

// Main analysis function that returns the parsed object
// @ts-expect-error Database returns null but component expects undefined
export const analyzeTotal = async (content) => {
    try {
        // Initialize OpenAI model
        const model = new ChatOpenAI({
            temperature: 0,
            modelName: 'gpt-4o-mini', // or 'gpt-4' for better accuracy
        })

        // Get the formatted prompt
        const input = await getPromptForCarbonTotal(content)

        // Get AI response
        const result = await model.invoke(input)

        // Extract the content from the AI message
        const aiResponse = result.content

        // Parse the structured output to get just the object
        // @ts-expect-error Database returns null but component expects undefined
        const parsedResult = await parser.parse(aiResponse)

        console.log('Parsed carbon footprint analysis:', parsedResult)
        
        return parsedResult

    } catch (error) {
        console.error('Error analyzing carbon footprint:', error)
        
        // Return a fallback object in case of error
        return {
            total: 0,
            breakdown: {},
            confidence: 'low',
            methodology: 'Error occurred during analysis'
        }
    }
}