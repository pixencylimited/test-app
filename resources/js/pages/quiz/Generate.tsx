// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import AppLayout from '@/layouts/app-layout';
// import { Head, usePage } from '@inertiajs/react';
// import { useState } from 'react';

// interface QuizQuestion {
//     question: string;
//     options?: string[];
//     answer: string;
//     question_no: number;
// }

// interface PageProps {
//     quiz?: QuizQuestion[];
//     error?: string;
// }

// export default function Generate() {
//     const { props } = usePage<PageProps>();
//     const quizQuestions = props.quiz ?? [];
//     const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
//     const [showResults, setShowResults] = useState(false);
//     const [error, setError] = useState(props.error || '');
//     const [isQuizCompleted, setIsQuizCompleted] = useState(false); // Add state for quiz completion

//     console.log("Quiz Questions:", quizQuestions);

//     if (!quizQuestions.length) {
//         return <p className="text-red-500 text-center mt-6">No quiz questions available.</p>;
//     }

//     const handleAnswerSelect = (questionId: number, option: string) => {
//         if (!isQuizCompleted) { // Only allow selection if quiz is not completed
//             setUserAnswers({ ...userAnswers, [questionId]: option });
//         }
//     };

//     const calculateScore = () => {
//         let correctCount = 0;
//         quizQuestions.forEach((q) => {
//             if (userAnswers[q.question_no] === q.answer) {
//                 correctCount++;
//             }
//         });
//         return (correctCount / quizQuestions.length) * 100;
//     };

//     const handleShowResults = () => {
//         setShowResults(true);
//         setIsQuizCompleted(true); // Set quiz completion to true
//     };

//     return (
//         <AppLayout>
//             <Head title="Generate Quiz" />
//             <div className="py-12">
//                 <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//                     {error && (
//                         <Alert variant="destructive" className="mb-4">
//                             <AlertDescription>{error}</AlertDescription>
//                         </Alert>
//                     )}

//                     <Card className="p-6">
//                         <h2 className="text-2xl font-bold mb-4">Quiz</h2>
//                         {quizQuestions.map((question) => (
//                             <div key={question.question_no} className="mb-6 p-4 border rounded">
//                                 <p className="font-semibold">{question.question_no}. {question.question}</p>
//                                 <ul>
//                                     {question.options ? (
//                                         question.options.map((option, idx) => (
//                                             <li key={idx} className="mt-2">
//                                                 <button
//                                                     onClick={() => handleAnswerSelect(question.question_no, option)}
//                                                     className={`px-4 py-2 rounded border 
//                                                         ${userAnswers[question.question_no] === option ? 'bg-blue-500 text-white' : 'bg-gray-100'}
//                                                         ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`} // Disable if quiz completed
//                                                     disabled={isQuizCompleted} // Disable if quiz completed
//                                                 >
//                                                     {option}
//                                                 </button>
//                                             </li>
//                                         ))
//                                     ) : (
//                                         <>
//                                             <li className="mt-2">
//                                                 <button
//                                                     onClick={() => handleAnswerSelect(question.question_no, "True")}
//                                                     className={`px-4 py-2 rounded border ${userAnswers[question.question_no] === "True" ? 'bg-blue-500 text-white' : 'bg-gray-100'} ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
//                                                     disabled={isQuizCompleted}
//                                                 >
//                                                     True
//                                                 </button>
//                                             </li>
//                                             <li className="mt-2">
//                                                 <button
//                                                     onClick={() => handleAnswerSelect(question.question_no, "False")}
//                                                     className={`px-4 py-2 rounded border ${userAnswers[question.question_no] === "False" ? 'bg-blue-500 text-white' : 'bg-gray-100'} ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
//                                                     disabled={isQuizCompleted}
//                                                 >
//                                                     False
//                                                 </button>
//                                             </li>
//                                         </>
//                                     )}
//                                 </ul>
//                             </div>
//                         ))}

//                         <Button onClick={handleShowResults} className="mt-4" disabled={isQuizCompleted}>
//                             Show Score
//                         </Button>

//                         {showResults && (
//                             <div className="mt-6 p-4 border rounded">
//                                 <h3 className="text-xl font-bold">Your Score: {calculateScore().toFixed(2)}%</h3>
//                                 <h4 className="mt-4 font-semibold">Correct Answers:</h4>
//                                 {quizQuestions.map((question) => (
//                                     <div key={question.question_no} className="mt-2">
//                                         <p>
//                                             <strong>{question.question_no}. {question.question}</strong>
//                                         </p>
//                                         <p className={`font-bold ${userAnswers[question.question_no] === question.answer ? 'text-green-600' : 'text-red-600'}`}>
//                                             Your Answer: {userAnswers[question.question_no] || "Not Answered"}
//                                         </p>
//                                         <p className="text-green-600 font-bold">Correct Answer: {question.answer}</p>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </Card>
//                 </div>
//             </div>
//         </AppLayout>
//     );
// }




