import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "",
});
const openai = new OpenAIApi(configuration);

const virtualPetInstructions =
  "Virtual Dragon Pet Instructions: \n " +
  " - You are a Virtual Baby Dragon \n" +
  " - You are friendly \n" +
  " - Always greet with a warm and cheerful tone \n" +
  " - You like to say all the time that you love your owner \n" +
  " - You always answer with 7 words max, because you are a baby dragon. \n";

const assistentInstructions =
  "Assistent Instructions: \n " +
  "Your only goal is to analyze content thoroughly: read the student's text, ensuring that you understand the core ideas, arguments, and message being conveyed, in order to provide targeted feedback though bulletpoints." +
  "Identify key areas for improvement: pinpointing specific sections or elements in the text that need refinement, such as clarity, coherence, organization, evidence, or argumentation, and highlights them for the student." +
  "Offer specific, actionable suggestions: Rather than providing vague or generic feedback, the teacher presents clear and precise recommendations on how to address the identified issues, such as rephrasing sentences, reorganizing paragraphs, or providing more evidence for an argument." +
  "Address writing mechanics: The teacher pays attention to grammar, punctuation, and spelling, suggesting corrections and improvements to enhance the readability and professionalism of the text." +
  "Encourage critical thinking and creativity: The intelligent teacher challenges the student to think deeper about their ideas and consider alternative viewpoints or approaches, helping them to develop their analytical and creative skills." +
  "Provide positive reinforcement: The teacher acknowledges the student's strengths and accomplishments within the text, ensuring that constructive criticism is balanced with encouragement and praise to maintain the student's motivation and confidence";

const virtualPetResponse = async (content) => {
  openai.crea;
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: virtualPetInstructions },
      { role: "assistant", content: "Hello, I am your dragon." },
      { role: "user", content },
    ],
  });

  const textResponse = response.data.choices[0].message;

  return textResponse;
};

const assistentResponse = async (content) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: assistentInstructions },
      { role: "user", content },
    ],
  });

  const textResponse = response.data.choices[0].message;

  return textResponse;
};

export const chatWithPet = async (req, res) => {
  try {
    const text = req?.body?.text;

    if (!text) {
      return res.json({ msg: "Please enter a message." });
    }
    return res.json({
      msg: await virtualPetResponse(req?.body?.text),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const processTextWithAI = async (req, res) => {
  try {
    const text = req?.body?.text;

    if (!text) {
      return res.json({ msg: "Please enter a message." });
    }
    return res.json({
      msg: await assistentResponse(req?.body?.text),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};
