type Difficulty = 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';

interface KnowledgeBlock {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
}

interface Question {
  id: string;
  subjectId: string;
  content: string;
  difficulty: Difficulty;
  knowledgeBlockId: string;
}

interface ExamTemplateItem {
  difficulty: Difficulty;
  knowledgeBlockId?: string | null; // optional: specific block
  count: number;
}

interface Exam {
  id: string;
  subjectId: string;
  title: string;
  items: ExamTemplateItem[];
  questions: Question[];
  createdAt: string;
}

const LS_PREFIX = 'qb_v1:';

const storage = {
  get(key: string) {
    const raw = localStorage.getItem(LS_PREFIX + key);
    return raw ? JSON.parse(raw) : [];
  },
  set(key: string, value: any) {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(value));
  },
};

// Knowledge blocks
export const getKnowledgeBlocks = (): KnowledgeBlock[] => storage.get('blocks');
export const addKnowledgeBlock = (name: string) => {
  const items = getKnowledgeBlocks();
  const id = Date.now().toString();
  const obj = { id, name };
  storage.set('blocks', [...items, obj]);
  return obj;
};

// Subjects
export const getSubjects = (): Subject[] => storage.get('subjects');
export const addSubject = (code: string, name: string, credits: number) => {
  const items = getSubjects();
  const id = Date.now().toString();
  const obj = { id, code, name, credits };
  storage.set('subjects', [...items, obj]);
  return obj;
};

// Questions
export const getQuestions = (): Question[] => storage.get('questions');
export const addQuestion = (q: Omit<Question, 'id'>) => {
  const items = getQuestions();
  const id = Date.now().toString();
  const obj = { id, ...q } as Question;
  storage.set('questions', [...items, obj]);
  return obj;
};

export const searchQuestions = (opts: {
  subjectId?: string;
  difficulty?: Difficulty;
  knowledgeBlockId?: string;
}) => {
  const all = getQuestions();
  return all.filter((q) => {
    if (opts.subjectId && q.subjectId !== opts.subjectId) return false;
    if (opts.difficulty && q.difficulty !== opts.difficulty) return false;
    if (opts.knowledgeBlockId && q.knowledgeBlockId !== opts.knowledgeBlockId) return false;
    return true;
  });
};

// Exams (templates + generated)
export const saveExam = (exam: Omit<Exam, 'id' | 'createdAt'>) => {
  const items: Exam[] = storage.get('exams');
  const id = Date.now().toString();
  const obj: Exam = { id, createdAt: new Date().toISOString(), questions: exam.questions, ...exam } as any;
  storage.set('exams', [...items, obj]);
  return obj;
};

export const getExams = (): Exam[] => storage.get('exams');

export const generateExam = (subjectId: string, title: string, items: ExamTemplateItem[]) => {
  const pool = getQuestions().filter((q) => q.subjectId === subjectId);

  const selected: Question[] = [];

  for (const it of items) {
    let candidates = pool.filter((q) => q.difficulty === it.difficulty);
    if (it.knowledgeBlockId) {
      candidates = candidates.filter((q) => q.knowledgeBlockId === it.knowledgeBlockId);
    }

    if (candidates.length < it.count) {
      throw new Error(`Không đủ câu hỏi cho mức '${it.difficulty}' và khối được chọn`);
    }

    // simple random pick without duplicates
    for (let i = 0; i < it.count; i++) {
      const idx = Math.floor(Math.random() * candidates.length);
      selected.push(candidates[idx]);
      candidates.splice(idx, 1);
    }
  }

  const exam = saveExam({ subjectId, title, items, questions: selected });
  return exam;
};

// pick questions for template without saving (used for editing)
export const pickQuestionsForTemplate = (subjectId: string, items: ExamTemplateItem[]) => {
  const pool = getQuestions().filter((q) => q.subjectId === subjectId);
  const selected: Question[] = [];

  for (const it of items) {
    let candidates = pool.filter((q) => q.difficulty === it.difficulty);
    if (it.knowledgeBlockId) {
      candidates = candidates.filter((q) => q.knowledgeBlockId === it.knowledgeBlockId);
    }

    if (candidates.length < it.count) {
      throw new Error(`Không đủ câu hỏi cho mức '${it.difficulty}' và khối được chọn`);
    }

    for (let i = 0; i < it.count; i++) {
      const idx = Math.floor(Math.random() * candidates.length);
      selected.push(candidates[idx]);
      candidates.splice(idx, 1);
    }
  }

  return selected;
};

// update existing exam by id (replace title/items/questions)
export const updateExam = (id: string, data: { title?: string; items?: ExamTemplateItem[]; questions?: Question[] }) => {
  const items: Exam[] = storage.get('exams');
  const idx = items.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error('Exam not found');
  const cur = items[idx];
  const updated: Exam = {
    ...cur,
    title: data.title ?? cur.title,
    items: data.items ?? cur.items,
    questions: data.questions ?? cur.questions,
  };
  items[idx] = updated;
  storage.set('exams', items);
  return updated;
};

export const deleteExam = (id: string) => {
  const items: Exam[] = storage.get('exams');
  const next = items.filter((e) => e.id !== id);
  storage.set('exams', next);
  return true;
};

// initialize empty stores if missing
(() => {
  if (!localStorage.getItem(LS_PREFIX + 'blocks')) storage.set('blocks', []);
  if (!localStorage.getItem(LS_PREFIX + 'subjects')) storage.set('subjects', []);
  if (!localStorage.getItem(LS_PREFIX + 'questions')) storage.set('questions', []);
  if (!localStorage.getItem(LS_PREFIX + 'exams')) storage.set('exams', []);
})();

export type { KnowledgeBlock, Subject, Question, Exam, ExamTemplateItem, Difficulty };
