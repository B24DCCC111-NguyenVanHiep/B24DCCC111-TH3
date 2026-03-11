import React, { useEffect, useState } from 'react';
import './index.less';
import * as svc from '../../services/QuestionBankService';

export default function QuestionBank() {
  const [section, setSection] = useState<'blocks' | 'subjects' | 'questions' | 'exams'>('blocks');

  // blocks
  const [blocks, setBlocks] = useState<svc.KnowledgeBlock[]>([]);
  const [blockName, setBlockName] = useState('');

  // subjects
  const [subjects, setSubjects] = useState<svc.Subject[]>([]);
  const [subCode, setSubCode] = useState('');
  const [subName, setSubName] = useState('');
  const [subCredits, setSubCredits] = useState(3);

  // questions
  const [questions, setQuestions] = useState<svc.Question[]>([]);
  const [qSubject, setQSubject] = useState('');
  const [qBlock, setQBlock] = useState('');
  const [qDifficulty, setQDifficulty] = useState<svc.Difficulty>('Dễ');
  const [qContent, setQContent] = useState('');

  // exams
  const [examList, setExamList] = useState<svc.Exam[]>([]);
  const [examTitle, setExamTitle] = useState('');
  const [templateItems, setTemplateItems] = useState<{ difficulty: svc.Difficulty; knowledgeBlockId?: string; count: number }[]>([
    { difficulty: 'Dễ', count: 1 },
  ]);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);

  useEffect(() => {
    setBlocks(svc.getKnowledgeBlocks());
    setSubjects(svc.getSubjects());
    setQuestions(svc.getQuestions());
    setExamList(svc.getExams());
  }, []);

  const refreshAll = () => {
    setBlocks(svc.getKnowledgeBlocks());
    setSubjects(svc.getSubjects());
    setQuestions(svc.getQuestions());
    setExamList(svc.getExams());
  };

  const onAddBlock = () => {
    if (!blockName) return;
    svc.addKnowledgeBlock(blockName);
    setBlockName('');
    refreshAll();
  };

  const onAddSubject = () => {
    if (!subCode || !subName) return;
    svc.addSubject(subCode, subName, Number(subCredits));
    setSubCode('');
    setSubName('');
    setSubCredits(3);
    refreshAll();
  };

  const onAddQuestion = () => {
    if (!qSubject || !qContent) return;
    svc.addQuestion({ subjectId: qSubject, content: qContent, difficulty: qDifficulty, knowledgeBlockId: qBlock });
    setQContent('');
    refreshAll();
  };

  const onGenerateExam = () => {
    try {
      if (!subjects[0]) return;
      const subjectId = subjects[0].id;
      const exam = svc.generateExam(subjectId, examTitle || 'Đề tự động', templateItems.map((t) => ({ difficulty: t.difficulty, knowledgeBlockId: t.knowledgeBlockId, count: t.count })));
      setExamList(svc.getExams());
      alert('Tạo đề thành công: ' + exam.id);
    } catch (e: any) {
      alert('Lỗi: ' + e.message);
    }
  };

  const onEditExam = (exam: svc.Exam) => {
    // load exam into editor
    setEditingExamId(exam.id);
    setExamTitle(exam.title);
    setTemplateItems(exam.items.map((it) => ({ difficulty: it.difficulty, knowledgeBlockId: it.knowledgeBlockId, count: it.count })));
    // ensure subject exists and set (we assume exam.subjectId exists)
  };

  const onSaveExamEdit = async () => {
    if (!editingExamId) return;
    try {
      const exam = svc.getExams().find((e) => e.id === editingExamId);
      if (!exam) throw new Error('Exam not found');
      const subjectId = exam.subjectId;
      // pick new questions according to template
      const questionList = svc.pickQuestionsForTemplate(subjectId, templateItems);
      const updated = svc.updateExam(editingExamId, { title: examTitle, items: templateItems, questions });
      setExamList(svc.getExams());
      setEditingExamId(null);
      alert('Cập nhật đề thành công');
    } catch (e: any) {
      alert('Lỗi: ' + e.message);
    }
  };

  const onCancelEdit = () => {
    setEditingExamId(null);
    setExamTitle('');
    setTemplateItems([{ difficulty: 'Dễ', count: 1 }]);
  };

  const onDeleteExam = (id: string) => {
    if (!confirm('Xác nhận xoá đề?')) return;
    svc.deleteExam(id);
    setExamList(svc.getExams());
  };

  return (
    <div className="qb-root">
      <h2>Quản lý Ngân hàng Câu hỏi (Bài 2)</h2>

      <div className="qb-menu">
        <button className={(section === 'blocks' ? 'active ' : '') + 'qb-btn'} onClick={() => setSection('blocks')}>Khối kiến thức</button>
        <button className={(section === 'subjects' ? 'active ' : '') + 'qb-btn'} onClick={() => setSection('subjects')}>Môn học</button>
        <button className={(section === 'questions' ? 'active ' : '') + 'qb-btn'} onClick={() => setSection('questions')}>Câu hỏi</button>
        <button className={(section === 'exams' ? 'active ' : '') + 'qb-btn'} onClick={() => setSection('exams')}>Đề thi</button>
      </div>

      <div className="qb-panel">
        {section === 'blocks' && (
          <div>
            <h3>Khối kiến thức</h3>
            <div className="row">
              <input placeholder="Tên khối" value={blockName} onChange={(e) => setBlockName(e.target.value)} />
              <button className="qb-btn qb-btn-primary" onClick={onAddBlock}>Thêm</button>
            </div>
            <ul>
              {blocks.map((b) => (
                <li key={b.id}>{b.name} <small>({b.id})</small></li>
              ))}
            </ul>
          </div>
        )}

        {section === 'subjects' && (
          <div>
            <h3>Môn học</h3>
            <div className="row">
              <input placeholder="Mã môn" value={subCode} onChange={(e) => setSubCode(e.target.value)} />
              <input placeholder="Tên môn" value={subName} onChange={(e) => setSubName(e.target.value)} />
              <input type="number" placeholder="Tín chỉ" value={subCredits} onChange={(e) => setSubCredits(Number(e.target.value))} />
              <button className="qb-btn qb-btn-primary" onClick={onAddSubject}>Thêm</button>
            </div>
            <ul>
              {subjects.map((s) => (
                <li key={s.id}>{s.code} - {s.name} ({s.credits} tc)</li>
              ))}
            </ul>
          </div>
        )}

        {section === 'questions' && (
          <div>
            <h3>Quản lý câu hỏi</h3>
            <div className="row">
              <select value={qSubject} onChange={(e) => setQSubject(e.target.value)}>
                <option value="">-- Chọn môn --</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
              </select>
              <select value={qBlock} onChange={(e) => setQBlock(e.target.value)}>
                <option value="">-- Khối kiến thức (tuỳ chọn) --</option>
                {blocks.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <select value={qDifficulty} onChange={(e) => setQDifficulty(e.target.value as svc.Difficulty)}>
                <option>Dễ</option>
                <option>Trung bình</option>
                <option>Khó</option>
                <option>Rất khó</option>
              </select>
            </div>
            <textarea placeholder="Nội dung câu hỏi" value={qContent} onChange={(e) => setQContent(e.target.value)} />
            <div className="row"><button className="qb-btn qb-btn-primary" onClick={onAddQuestion}>Lưu câu hỏi</button></div>

            <h4>Danh sách câu hỏi</h4>
            <ul>
              {questions.map((q) => (
                <li key={q.id}><strong>{q.difficulty}</strong> — {q.content} <small>({q.id})</small></li>
              ))}
            </ul>
          </div>
        )}

        {section === 'exams' && (
          <div>
            <h3>Tạo đề thi tự động</h3>
            <div className="row">
              <input placeholder="Tiêu đề đề" value={examTitle} onChange={(e) => setExamTitle(e.target.value)} />
            </div>
            <div className="template">
              {templateItems.map((t, i) => (
                <div key={i} className="template-row">
                  <select value={t.difficulty} onChange={(e) => { const arr = [...templateItems]; arr[i].difficulty = e.target.value as svc.Difficulty; setTemplateItems(arr); }}>
                    <option>Dễ</option>
                    <option>Trung bình</option>
                    <option>Khó</option>
                    <option>Rất khó</option>
                  </select>
                  <select value={t.knowledgeBlockId || ''} onChange={(e) => { const arr = [...templateItems]; arr[i].knowledgeBlockId = e.target.value || undefined; setTemplateItems(arr); }}>
                    <option value="">-- Tất cả khối --</option>
                    {blocks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                  <input type="number" value={t.count} onChange={(e) => { const arr = [...templateItems]; arr[i].count = Number(e.target.value); setTemplateItems(arr); }} />
                </div>
              ))}
              <div className="row">
                <button className="qb-btn" onClick={() => setTemplateItems([...templateItems, { difficulty: 'Dễ', count: 1 }])}>Thêm dòng</button>
                <button className="qb-btn" onClick={() => setTemplateItems(templateItems.slice(0, -1))}>Xoá dòng</button>
              </div>
            </div>
            <div className="row"><button className="qb-btn qb-btn-primary" onClick={onGenerateExam}>Tạo đề</button></div>

            <h4>Đề đã tạo</h4>
            <ul>
              {examList.map((e) => (
                <li key={e.id}>
                  <div style={{display:'flex',flexDirection:'column'}}>
                    <strong>{e.title}</strong>
                    <small>{e.questions.length} câu — {new Date(e.createdAt).toLocaleString()}</small>
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <button className="qb-btn" onClick={() => onEditExam(e)}>Sửa</button>
                    <button className="qb-btn qb-btn-danger" onClick={() => onDeleteExam(e.id)}>Xoá</button>
                  </div>
                </li>
              ))}
            </ul>

            {editingExamId && (
              <div className="edit-panel">
                <h4>Chỉnh sửa đề</h4>
                <div className="row"><input value={examTitle} onChange={(e) => setExamTitle(e.target.value)} /></div>
                <div className="template">
                  {templateItems.map((t, i) => (
                    <div key={i} className="template-row">
                      <select value={t.difficulty} onChange={(e) => { const arr = [...templateItems]; arr[i].difficulty = e.target.value as svc.Difficulty; setTemplateItems(arr); }}>
                        <option>Dễ</option>
                        <option>Trung bình</option>
                        <option>Khó</option>
                        <option>Rất khó</option>
                      </select>
                      <select value={t.knowledgeBlockId || ''} onChange={(e) => { const arr = [...templateItems]; arr[i].knowledgeBlockId = e.target.value || undefined; setTemplateItems(arr); }}>
                        <option value="">-- Tất cả khối --</option>
                        {blocks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                      <input type="number" value={t.count} onChange={(e) => { const arr = [...templateItems]; arr[i].count = Number(e.target.value); setTemplateItems(arr); }} />
                    </div>
                  ))}
                  <div className="row">
                    <button onClick={() => setTemplateItems([...templateItems, { difficulty: 'Dễ', count: 1 }])}>Thêm dòng</button>
                    <button onClick={() => setTemplateItems(templateItems.slice(0, -1))}>Xoá dòng</button>
                  </div>
                </div>
                <div className="row">
                  <button onClick={onSaveExamEdit}>Lưu thay đổi</button>
                  <button onClick={onCancelEdit}>Huỷ</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
