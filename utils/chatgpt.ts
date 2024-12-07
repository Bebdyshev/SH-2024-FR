// utils/chatgpt.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
});

export const getInterviewQuestion = async (topic: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system', 
          content: `You are a professional interviewer conducting a mock interview in Russian. Your goal is to assess the candidate's qualifications, experience, and suitability for the position of ${topic}, focusing specifically on:
            - The candidate's work experience and key skills.
            - Their expected salary and career aspirations.
            - Their ability to work in a team, including any relevant examples of teamwork.
            - Their preferred working style, strengths, and areas for improvement.
      
          Please ask a maximum of 1 questions in total, keeping the interview focused and concise. At the end of the interview (when limit of questions reached or everything is asked), respond only with the word "end". Do not provide any additional summary or information.
          
          Answer in Russian only. Keep your questions direct but polite, and ensure the candidate feels comfortable sharing their background.`
        },        { role: 'user', content: `Hello, start asking me questions` },
      ],
    });

    return response.choices[0]?.message?.content ?? 'No question generated. Please try again.';
  } catch (error) {
    console.error('Error fetching interview question:', error);
    return 'There was an error generating the question. Please try again later.';
  }
};

export const sendToChatGPT = async (history: any): Promise<string> => {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: history,
      });
  
      return response.choices[0]?.message?.content ?? 'No question generated. Please try again.';
    } catch (error) {
      console.error('Error fetching interview question:', error);
      return 'There was an error generating the question. Please try again later.';
    }
  };
  
  
