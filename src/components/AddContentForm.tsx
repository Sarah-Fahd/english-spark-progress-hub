
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { lessons, Word, addLesson, deleteLesson, addWordToLesson, deleteWordFromLesson } from "@/data/lessons";

interface AddContentFormProps {
  onLessonAdded?: () => void;
  onWordAdded?: () => void;
  onLessonDeleted?: () => void;
  onWordDeleted?: () => void;
  currentLessonId?: number;
}

const AddContentForm = ({ onLessonAdded, onWordAdded, onLessonDeleted, onWordDeleted, currentLessonId }: AddContentFormProps) => {
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonWords, setNewLessonWords] = useState("");
  const [newWordEnglish, setNewWordEnglish] = useState("");
  const [newWordTranslation, setNewWordTranslation] = useState("");
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [isAddingWord, setIsAddingWord] = useState(false);

  const addNewLesson = () => {
    if (!newLessonTitle.trim()) {
      toast.error("Please enter a lesson title");
      return;
    }

    const wordsArray: Word[] = [];
    if (newLessonWords.trim()) {
      const wordPairs = newLessonWords.split('\n').filter(line => line.trim());
      for (const pair of wordPairs) {
        const [english, translation] = pair.split(' - ').map(s => s.trim());
        if (english && translation) {
          wordsArray.push({ english, translation });
        }
      }
    }

    const newLesson = {
      id: Math.max(...lessons.map(l => l.id)) + 1,
      title: newLessonTitle,
      words: wordsArray
    };

    addLesson(newLesson);
    
    setNewLessonTitle("");
    setNewLessonWords("");
    setIsAddingLesson(false);
    
    toast.success("New lesson added successfully!");
    onLessonAdded?.();
  };

  const addNewWord = () => {
    if (!newWordEnglish.trim() || !newWordTranslation.trim()) {
      toast.error("Please enter both English word and translation");
      return;
    }

    if (!currentLessonId) {
      toast.error("No lesson selected");
      return;
    }

    addWordToLesson(currentLessonId, {
      english: newWordEnglish.trim(),
      translation: newWordTranslation.trim()
    });
      
    setNewWordEnglish("");
    setNewWordTranslation("");
    setIsAddingWord(false);
    
    toast.success("New word added successfully!");
    onWordAdded?.();
  };

  const deleteLessonHandler = () => {
    if (!currentLessonId) return;
    
    deleteLesson(currentLessonId);
    toast.success("Lesson deleted successfully!");
    onLessonDeleted?.();
  };

  const deleteWord = (wordIndex: number) => {
    if (!currentLessonId) return;
    
    deleteWordFromLesson(currentLessonId, wordIndex);
    toast.success("Word deleted successfully!");
    onWordDeleted?.();
  };

  const currentLesson = currentLessonId ? lessons.find(l => l.id === currentLessonId) : null;

  return (
    <div className="flex gap-2 flex-wrap">
      {/* Add New Lesson Dialog */}
      <Dialog open={isAddingLesson} onOpenChange={setIsAddingLesson}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New Lesson
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Lesson</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Lesson Title</label>
              <Input
                placeholder="e.g., Lesson 4: Animals"
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Words (optional - one per line, format: English - Translation)
              </label>
              <Textarea
                placeholder="Cat - Gato&#10;Dog - Perro&#10;Bird - Pájaro"
                value={newLessonWords}
                onChange={(e) => setNewLessonWords(e.target.value)}
                rows={6}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addNewLesson} className="flex-1">
                Create Lesson
              </Button>
              <Button variant="outline" onClick={() => setIsAddingLesson(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add New Word Dialog (only show if we have a current lesson) */}
      {currentLessonId && (
        <Dialog open={isAddingWord} onOpenChange={setIsAddingWord}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Word
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Word</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">English Word</label>
                <Input
                  placeholder="e.g., Hello"
                  value={newWordEnglish}
                  onChange={(e) => setNewWordEnglish(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Translation</label>
                <Input
                  placeholder="e.g., Hola"
                  value={newWordTranslation}
                  onChange={(e) => setNewWordTranslation(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addNewWord} className="flex-1">
                  Add Word
                </Button>
                <Button variant="outline" onClick={() => setIsAddingWord(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Lesson Button (only show if we have a current lesson) */}
      {currentLessonId && (
        <Button 
          variant="destructive" 
          onClick={deleteLessonHandler}
          className="ml-auto"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Lesson
        </Button>
      )}
    </div>
  );
};

export default AddContentForm;
