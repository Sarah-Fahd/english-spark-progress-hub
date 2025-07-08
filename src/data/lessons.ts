
// 🎯 EASY TO EDIT: Add new words here!
// Just copy the format: { english: "word", translation: "translation" }

export interface Word {
  english: string;
  translation: string;
}

export interface Lesson {
  id: number;
  title: string;
  words: Word[];
}

const defaultLessons: Lesson[] = [
  {
    id: 1,
    title: "Lesson 1: Basic Greetings",
    words: [
      { english: "Hello", translation: "Hola" },
      { english: "Goodbye", translation: "Adiós" },
      { english: "Thank you", translation: "Gracias" },
      { english: "Please", translation: "Por favor" },
      { english: "Yes", translation: "Sí" },
      { english: "No", translation: "No" },
      { english: "Excuse me", translation: "Disculpe" },
      { english: "Sorry", translation: "Lo siento" },
    ]
  },
  {
    id: 2,
    title: "Lesson 2: Family Members",
    words: [
      { english: "Mother", translation: "Madre" },
      { english: "Father", translation: "Padre" },
      { english: "Sister", translation: "Hermana" },
      { english: "Brother", translation: "Hermano" },
      { english: "Grandmother", translation: "Abuela" },
      { english: "Grandfather", translation: "Abuelo" },
      { english: "Daughter", translation: "Hija" },
      { english: "Son", translation: "Hijo" },
    ]
  },
  {
    id: 3,
    title: "Lesson 3: Colors",
    words: [
      { english: "Red", translation: "Rojo" },
      { english: "Blue", translation: "Azul" },
      { english: "Green", translation: "Verde" },
      { english: "Yellow", translation: "Amarillo" },
      { english: "Black", translation: "Negro" },
      { english: "White", translation: "Blanco" },
      { english: "Purple", translation: "Morado" },
      { english: "Orange", translation: "Naranja" },
    ]
  }
];

// Load lessons from localStorage or use defaults
const loadLessons = (): Lesson[] => {
  const saved = localStorage.getItem('lessons');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [...defaultLessons];
    }
  }
  return [...defaultLessons];
};

// Save lessons to localStorage
const saveLessons = (lessons: Lesson[]) => {
  localStorage.setItem('lessons', JSON.stringify(lessons));
};

export let lessons: Lesson[] = loadLessons();

// Helper functions to manage lessons
export const addLesson = (lesson: Lesson) => {
  console.log("addLesson called with:", lesson);
  lessons.push(lesson);
  console.log("lessons array now:", lessons);
  saveLessons(lessons);
  console.log("Saved to localStorage");
};

export const deleteLesson = (lessonId: number) => {
  const index = lessons.findIndex(l => l.id === lessonId);
  if (index !== -1) {
    lessons.splice(index, 1);
    saveLessons(lessons);
  }
};

export const addWordToLesson = (lessonId: number, word: Word) => {
  const lesson = lessons.find(l => l.id === lessonId);
  if (lesson) {
    lesson.words.push(word);
    saveLessons(lessons);
  }
};

export const deleteWordFromLesson = (lessonId: number, wordIndex: number) => {
  const lesson = lessons.find(l => l.id === lessonId);
  if (lesson && lesson.words[wordIndex]) {
    lesson.words.splice(wordIndex, 1);
    saveLessons(lessons);
  }
};

// 📊 Progress tracking - scores are saved in browser storage
export const getProgress = (lessonId: number): { score: number; completed: boolean } => {
  const saved = localStorage.getItem(`lesson-${lessonId}-progress`);
  if (saved) {
    return JSON.parse(saved);
  }
  return { score: 0, completed: false };
};

export const saveProgress = (lessonId: number, score: number, completed: boolean) => {
  const progress = { score, completed };
  localStorage.setItem(`lesson-${lessonId}-progress`, JSON.stringify(progress));
};

export const getOverallProgress = (): number => {
  let totalScore = 0;
  let completedLessons = 0;
  
  lessons.forEach(lesson => {
    const progress = getProgress(lesson.id);
    if (progress.completed) {
      totalScore += progress.score;
      completedLessons++;
    }
  });
  
  return completedLessons > 0 ? Math.round(totalScore / completedLessons) : 0;
};