import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface QuizQuestion {
    type: string;
    question: string;
    options?: string[];
    answer: string;
    question_no: number;
}

interface PageProps {
    quiz?: QuizQuestion[];
    error?: string;
}

export default function Generate() {
    const { props } = usePage<PageProps>();
    const quizQuestions = props.quiz ?? [];
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
    const [showResults, setShowResults] = useState(false);
    const [error, setError] = useState(props.error || '');
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);

    const handleAnswerSelect = (questionId: number, option: string) => {
        if (!isQuizCompleted) {
            setUserAnswers({ ...userAnswers, [questionId]: option });
        }
    };

    const handleTextAnswerChange = (questionId: number, answer: string) => {
        if (!isQuizCompleted) {
            setUserAnswers({ ...userAnswers, [questionId]: answer });
        }
    };

    const calculateScore = () => {
        let correctCount = 0;
        quizQuestions.forEach((q) => {
            if (userAnswers[q.question_no]?.trim().toLowerCase() === q.answer?.trim().toLowerCase()) {
                correctCount++;
            }
        });
        return (correctCount / quizQuestions.length) * 100;
    };

    const handleShowResults = () => {
        setShowResults(true);
        setIsQuizCompleted(true);
    };

    return (
        <AppLayout>
            <Head title="Generate Quiz" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">Quiz</h2>
                        {quizQuestions.map((question) => (
                            <div key={question.question_no} className="mb-6 p-4 border rounded">
                                <p className="font-semibold">{question.question_no}. {question.question}</p>
                                {question.type === "multiple-choice" && (
                                    <ul>
                                        {question.options.map((option, idx) => (
                                            <li key={idx} className="mt-2">
                                                <button
                                                    onClick={() => handleAnswerSelect(question.question_no, option)}
                                                    className={`px-4 py-2 rounded border ${userAnswers[question.question_no] === option ? 'bg-blue-500 text-white' : 'bg-gray-100'} ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
                                                    disabled={isQuizCompleted}
                                                >
                                                    {option}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {question.type === "true-false" && (
                                    <ul>
                                        <li className="mt-2">
                                            <button
                                                onClick={() => handleAnswerSelect(question.question_no, "True")}
                                                className={`px-4 py-2 rounded border ${userAnswers[question.question_no] === "True" ? 'bg-blue-500 text-white' : 'bg-gray-100'} ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
                                                disabled={isQuizCompleted}
                                            >
                                                True
                                            </button>
                                        </li>
                                        <li className="mt-2">
                                            <button
                                                onClick={() => handleAnswerSelect(question.question_no, "False")}
                                                className={`px-4 py-2 rounded border ${userAnswers[question.question_no] === "False" ? 'bg-blue-500 text-white' : 'bg-gray-100'} ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
                                                disabled={isQuizCompleted}
                                            >
                                                False
                                            </button>
                                        </li>
                                    </ul>
                                )}
                                {question.type === "fill-in-gaps" && (
                                    <input
                                        type="text"
                                        value={userAnswers[question.question_no] || ""}
                                        onChange={(e) => handleTextAnswerChange(question.question_no, e.target.value)}
                                        className={`mt-2 p-2 border rounded w-full ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
                                        disabled={isQuizCompleted}
                                    />
                                )}
                                {question.type === "short-answer" && (
                                    <input
                                        type="text"
                                        value={userAnswers[question.question_no] || ""}
                                        onChange={(e) => handleTextAnswerChange(question.question_no, e.target.value)}
                                        className={`mt-2 p-2 border rounded w-full ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
                                        disabled={isQuizCompleted}
                                    />
                                )}
                                {question.type === "long-answer" && (
                                    <textarea
                                        value={userAnswers[question.question_no] || ""}
                                        onChange={(e) => handleTextAnswerChange(question.question_no, e.target.value)}
                                        className={`mt-2 p-2 border rounded w-full ${isQuizCompleted ? 'cursor-not-allowed opacity-50' : ''}`}
                                        disabled={isQuizCompleted}
                                    />
                                )}
                            </div>
                        ))}

                        <Button onClick={handleShowResults} className="mt-4" disabled={isQuizCompleted}>
                            Show Score
                        </Button>

                        {showResults && (
                            <div className="mt-6 p-4 border rounded">
                                <h3 className="text-xl font-bold">Your Score: {calculateScore().toFixed(2)}%</h3>
                                <h4 className="mt-4 font-semibold">Correct Answers:</h4>
                                {quizQuestions.map((question) => (
                                    <div key={question.question_no} className="mt-2">
                                        <p>
                                            <strong>{question.question_no}. {question.question}</strong>
                                        </p>
                                        <p className={`font-bold ${userAnswers[question.question_no]?.trim().toLowerCase() === question.answer?.trim().toLowerCase() ? 'text-green-600' : 'text-red-600'}`}>
                                            Your Answer: {userAnswers[question.question_no] || "Not Answered"}
                                        </p>
                                        <p className="text-green-600 font-bold">Correct Answer: {question.answer}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}