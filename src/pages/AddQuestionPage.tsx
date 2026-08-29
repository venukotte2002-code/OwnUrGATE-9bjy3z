import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Eye, Save, RotateCcw, Scan, CheckCircle2, AlertCircle } from "lucide-react";
import MathRenderer from "@/components/features/MathRenderer";
import { getSubjects, saveQuestion } from "@/lib/storage";
import { cn, calcNegativeMarks } from "@/lib/utils";
import { OPTION_LABELS } from "@/constants";
import type { QuestionType, Difficulty } from "@/types";

const INITIAL_FORM = {
  subjectId: "",
  topic: "",
  questionText: "",
  questionType: "MCQ" as QuestionType,
  options: ["", "", "", ""],
  correctAnswer: [] as string[],
  natValue: "",
  natTolerance: "0",
  marks: 1,
  explanation: "",
  difficulty: "Medium" as Difficulty,
};

type Toast = { type: "success" | "error"; msg: string } | null;

export default function AddQuestionPage() {
  const navigate = useNavigate();
  const subjects = getSubjects();
  const [form, setForm] = useState(INITIAL_FORM);
  const [preview, setPreview] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const negMarks = calcNegativeMarks(form.questionType, form.marks);

  const handleOptionChange = (i: number, val: string) => {
    const newOpts = [...form.options];
    newOpts[i] = val;
    setForm(f => ({ ...f, options: newOpts }));
  };

  const toggleAnswer = (label: string) => {
    if (form.questionType === "MCQ") {
      setForm(f => ({ ...f, correctAnswer: [label] }));
    } else {
      setForm(f => ({
        ...f,
        correctAnswer: f.correctAnswer.includes(label)
          ? f.correctAnswer.filter(a => a !== label)
          : [...f.correctAnswer, label],
      }));
    }
  };

  const simulateOCR = (fileName: string) => {
    setOcrLoading(true);
    setTimeout(() => {
      const samples = [
        "What is the time complexity of binary search on a sorted array of $n$ elements?\n(A) $O(1)$\n(B) $O(\\log n)$\n(C) $O(n)$\n(D) $O(n \\log n)$",
        "The number of edges in a complete graph $K_n$ is $\\frac{n(n-1)}{2}$. For $K_5$, the number of edges is:",
        "Which scheduling algorithm gives minimum average waiting time for a given set of processes?\n(A) FCFS\n(B) SJF\n(C) Round Robin\n(D) Priority",
      ];
      const extracted = samples[Math.floor(Math.random() * samples.length)];
      setOcrResult(extracted);
      setForm(f => ({ ...f, questionText: extracted }));
      setOcrLoading(false);
      showToast("success", "OCR extraction complete! Review and edit the text.");
    }, 1800);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      simulateOCR(file.name);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) simulateOCR(file.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subjectId) return showToast("error", "Please select a subject.");
    if (!form.questionText.trim()) return showToast("error", "Question text is required.");
    if (form.questionType !== "NAT") {
      if (form.options.some(o => !o.trim())) return showToast("error", "All options must be filled.");
      if (form.correctAnswer.length === 0) return showToast("error", "Mark at least one correct answer.");
    } else {
      if (!form.natValue.trim()) return showToast("error", "Enter the NAT correct answer.");
    }

    const sub = subjects.find(s => s.id === form.subjectId);
    saveQuestion({
      subjectId: form.subjectId,
      subjectName: sub?.name || "",
      topic: form.topic,
      questionText: form.questionText,
      questionType: form.questionType,
      options: form.questionType !== "NAT" ? form.options : [],
      optionImages: [],
      correctAnswer: form.questionType !== "NAT" ? form.correctAnswer : [],
      natAnswer: form.questionType === "NAT" ? { correctValue: parseFloat(form.natValue), tolerance: parseFloat(form.natTolerance) || 0 } : undefined,
      marks: form.marks,
      negativeMarks: negMarks,
      explanation: form.explanation,
      difficulty: form.difficulty,
      isActive: true,
    });
    showToast("success", "Question saved successfully!");
    setTimeout(() => navigate("/question-bank"), 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-card text-sm font-medium animate-slide-up",
          toast.type === "success" ? "bg-gate-answered/15 border-gate-answered/30 text-gate-answered" : "bg-gate-unanswered/15 border-gate-unanswered/30 text-gate-unanswered"
        )}>
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Add Question</h2>
          <p className="text-text-secondary text-sm">Manual entry or OCR screenshot extraction</p>
        </div>
        <button
          onClick={() => setPreview(!preview)}
          className={cn("btn-secondary flex items-center gap-1.5", preview && "border-brand-blue/40 text-brand-blue")}
        >
          <Eye size={14} /> {preview ? "Edit" : "Preview"}
        </button>
      </div>

      {/* OCR Drop Zone */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Scan size={16} className="text-brand-blue" />
          <span className="text-text-primary font-semibold text-sm">OCR Screenshot Extraction</span>
          <span className="text-xs text-text-muted bg-bg-secondary px-2 py-0.5 rounded-full border border-bg-border ml-1">Simulated</span>
        </div>
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
            dragOver ? "border-brand-blue bg-brand-blue/5" : "border-bg-border hover:border-brand-blue/40 hover:bg-brand-blue/3"
          )}
        >
          {ocrLoading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
              <span className="text-text-secondary text-sm">Running Tesseract.js OCR...</span>
            </div>
          ) : (
            <>
              <Upload size={24} className="mx-auto text-text-muted mb-2" />
              <p className="text-text-secondary text-sm mb-1">Drop question screenshot here</p>
              <p className="text-text-muted text-xs mb-3">Supports PNG, JPG, WEBP · Tesseract.js + Math Cleaner</p>
              <label className="btn-secondary text-xs cursor-pointer">
                <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
                Browse File
              </label>
            </>
          )}
        </div>
        {ocrResult && (
          <div className="mt-3 p-3 bg-gate-answered/5 border border-gate-answered/20 rounded-lg text-xs text-text-secondary">
            <span className="text-gate-answered font-semibold">Extracted: </span>{ocrResult.slice(0, 80)}...
          </div>
        )}
      </div>

      {preview ? (
        /* Preview Panel */
        <div className="glass-card p-5 space-y-4">
          <h3 className="text-text-primary font-semibold text-sm uppercase tracking-wide">Live Preview</h3>
          <div className="text-text-primary leading-relaxed">
            <MathRenderer text={form.questionText || "_No question text yet..._"} block />
          </div>
          {form.questionType !== "NAT" && form.options.some(o => o) && (
            <div className="space-y-2">
              {form.options.map((opt, i) => opt ? (
                <div key={i} className={cn("flex gap-2 items-center p-2.5 rounded-lg text-sm", form.correctAnswer.includes(OPTION_LABELS[i]) ? "bg-gate-answered/10 border border-gate-answered/25 text-gate-answered" : "bg-bg-secondary border border-bg-border text-text-secondary")}>
                  <span className="w-5 h-5 rounded-full bg-bg-elevated flex items-center justify-center text-xs font-bold">{OPTION_LABELS[i]}</span>
                  <MathRenderer text={opt} />
                </div>
              ) : null)}
            </div>
          )}
          {form.explanation && (
            <div className="p-3 bg-bg-secondary rounded-lg border border-bg-border text-sm text-text-secondary">
              <span className="text-text-accent font-semibold">Explanation: </span>
              <MathRenderer text={form.explanation} />
            </div>
          )}
        </div>
      ) : (
        /* Edit Form */
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-text-primary font-semibold text-sm uppercase tracking-wide border-b border-bg-border pb-2">Question Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Subject *</label>
                <select value={form.subjectId} onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))} className="input-field" required>
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Topic</label>
                <input type="text" placeholder="e.g. Time Complexity" value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="label">Question Type *</label>
                <select value={form.questionType} onChange={e => setForm(f => ({ ...f, questionType: e.target.value as QuestionType, correctAnswer: [] }))} className="input-field">
                  <option value="MCQ">MCQ — Single Correct</option>
                  <option value="MSQ">MSQ — Multiple Select</option>
                  <option value="NAT">NAT — Numerical Answer</option>
                </select>
              </div>
              <div>
                <label className="label">Difficulty</label>
                <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as Difficulty }))} className="input-field">
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Unrated">Unrated</option>
                </select>
              </div>
              <div>
                <label className="label">Marks</label>
                <select value={form.marks} onChange={e => setForm(f => ({ ...f, marks: Number(e.target.value) }))} className="input-field">
                  <option value={1}>1 Mark</option>
                  <option value={2}>2 Marks</option>
                </select>
              </div>
              <div>
                <label className="label">Negative Marks (Auto)</label>
                <div className="input-field bg-bg-elevated cursor-not-allowed text-text-muted">{negMarks} marks</div>
              </div>
            </div>

            <div>
              <label className="label">Question Text * (LaTeX supported: $formula$)</label>
              <textarea
                rows={4}
                value={form.questionText}
                onChange={e => setForm(f => ({ ...f, questionText: e.target.value }))}
                placeholder="Enter question text. Use $...$ for inline LaTeX, $$...$$ for display math."
                className="input-field resize-none"
              />
            </div>
          </div>

          {/* Options / NAT */}
          <div className="glass-card p-5 space-y-3">
            <h3 className="text-text-primary font-semibold text-sm uppercase tracking-wide border-b border-bg-border pb-2">
              {form.questionType === "NAT" ? "Numerical Answer" : `Options (${form.questionType === "MSQ" ? "Multi-select" : "Single correct"})`}
            </h3>
            {form.questionType === "NAT" ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Correct Value *</label>
                  <input type="number" step="any" value={form.natValue} onChange={e => setForm(f => ({ ...f, natValue: e.target.value }))} placeholder="e.g. 42.5" className="input-field" />
                </div>
                <div>
                  <label className="label">Tolerance (±)</label>
                  <input type="number" step="any" value={form.natTolerance} onChange={e => setForm(f => ({ ...f, natTolerance: e.target.value }))} placeholder="0" className="input-field" />
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {OPTION_LABELS.map((label, i) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => toggleAnswer(label)}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2 transition-all",
                        form.correctAnswer.includes(label)
                          ? "bg-gate-answered border-gate-answered text-white"
                          : "border-bg-border text-text-muted hover:border-brand-blue/50"
                      )}
                    >
                      {label}
                    </button>
                    <input
                      type="text"
                      value={form.options[i]}
                      onChange={e => handleOptionChange(i, e.target.value)}
                      placeholder={`Option ${label} (LaTeX OK)`}
                      className="input-field"
                    />
                  </div>
                ))}
                <p className="text-text-muted text-xs">Click a letter to mark as correct answer</p>
              </div>
            )}
          </div>

          <div className="glass-card p-5">
            <label className="label">Explanation / Solution (optional, LaTeX OK)</label>
            <textarea rows={3} value={form.explanation} onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))} placeholder="Step-by-step solution..." className="input-field resize-none" />
          </div>

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setForm(INITIAL_FORM)} className="btn-secondary flex items-center gap-1.5">
              <RotateCcw size={14} /> Reset
            </button>
            <button type="submit" className="btn-primary flex items-center gap-1.5">
              <Save size={14} /> Save Question
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
