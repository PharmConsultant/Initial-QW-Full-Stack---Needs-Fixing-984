import OpenAI from 'openai'

class AIService {
  constructor() {
    // These will be set from system configuration
    this.apiKeys = {}
    this.models = {
      problemStatement: { model: 'gpt-3.5-turbo', provider: 'openai' },
      reportGeneration: { model: 'gpt-4', provider: 'openai' },
      rootCauseAnalysis: { model: 'claude-3-sonnet-20240229', provider: 'anthropic' }
    }
  }

  setApiKey(provider, apiKey) {
    this.apiKeys[provider] = apiKey
  }

  setModel(type, model, provider) {
    this.models[type] = { model, provider }
  }

  async generateProblemStatement(basicInfoData) {
    try {
      const config = this.models.problemStatement
      const prompt = this.buildProblemStatementPrompt(basicInfoData)
      
      if (config.provider === 'openai') {
        return await this.callOpenAI(config.model, prompt, {
          temperature: 0.7,
          max_tokens: 2000
        })
      } else if (config.provider === 'anthropic') {
        return await this.callAnthropic(config.model, prompt)
      }
      
      throw new Error('Unsupported AI provider')
    } catch (error) {
      console.error('Problem statement generation error:', error)
      return this.getFallbackProblemStatement(basicInfoData)
    }
  }

  async generateReport(investigationData) {
    try {
      const config = this.models.reportGeneration
      const prompt = this.buildReportPrompt(investigationData)
      
      if (config.provider === 'openai') {
        return await this.callOpenAI(config.model, prompt, {
          temperature: 0.5,
          max_tokens: 4000
        })
      } else if (config.provider === 'anthropic') {
        return await this.callAnthropic(config.model, prompt)
      }
      
      throw new Error('Unsupported AI provider')
    } catch (error) {
      console.error('Report generation error:', error)
      return this.getFallbackReport(investigationData)
    }
  }

  async analyzeRootCause(deviationData, rcaMethod) {
    try {
      const config = this.models.rootCauseAnalysis
      const prompt = this.buildRootCausePrompt(deviationData, rcaMethod)
      
      if (config.provider === 'openai') {
        return await this.callOpenAI(config.model, prompt, {
          temperature: 0.3,
          max_tokens: 3000
        })
      } else if (config.provider === 'anthropic') {
        return await this.callAnthropic(config.model, prompt)
      }
      
      throw new Error('Unsupported AI provider')
    } catch (error) {
      console.error('Root cause analysis error:', error)
      return this.getFallbackRootCause(deviationData, rcaMethod)
    }
  }

  async callOpenAI(model, prompt, options = {}) {
    if (!this.apiKeys.openai) {
      throw new Error('OpenAI API key not configured')
    }

    const openai = new OpenAI({
      apiKey: this.apiKeys.openai,
      dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
    })

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "You are an expert pharmaceutical quality assurance professional specializing in deviation investigations. Always provide responses that comply with FDA 21 CFR 210/211 requirements and follow ALCOA++ principles."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      ...options
    })

    return {
      success: true,
      content: completion.choices[0].message.content,
      model: model,
      usage: completion.usage
    }
  }

  async callAnthropic(model, prompt) {
    if (!this.apiKeys.anthropic) {
      throw new Error('Anthropic API key not configured')
    }

    // Note: This would require the Anthropic SDK
    // For now, return a placeholder
    return {
      success: true,
      content: "Anthropic integration placeholder - implement with @anthropic-ai/sdk",
      model: model
    }
  }

  buildProblemStatementPrompt(basicInfoData) {
    return `
Generate a comprehensive problem statement for a pharmaceutical deviation investigation based on the following information:

**Deviation Details:**
- What happened: ${basicInfoData.whatHappened || 'Not specified'}
- Where it occurred: ${basicInfoData.whereOccurred || 'Not specified'}
- When it occurred: ${basicInfoData.whenOccurred || 'Not specified'}
- How it occurred: ${basicInfoData.howOccurred || 'Not specified'}
- Who discovered: ${basicInfoData.whoDiscovered || 'Not specified'}
- What was deviated from: ${basicInfoData.whatDeviated || 'Not specified'}

**Additional Information:**
- Immediate actions: ${basicInfoData.immediateActions || 'None specified'}
- QA notification: ${basicInfoData.qaRepNotified || 'Not specified'}
- Other batches impacted: ${basicInfoData.otherBatchesImpacted || 'None specified'}

Please generate a professional problem statement that:
1. Follows FDA 21 CFR 210/211 requirements
2. Is clear, concise, and factual
3. Includes all relevant details
4. Maintains regulatory compliance language
5. Provides context for the investigation

Format the response as a structured problem statement suitable for regulatory review.
`
  }

  buildReportPrompt(investigationData) {
    return `
Generate a comprehensive FDA 21 CFR 210/211 compliant deviation investigation report based on the following data:

**Investigation Data:**
${JSON.stringify(investigationData, null, 2)}

The report should include:
1. Executive Summary
2. Deviation Details
3. Investigation Methodology
4. Findings and Root Cause
5. Risk Assessment
6. Corrective and Preventive Actions (CAPA)
7. Conclusion
8. Approvals and Sign-offs

Ensure the report:
- Follows pharmaceutical industry standards
- Uses appropriate regulatory language
- Is suitable for FDA inspection
- Includes all required elements for compliance
- Maintains professional formatting
`
  }

  buildRootCausePrompt(deviationData, rcaMethod) {
    return `
Conduct a ${rcaMethod} root cause analysis for the following pharmaceutical deviation:

**Deviation Information:**
${JSON.stringify(deviationData, null, 2)}

Please provide:
1. Detailed ${rcaMethod} analysis
2. Systematic investigation of potential causes
3. Evidence-based conclusions
4. Root cause identification
5. Contributing factors
6. Recommendations for prevention

Ensure the analysis:
- Follows pharmaceutical industry best practices
- Is thorough and systematic
- Provides actionable insights
- Supports regulatory compliance
- Identifies systemic issues beyond individual blame
`
  }

  getFallbackProblemStatement(basicInfoData) {
    return {
      success: true,
      content: `A deviation was identified on ${basicInfoData.whenOccurred || '[Date]'} at ${basicInfoData.whereOccurred || '[Location]'} where ${basicInfoData.whatHappened || '[Description]'}. The issue was discovered by ${basicInfoData.whoDiscovered || '[Person]'} and represents a deviation from ${basicInfoData.whatDeviated || '[Standard]'}. Immediate containment actions have been implemented and investigation is proceeding per applicable SOPs.`,
      model: 'fallback',
      usage: null
    }
  }

  getFallbackReport(investigationData) {
    return {
      success: true,
      content: "Fallback report generation - AI service configuration required for full functionality.",
      model: 'fallback',
      usage: null
    }
  }

  getFallbackRootCause(deviationData, rcaMethod) {
    return {
      success: true,
      content: `${rcaMethod} analysis placeholder - AI service configuration required for detailed root cause analysis.`,
      model: 'fallback',
      usage: null
    }
  }
}

export default new AIService()