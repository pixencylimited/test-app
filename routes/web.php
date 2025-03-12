<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\QuizController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::get('/quiz/form', [QuizController::class, 'quizForm']);
    Route::post('/quiz/generate', [QuizController::class, 'generateQuiz'])->name('quiz.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
