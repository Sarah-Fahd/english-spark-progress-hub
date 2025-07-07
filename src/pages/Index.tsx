
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { lessons, getProgress, getOverallProgress } from "@/data/lessons";
import { BookOpen, Trophy, Target } from "lucide-react";
import AddContentForm from "@/components/AddContentForm";

const Index = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const overallProgress = getOverallProgress();

  const handleLessonAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">English Learning Hub</h1>
          </div>
          <p className="text-xl text-gray-600 mb-6">Master English vocabulary with interactive lessons</p>
          
          {/* Overall Progress */}
          <div className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-md mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold text-gray-700">Overall Progress</span>
            </div>
            <Progress value={overallProgress} className="h-3 mb-2" />
            <p className="text-2xl font-bold text-blue-600">{overallProgress}%</p>
          </div>

          {/* Add New Lesson Button */}
          <div className="mb-8">
            <AddContentForm onLessonAdded={handleLessonAdded} />
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {lessons.map((lesson) => {
            const progress = getProgress(lesson.id);
            const scoreColor = progress.score >= 80 ? 'bg-green-500' : progress.score >= 60 ? 'bg-yellow-500' : 'bg-red-500';
            
            return (
              <Link key={`${lesson.id}-${refreshKey}`} to={`/lesson/${lesson.id}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-blue-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        {lesson.title}
                      </CardTitle>
                      <Target className="h-5 w-5 text-blue-500" />
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Progress</span>
                        <Badge 
                          variant={progress.completed ? "default" : "secondary"}
                          className={progress.completed ? scoreColor : ""}
                        >
                          {progress.completed ? `${progress.score}%` : "Not Started"}
                        </Badge>
                      </div>
                      <Progress 
                        value={progress.completed ? progress.score : 0} 
                        className="h-2" 
                      />
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Words to learn:</span>
                        <span className="font-semibold">{lesson.words.length}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Status:</span>
                        <span className={`font-semibold ${progress.completed ? 'text-green-600' : 'text-blue-600'}`}>
                          {progress.completed ? 'Completed' : 'Ready to start'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Instructions for editing */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                📝 Easy Editing Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-blue-700 space-y-3">
              <p><strong>To add new words:</strong> Find the file called "lessons.ts" in your project</p>
              <p><strong>Format:</strong> Just copy this pattern: <code className="bg-blue-100 px-2 py-1 rounded">{"{ english: \"word\", translation: \"translation\" }"}</code></p>
              <p><strong>To add new lessons:</strong> Copy an entire lesson block and change the id, title, and words</p>
              <p><strong>Your progress is automatically saved!</strong> Scores are calculated based on your quiz performance</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
