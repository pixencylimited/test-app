<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class QuizController extends Controller
{
    /**
     * Summary of quizForm
     * @return Response|\Inertia\ResponseFactory
     */
    public function quizForm()
    {
        return inertia('quiz/Create');
    }

    /**
     * Summary of generateQuiz
     * @param \Illuminate\Http\Request $request
     * @return Response
     */
    public function generateQuiz(Request $request): Response
    {
        $text = $request->input('text');
        $numQuestions = $request->input('num_question');

        // Fetch API key from .env
        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            return Inertia::render('quiz/Generate', [
                'error' => 'API key is missing'
            ]);
        }
        // Validate num_question
        if (!empty($numQuestions) && !is_numeric($numQuestions)) {
            return Inertia::render('quiz/Generate', [
                'error' => 'Invalid number of questions'
            ]);
        }

        // Generate the prompt based on num_question is set.
        if (!empty($numQuestions)) {
            $prompt = "Generate exactly $numQuestions quiz questions with multiple-choice, true/false, fill-in-the-gaps, short answer, and long answer questions based on the following text:\n$text.
            Respond only with a valid JSON array in the following format:
            [
                {
                    \"type\": \"multiple-choice\",
                    \"question\": \"What is the capital of France?\",
                    \"options\": [\"A) Madrid\", \"B) Berlin\", \"C) Paris\", \"D) Rome\"],
                    \"answer\": \"C\"
                },
                {
                    \"type\": \"true-false\",
                    \"question\": \"The sun rises in the west.\",
                    \"answer\": \"False\"
                },
                {
                    \"type\": \"fill-in-gaps\",
                    \"question\": \"The capital of France is ____.\",
                    \"answer\": \"Paris\"
                },
                {
                    \"type\": \"short-answer\",
                    \"question\": \"What is the main idea of the text?\",
                    \"answer\": \"Provide a concise summary.\"
                },
                {
                    \"type\": \"long-answer\",
                    \"question\": \"Discuss the implications of the events described in the text.\",
                    \"answer\": \"Provide a detailed explanation.\"
                }
            ]
            Do not include any extra text outside the JSON array.";
        } else {
            $prompt = "Generate a quiz with multiple-choice, true/false, fill-in-the-gaps, short answer, and long answer questions based on the following text:\n$text.
            Respond only with a valid JSON array in the following format:
            [
                {
                    \"type\": \"multiple-choice\",
                    \"question\": \"What is the capital of France?\",
                    \"options\": [\"A) Madrid\", \"B) Berlin\", \"C) Paris\", \"D) Rome\"],
                    \"answer\": \"C\"
                },
                {
                    \"type\": \"true-false\",
                    \"question\": \"The sun rises in the west.\",
                    \"answer\": \"False\"
                },
                {
                    \"type\": \"fill-in-gaps\",
                    \"question\": \"The capital of France is ____.\",
                    \"answer\": \"Paris\"
                },
                {
                    \"type\": \"short-answer\",
                    \"question\": \"What is the main idea of the text?\",
                    \"answer\": \"Provide a concise summary.\"
                },
                {
                    \"type\": \"long-answer\",
                    \"question\": \"Discuss the implications of the events described in the text.\",
                    \"answer\": \"Provide a detailed explanation.\"
                }
            ]
            Do not include any extra text outside the JSON array.";
        }

        $response = Http::withHeaders([
            'Content-Type' => 'application/json'
        ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$apiKey", [
            "contents" => [
                [
                    "parts" => [
                        ["text" => $prompt]
                    ]
                ]
            ]
        ]);

        // ... (rest of the code remains the same)
        if ($response->failed()) {
            return Inertia::render('quiz/Generate', [
                'error' => 'Gemini API request failed',
                'details' => $response->json()
            ]);
        }

        // Extract API response
        $data = $response->json();
        $quizJson = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';

        // Use regex to extract only JSON if the response contains extra text
        preg_match('/\[[\s\S]*\]/', $quizJson, $matches);
        $cleanJson = $matches[0] ?? '';

        // Convert JSON string to array
        $quizArray = json_decode($cleanJson, true);

        // Validate JSON structure
        if (!is_array($quizArray)) {
            return Inertia::render('quiz/Generate', [
                'error' => 'Invalid JSON format returned from Gemini API',
                'raw_response' => $quizJson
            ]);
        }

        // Truncate the array to the desired number of questions
        if (!empty($numQuestions) && count($quizArray) > $numQuestions) {
            $quizArray = array_slice($quizArray, 0, $numQuestions);
        }

        // Add question numbers
        foreach ($quizArray as $index => &$question) {
            $question['question_no'] = $index + 1;
        }

        return Inertia::render('quiz/Generate', [
            'quiz' => $quizArray
        ]);
    }
}