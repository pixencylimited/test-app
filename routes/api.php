<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\QuizController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/test', function (Request $request) {
    return response()->json('Hello World');
});


//AI Quiz generator API
// Route::post('/generate-quiz', [QuizController::class, 'generateQuiz']);