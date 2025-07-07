import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { lessons, getProgress, saveProgress } from "@/data/lessons";
import { ArrowLeft, Volume2, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import AddContentForm from "@/components/AddContentForm";

const Lesson = () => {
  const { lessonId } = useParams();
  const lesson = lessons.find(l => l.id === parseInt(lessonId || "0"));
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<boolean[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleWordAdded = () => {
    setRefreshKey(prev => prev + 1);
    // Reset to first card if we're beyond the new array length
    if (currentCardIndex >= lesson.words.length) {
      setCurrentCardIndex(0);
    }
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      toast.error("Speech synthesis not supported in your browser");
    }
  };

  const nextCard = () => {
    if (currentCardIndex < lesson.words.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const startQuiz = () => {
    setShowQuiz(true);
    setQuizAnswers([]);
    setQuizComplete(false);
  };

  const handleQuizAnswer = (correct: boolean) => {
    const newAnswers = [...quizAnswers, correct];
    setQuizAnswers(newAnswers);
    
    if (newAnswers.length === lesson.words.length) {
      const correctCount = newAnswers.filter(Boolean).length;
      const score = Math.round((correctCount / lesson.words.length) * 100);
      
      saveProgress(lesson.id, score, true);
      setQuizComplete(true);
      
      toast.success(`Quiz completed! Score: ${score}%`);
    } else {
      setTimeout(nextCard, 1000);
    }
  };

  const resetQuiz = () => {
    setShowQuiz(false);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setQuizAnswers([]);
    setQuizComplete(false);
  };

  const progress = getProgress(lesson.id);
  const currentWord = lesson.words[currentCardIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lessons
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">{lesson.title}</h1>
            <p className="text-gray-600">{lesson.words.length} words to master</p>
          </div>
          <div className="flex items-center gap-4">
            {progress.completed && (
              <Badge className="bg-green-500">
                Score: {progress.score}%
              </Badge>
            )}
            <AddContentForm currentLessonId={lesson.id} onWordAdded={handleWordAdded} />
          </div>
        </div>

        {lesson.words.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-600 mb-4">No words in this lesson yet</h2>
            <p className="text-gray-500">Click "Add Word" to start adding vocabulary!</p>
          </div>
        ) : (
          <>
            {!showQuiz ? (
              <>
                {/* Study Mode - Flashcards */}
                <div className="max-w-2xl mx-auto mb-12">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Study Mode - Flashcards</h2>
                    <div className="text-sm text-gray-600">
                      {currentCardIndex + 1} of {lesson.words.length}
                    </div>
                  </div>

                  {/* Flashcard */}
                  <div className="perspective-1000 mb-6">
                    <div 
                      className={`relative w-full h-64 transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
                      onClick={() => setIsFlipped(!isFlipped)}
                    >
                      {/* Front */}
                      <div className="absolute inset-0 w-full h-full backface-hidden">
                        <Card className="h-full border-2 border-blue-200 hover:border-blue-300 transition-colors">
                          <CardContent className="h-full flex flex-col items-center justify-center text-center p-8">
                            <h3 className="text-4xl font-bold text-blue-600 mb-4">
                              {currentWord.english}
                            </h3>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                speakWord(currentWord.english);
                              }}
                              variant="outline"
                              size="lg"
                              className="mb-4"
                            >
                              <Volume2 className="h-5 w-5 mr-2" />
                              Listen
                            </Button>
                            <p className="text-gray-500">Click to see translation</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Back */}
                      <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                        <Card className="h-full border-2 border-green-200 bg-green-50">
                          <CardContent className="h-full flex flex-col items-center justify-center text-center p-8">
                            <h3 className="text-4xl font-bold text-green-600 mb-4">
                              {currentWord.translation}
                            </h3>
                            <p className="text-gray-600 mb-4">Translation</p>
                            <p className="text-gray-500">Click to see English</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center mb-8">
                    <Button
                      onClick={prevCard}
                      disabled={currentCardIndex === 0}
                      variant="outline"
                    >
                      Previous
                    </Button>
                    
                    <Progress 
                      value={((currentCardIndex + 1) / lesson.words.length) * 100} 
                      className="flex-1 mx-4 h-2"
                    />
                    
                    <Button
                      onClick={nextCard}
                      disabled={currentCardIndex === lesson.words.length - 1}
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div>

                  {/* Quiz Button */}
                  <div className="text-center">
                    <Button onClick={startQuiz} size="lg" className="bg-green-600 hover:bg-green-700">
                      Take Quiz to Test Your Knowledge
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Quiz Mode */}
                <div className="max-w-2xl mx-auto mb-12">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Quiz Mode</h2>
                    <div className="text-sm text-gray-600">
                      Question {quizAnswers.length + 1} of {lesson.words.length}
                    </div>
                  </div>

                  {!quizComplete ? (
                    <Card className="border-2 border-purple-200">
                      <CardHeader>
                        <CardTitle className="text-center text-2xl text-purple-600">
                          What does "{currentWord.english}" mean?
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center space-y-6">
                        <Button
                          onClick={() => speakWord(currentWord.english)}
                          variant="outline"
                          className="mb-4"
                        >
                          <Volume2 className="h-4 w-4 mr-2" />
                          Listen
                        </Button>
                        
                        <div className="text-3xl font-bold text-gray-700 mb-6">
                          {currentWord.translation}
                        </div>
                        
                        <div className="flex gap-4 justify-center">
                          <Button
                            onClick={() => handleQuizAnswer(true)}
                            className="bg-green-600 hover:bg-green-700"
                            size="lg"
                          >
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Correct
                          </Button>
                          <Button
                            onClick={() => handleQuizAnswer(false)}
                            variant="destructive"
                            size="lg"
                          >
                            <XCircle className="h-5 w-5 mr-2" />
                            Wrong
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border-2 border-green-200 bg-green-50">
                      <CardContent className="text-center p-8">
                        <h3 className="text-2xl font-bold text-green-600 mb-4">
                          Quiz Complete! 🎉
                        </h3>
                        <div className="text-4xl font-bold text-green-700 mb-4">
                          {Math.round((quizAnswers.filter(Boolean).length / lesson.words.length) * 100)}%
                        </div>
                        <p className="text-gray-600 mb-6">
                          You got {quizAnswers.filter(Boolean).length} out of {lesson.words.length} correct!
                        </p>
                        <div className="flex gap-4 justify-center">
                          <Button onClick={resetQuiz} variant="outline">
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Study Again
                          </Button>
                          <Link to="/">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                              Back to Lessons
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            )}

            {/* Word Table */}
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>All Words in This Lesson</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lesson.words.map((word, index) => (
                      <div 
                        key={`${index}-${refreshKey}`}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{word.english}</div>
                          <div className="text-gray-600">{word.translation}</div>
                        </div>
                        <Button
                          onClick={() => speakWord(word.english)}
                          variant="ghost"
                          size="sm"
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Lesson;
