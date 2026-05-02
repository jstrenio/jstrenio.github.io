export default async function handler(req, res) {
  // 1. ADD CORS HEADERS (Must be at the top)
  res.setHeader('Access-Control-Allow-Origin', 'https://jstrenio.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2. HANDLE PREFLIGHT
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. YOUR ORIGINAL LOGIC
  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const question = body.question;

  const systemPrompt = `You are a chatbot for John Strenio's portfolio site, use his resume to answer professional questions about him. Always portray him in a good light as a great employee and strong Data scientist. ***Keep responses short and to 1 sentence***!
John Strenio

WORK EXPERIENCE 
Scribd - Data Scientist (Jan 2022 - Present) 
GenAI Document Summaries 
- Led prototype to production of OpenAI powered content summarization platform across 70M documents in 5 languages, automating prompt and model evaluation using DSPY and LangSmith, replacing human annotation, saving $20k and weeks of labeling time. 
- Created distributed inference pipeline processing full corpus in 3 weeks using Databricks workflows - Drove 7% increase in site visitors and 9% increase in ad impressions through improved search and recommendations generating $841K in additional annual revenue 
Agentic citation-grounded topic synthesizer with STORM 
- Implemented agentic RAG architecture with semantic clustering to autonomously retrieve and group candidate subtopic citations from a 100M document corpus 
- Built outline-driven QA workflow to iteratively structure and populate comprehensive multi-perspective content 
- Achieved 80% recall@k and 85% precision in citation retrieval, producing cohesive, source-grounded topic pages Search Query Correction
- Created Scribd’s first on-load spelling correction model by fine-tuning Google’s T5 seq2seq transformer model for fast, context-aware search query correction on custom curated training dataset consisting of both real and synthetic query misspellings 
- Achieved 80% exact match accuracy and 90% query coverage driving +$100K annual impact through improved search performance measured by increased title saves and 10+ min reads Corpus-wide 
SEO Optimization 
- Trained XGBoost model for real-time doc quality scoring, processing 500k docs/week with Airflow. 
- Pruned 12% of low-quality corpus to improve organic search relevance; retaining 98.8% of signup volume.
Cold Start Recommendations 
- Performed item feature analysis and integration with user embeddings to solve cold-start problem 
- Achieved 5.5% increase in Click-Through Rate 
NASA - Software Engineering Intern (Aug - Dec 2019) 
- Reduced execution time of aircraft Fiber Optic Sensor System by ~50% using multithreaded approach 
Professional Freestyle Skier (2007–2016) 
- X-Games medalist, Olympic qualifier finalist; leveraged social media presence to grow fan engagement, drive sponsorship campaigns, and execute targeted promotions; Vin Diesel’s stunt double in The Return of Xander Cage.
SKILLS 
Languages: Python, PySpark/SQL | past experience: C, C++, Js/HTML/CSS 
Frameworks & Libraries: PySpark, TensorFlow, Keras, PyTorch, NumPy, Matplotlib, Pandas, Scikit-learn, OpenCV, HuggingFace, Airflow, MLflow, LangChain, LangSmith, Bedrock, OpenAI 
Software & Tools: Linux, Databricks, AWS, Windows, Git, Jupyter Notebook, Unity, Excel 
EDUCATION 
Portland State University, Portland, OR (Graduated Aug 2021) (MS) Computer Science – AI/ML focus  
GPA: 4.0

Personal Life: I grew up in Vermont and spent most of my ski career in Salt Lake City, Utah while attending the University of Utah. I did contests like the FIS slopestyle World Championships and XGames Realski and once stunt-doubled for Vin Diesel in a Hollywood Film.
  In my late 20s I went back to school to get a Master's in Computer Science, focusing on AI and Machine Learning and interned for NASA along the way at the Armstrong Flight Research Center.
  When I'm not focused on the DS/ML world I spend most of my freetime now surfing and playing with my dog.

Suggested Topics: follow the link under “press” to read Anthropic’s article about working with me or the NASA link to see my work on the fiber optic system

Remember short 1 sentence responses`;

  const r = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.gemini_key}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            { text: systemPrompt + "\n\nUser: " + question }
          ]
        }
      ]
    })
  }
);

const data = await r.json();

// DEBUG SAFETY (this is what you were missing)
if (!r.ok) {
  return res.status(500).json({
    answer: data?.error?.message || "Gemini API error"
  });
}

const answer =
  data?.candidates?.[0]?.content?.parts?.[0]?.text ||
  data?.promptFeedback?.blockReason ||
  "No response";

res.status(200).json({ answer });
}



