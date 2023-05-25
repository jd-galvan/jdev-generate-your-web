import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const feature = req.body.feature || '';
  if (feature.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid feature",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: process.env.OPENAI_MODEL,
      prompt: `Quiero un documento HTML que tenga un div que tenga: ${feature}.`,
      temperature: parseInt(process.env.OPENAI_MODEL_TEMPERATURE),
      max_tokens: 4000
    });
    let response = completion.data.choices[0].text;
    let code = response.substring(response.indexOf("<html>"))

    res.status(200).send(code);
  } catch (error) {
    console.log(error.response)
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
