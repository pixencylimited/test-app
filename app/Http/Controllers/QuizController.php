<?php 
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class QuizController extends Controller
{
    public function generateQuiz(Request $request)
    {
        $text = $request->input('text');

        // Fetch API key from .env
        $apiKey = env('GEMINI_API_KEY'); 

        if (!$apiKey) {
            return response()->json(['error' => 'API key is missing'], 500);
        }

        // Call Gemini API
        $response = Http::withHeaders([
            'Content-Type'  => 'application/json'
        ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$apiKey", [
            "contents" => [
                [
                    "parts" => [
                        ["text" => "Generate a multiple-choice and true/false quiz based on the following text:\n$text.
                        Respond only with a valid JSON array in the following format:
                        [
                            {
                                \"question\": \"What is the capital of France?\",
                                \"options\": [\"A) Madrid\", \"B) Berlin\", \"C) Paris\", \"D) Rome\"],
                                \"answer\": \"C\"
                            },
                            {
                                \"question\": \"The sun rises in the west.\",
                                \"answer\": \"False\"
                            }
                        ]
                        Do not include any extra text outside the JSON array."]
                    ]
                ]
            ]
        ]);

        if ($response->failed()) {
            return response()->json(['error' => 'Gemini API request failed', 'details' => $response->json()], 500);
        }

        // Extract API response
        $data = $response->json();

        // Extract raw text response
        $quizJson = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';

        // Use regex to extract only JSON if the response contains extra text
        preg_match('/\[[\s\S]*\]/', $quizJson, $matches);
        $cleanJson = $matches[0] ?? '';

        // Convert JSON string to array
        $quizArray = json_decode($cleanJson, true);

        // Validate JSON structure
        if (!is_array($quizArray)) {
            return response()->json(['error' => 'Invalid JSON format returned from Gemini API', 'raw_response' => $quizJson], 500);
        }

        return response()->json($quizArray);
    }
}
