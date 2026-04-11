
import {createAgent, gemini} from '@inngest/agent-kit'

const analyzeTicket = (ticket) =>{

    const supportAgent = createAgent({
        model: gemini({
            model:"gemini-1.5-flash-8b",
            apiKey:process.env.GEMINI_API_KEY,
        })
    })

}