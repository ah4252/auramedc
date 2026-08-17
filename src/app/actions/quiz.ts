"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUserId, requireAdmin, requireUser } from "@/lib/auth-helpers";

const quizPrisma = prisma as any;
const QUESTION_TYPES = ["MULTIPLE_CHOICE"] as const;
const DIFFICULTY_VALUES = ["EASY", "MEDIUM", "HARD"] as const;

function isMissingTableError(error: any) {
  return error?.code === "P2021" || /does not exist in the current database|table .* does not exist/i.test(error?.message || "");
}

function isDatabaseUnavailableError(error: any) {
  return error?.code === "P1001" || /Can't reach database server|connection.*refused|ECONNREFUSED|database server.*running|timeout/i.test(error?.message || "");
}

function ensureQuizModels() {
  const modelNames = [
    "quizQuestion",
    "quizOption",
    "quizExam",
    "quizExamQuestion",
    "quizAttempt",
    "quizAttemptAnswer",
  ];

  const missing = modelNames.filter((name) => !quizPrisma[name]);
  if (missing.length) {
    throw new Error(`نماذج Quiz غير متاحة في Prisma الحالي: ${missing.join(", ")}`);
  }
}

function normalizeDifficulty(value?: string | null) {
  const safe = (value || "MEDIUM").toString().trim().toUpperCase();
  return DIFFICULTY_VALUES.includes(safe as any) ? safe : "MEDIUM";
}

function normalizeQuestionType(value?: string | null) {
  const safe = (value || "MULTIPLE_CHOICE").toString().trim().toUpperCase();
  return QUESTION_TYPES.includes(safe as any) ? safe : "MULTIPLE_CHOICE";
}

function mapDifficultyLabel(value?: string | null) {
  const normalized = normalizeDifficulty(value);
  if (normalized === "EASY") return "سهل";
  if (normalized === "HARD") return "صعب";
  return "متوسط";
}

export async function getQuizDashboardStats() {
  try {
    ensureQuizModels();

    const [questionsCount, publishedQuestions, draftQuestions, examsCount, publishedExams, unpublishedExams, attemptsCount, avgResult, topScore, lowScore, bestExam, hardestExam, mostMissedQuestion] = await Promise.all([
      quizPrisma.quizQuestion.count(),
      quizPrisma.quizQuestion.count({ where: { isPublished: true } }),
      quizPrisma.quizQuestion.count({ where: { isPublished: false } }),
      quizPrisma.quizExam.count(),
      quizPrisma.quizExam.count({ where: { isPublished: true } }),
      quizPrisma.quizExam.count({ where: { isPublished: false } }),
      quizPrisma.quizAttempt.count({ where: { status: "COMPLETED" } }),
      quizPrisma.quizAttempt.aggregate({
        _avg: { percentage: true },
        where: { status: "COMPLETED" },
      }),
      quizPrisma.quizAttempt.aggregate({
        _max: { percentage: true },
        where: { status: "COMPLETED" },
      }),
      quizPrisma.quizAttempt.aggregate({
        _min: { percentage: true },
        where: { status: "COMPLETED" },
      }),
      quizPrisma.quizExam.findFirst({
        where: { isPublished: true },
        include: { attempts: true },
        orderBy: { attempts: { _count: "desc" } },
      }),
      quizPrisma.quizExam.findFirst({
        where: { isPublished: true },
        orderBy: { questionCount: "desc" },
      }),
      quizPrisma.quizAttemptAnswer.groupBy({
        by: ["questionId"],
        where: { isCorrect: false },
        _count: { questionId: true },
        orderBy: { _count: { questionId: "desc" } },
        take: 1,
      }),
    ]);

    const avg = Number(avgResult._avg?.percentage ?? 0);
    const top = Number(topScore._max?.percentage ?? 0);
    const low = Number(lowScore._min?.percentage ?? 0);

    const mostMissed = mostMissedQuestion[0]?.questionId
      ? await quizPrisma.quizQuestion.findUnique({
          where: { id: mostMissedQuestion[0].questionId },
          select: { text: true },
        })
      : null;

    return {
      totalQuestions: questionsCount,
      publishedQuestions,
      draftQuestions,
      totalExams: examsCount,
      publishedExams,
      unpublishedExams,
      totalAttempts: attemptsCount,
      averageScore: Number.isFinite(avg) ? avg : 0,
      topScore: Number.isFinite(top) ? top : 0,
      lowestScore: Number.isFinite(low) ? low : 0,
      mostSolvedExam: bestExam ? { id: bestExam.id, title: bestExam.title, attempts: bestExam.attempts.length } : null,
      hardestExam: hardestExam ? { id: hardestExam.id, title: hardestExam.title, questionCount: hardestExam.questionCount } : null,
      mostMissedQuestion: mostMissed ? { id: mostMissedQuestion[0].questionId, text: mostMissed.text } : null,
    };
  } catch (error) {
    if (isMissingTableError(error) || isDatabaseUnavailableError(error)) {
      return {
        totalQuestions: 0,
        publishedQuestions: 0,
        draftQuestions: 0,
        totalExams: 0,
        publishedExams: 0,
        unpublishedExams: 0,
        totalAttempts: 0,
        averageScore: 0,
        topScore: 0,
        lowestScore: 0,
        mostSolvedExam: null,
        hardestExam: null,
        mostMissedQuestion: null,
      };
    }

    console.warn("Quiz dashboard unavailable:", (error as any)?.message || error);
    return {
      totalQuestions: 0,
      publishedQuestions: 0,
      draftQuestions: 0,
      totalExams: 0,
      publishedExams: 0,
      unpublishedExams: 0,
      totalAttempts: 0,
      averageScore: 0,
      topScore: 0,
      lowestScore: 0,
      mostSolvedExam: null,
      hardestExam: null,
      mostMissedQuestion: null,
    };
  }
}

export async function getQuizQuestionBank(params?: { search?: string; subjectId?: string; studyYear?: string; difficulty?: string; status?: string; page?: number; pageSize?: number }) {
  try {
    ensureQuizModels();

    const page = Math.max(1, Number(params?.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Number(params?.pageSize ?? 12)));
    const skip = (page - 1) * pageSize;

    const where: any = {};

    if (params?.search) {
      where.OR = [
        { text: { contains: params.search, mode: "insensitive" } },
        { keywords: { contains: params.search, mode: "insensitive" } },
      ];
    }

    if (params?.subjectId) where.subjectId = params.subjectId;
    if (params?.studyYear) where.studyYear = params.studyYear;
    if (params?.difficulty) where.difficulty = normalizeDifficulty(params.difficulty);
    if (params?.status) {
      if (params.status === "PUBLISHED") where.isPublished = true;
      if (params.status === "DRAFT") where.isPublished = false;
    }

    const [questions, total] = await Promise.all([
      quizPrisma.quizQuestion.findMany({
        where,
        include: {
          subject: true,
          options: { orderBy: { order: "asc" } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      quizPrisma.quizQuestion.count({ where }),
    ]);

    return {
      questions: questions.map((question) => ({
        ...question,
        difficultyLabel: mapDifficultyLabel(question.difficulty),
      })),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  } catch (error) {
    if (isMissingTableError(error) || isDatabaseUnavailableError(error)) {
      return { questions: [], total: 0, page: 1, pageSize: 12, totalPages: 1 };
    }

    console.warn("Quiz question bank unavailable:", (error as any)?.message || error);
    return { questions: [], total: 0, page: 1, pageSize: 12, totalPages: 1 };
  }
}

export async function getQuizQuestionById(questionId: string) {
  try {
    ensureQuizModels();
    return await quizPrisma.quizQuestion.findUnique({
      where: { id: questionId },
      include: {
        subject: true,
        options: { orderBy: { order: "asc" } },
      },
    });
  } catch (error) {
    if (isMissingTableError(error) || isDatabaseUnavailableError(error)) {
      return null;
    }
    throw error;
  }
}

export async function createQuizQuestion(data: {
  text: string;
  subjectId: string;
  studyYear: string;
  difficulty?: string;
  type?: string;
  explanation?: string;
  hint?: string;
  reference?: string;
  keywords?: string;
  isPublished?: boolean;
  options: Array<{ text: string; isCorrect?: boolean; order?: number }>;
}) {
  await requireAdmin();

  const safeText = data.text?.trim();
  if (!safeText) throw new Error("نص السؤال مطلوب");
  if (!data.subjectId) throw new Error("المادة مطلوبة");
  if (!data.studyYear) throw new Error("السنة الدراسية مطلوبة");
  if (!data.options?.length || data.options.filter((o) => o.text?.trim()).length < 2) {
    throw new Error("يجب إدخال خيارين على الأقل");
  }

  ensureQuizModels();

  const question = await quizPrisma.quizQuestion.create({
    data: {
      text: safeText,
      subjectId: data.subjectId,
      studyYear: data.studyYear,
      difficulty: normalizeDifficulty(data.difficulty),
      type: normalizeQuestionType(data.type),
      explanation: data.explanation || null,
      hint: data.hint || null,
      reference: data.reference || null,
      keywords: data.keywords || null,
      isPublished: !!data.isPublished,
      options: {
        create: data.options
          .map((option, index) => ({
            text: option.text.trim(),
            isCorrect: !!option.isCorrect,
            order: option.order ?? index,
          }))
          .filter((option) => option.text),
      },
    },
    include: { options: true },
  });

  revalidatePath("/admin/quiz");
  revalidatePath("/quiz");
  return { success: true, questionId: question.id };
}

export async function updateQuizQuestion(questionId: string, data: {
  text?: string;
  subjectId?: string;
  studyYear?: string;
  difficulty?: string;
  type?: string;
  explanation?: string;
  hint?: string;
  reference?: string;
  keywords?: string;
  isPublished?: boolean;
  options?: Array<{ id?: string; text: string; isCorrect?: boolean; order?: number }>;
}) {
  await requireAdmin();
  if (!questionId) throw new Error("معرف السؤال غير موجود");

  ensureQuizModels();

  const currentQuestion = await quizPrisma.quizQuestion.findUnique({
    where: { id: questionId },
    include: { options: true },
  });

  if (!currentQuestion) throw new Error("السؤال غير موجود");

  await quizPrisma.$transaction(async (tx: any) => {
    await tx.quizQuestion.update({
      where: { id: questionId },
      data: {
        text: data.text?.trim() || currentQuestion.text,
        subjectId: data.subjectId || currentQuestion.subjectId,
        studyYear: data.studyYear || currentQuestion.studyYear,
        difficulty: normalizeDifficulty(data.difficulty ?? currentQuestion.difficulty),
        type: normalizeQuestionType(data.type ?? currentQuestion.type),
        explanation: data.explanation ?? currentQuestion.explanation,
        hint: data.hint ?? currentQuestion.hint,
        reference: data.reference ?? currentQuestion.reference,
        keywords: data.keywords ?? currentQuestion.keywords,
        isPublished: data.isPublished ?? currentQuestion.isPublished,
      },
    });

    if (data.options) {
      await tx.quizOption.deleteMany({ where: { questionId } });
      await tx.quizOption.createMany({
        data: data.options.filter((op) => op.text?.trim()).map((option, index) => ({
          questionId,
          text: option.text.trim(),
          isCorrect: !!option.isCorrect,
          order: option.order ?? index,
        })),
      });
    }
  });

  revalidatePath("/admin/quiz");
  revalidatePath("/quiz");
  return { success: true };
}

export async function deleteQuizQuestion(questionId: string) {
  await requireAdmin();
  ensureQuizModels();
  await quizPrisma.quizQuestion.delete({ where: { id: questionId } });
  revalidatePath("/admin/quiz");
  revalidatePath("/quiz");
  return { success: true };
}

export async function cloneQuizQuestion(questionId: string) {
  await requireAdmin();
  ensureQuizModels();

  const question = await quizPrisma.quizQuestion.findUnique({
    where: { id: questionId },
    include: { options: true },
  });

  if (!question) throw new Error("السؤال غير موجود");

  const cloned = await quizPrisma.quizQuestion.create({
    data: {
      text: `${question.text} (نسخة)`,
      subjectId: question.subjectId,
      studyYear: question.studyYear,
      difficulty: question.difficulty,
      type: question.type,
      explanation: question.explanation,
      hint: question.hint,
      reference: question.reference,
      keywords: question.keywords,
      isPublished: false,
      options: {
        create: question.options.map((option, index) => ({
          text: option.text,
          isCorrect: option.isCorrect,
          order: option.order ?? index,
        })),
      },
    },
  });

  revalidatePath("/admin/quiz");
  return { success: true, questionId: cloned.id };
}

export async function toggleQuizQuestionPublish(questionId: string) {
  await requireAdmin();
  ensureQuizModels();

  const question = await quizPrisma.quizQuestion.findUnique({ where: { id: questionId } });
  if (!question) throw new Error("السؤال غير موجود");

  const updated = await quizPrisma.quizQuestion.update({
    where: { id: questionId },
    data: { isPublished: !question.isPublished },
  });

  revalidatePath("/admin/quiz");
  revalidatePath("/quiz");
  return { success: true, isPublished: updated.isPublished };
}

export async function getQuizExams(params?: { subjectId?: string; studyYear?: string; difficulty?: string; published?: boolean }) {
  try {
    ensureQuizModels();

    const where: any = {};
    if (params?.subjectId) where.subjectId = params.subjectId;
    if (params?.studyYear) where.studyYear = params.studyYear;
    if (params?.difficulty) where.difficulty = normalizeDifficulty(params.difficulty);
    if (typeof params?.published !== "undefined") where.isPublished = params.published;

    const exams = await quizPrisma.quizExam.findMany({
      where,
      include: {
        subject: true,
        questions: { include: { question: { include: { options: true } } }, orderBy: { order: "asc" } },
        attempts: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return exams.map((exam) => ({
      ...exam,
      difficultyLabel: exam.difficulty ? mapDifficultyLabel(exam.difficulty) : "متوسط",
      attemptsCount: exam.attempts.length,
      questionCount: exam.questions.length,
    }));
  } catch (error) {
    if (isMissingTableError(error) || isDatabaseUnavailableError(error)) return [];
    throw error;
  }
}

export async function createQuizExam(data: {
  title: string;
  description?: string;
  subjectId: string;
  studyYear: string;
  difficulty?: string;
  questionCount?: number;
  durationMinutes?: number;
  passScore?: number;
  allowRetake?: boolean;
  randomizeQuestions?: boolean;
  randomizeOptions?: boolean;
  showAnswerExplanation?: boolean;
  isPublished?: boolean;
  questionIds?: string[];
}) {
  await requireAdmin();

  if (!data.title?.trim()) throw new Error("اسم الاختبار مطلوب");
  if (!data.subjectId) throw new Error("المادة مطلوبة");
  if (!data.studyYear) throw new Error("السنة الدراسية مطلوبة");

  ensureQuizModels();

  const exam = await quizPrisma.quizExam.create({
    data: {
      title: data.title.trim(),
      description: data.description || "",
      subjectId: data.subjectId,
      studyYear: data.studyYear,
      difficulty: normalizeDifficulty(data.difficulty),
      questionCount: Number(data.questionCount || 0),
      durationMinutes: Number(data.durationMinutes || 20),
      passScore: Number(data.passScore || 60),
      allowRetake: !!data.allowRetake,
      randomizeQuestions: !!data.randomizeQuestions,
      randomizeOptions: !!data.randomizeOptions,
      showAnswerExplanation: data.showAnswerExplanation !== false,
      isPublished: !!data.isPublished,
      questions: {
        create: (data.questionIds || []).map((questionId, index) => ({
          questionId,
          order: index,
        })),
      },
    },
  });

  revalidatePath("/admin/quiz");
  revalidatePath("/quiz");
  return { success: true, examId: exam.id };
}

export async function updateQuizExam(examId: string, data: Partial<{
  title: string;
  description: string;
  subjectId: string;
  studyYear: string;
  difficulty: string;
  questionCount: number;
  durationMinutes: number;
  passScore: number;
  allowRetake: boolean;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  showAnswerExplanation: boolean;
  isPublished: boolean;
  questionIds: string[];
}>) {
  await requireAdmin();

  if (!examId) throw new Error("معرف الاختبار غير موجود");

  ensureQuizModels();

  const currentExam = await quizPrisma.quizExam.findUnique({ where: { id: examId }, include: { questions: true } });
  if (!currentExam) throw new Error("الاختبار غير موجود");

  await quizPrisma.$transaction(async (tx: any) => {
    await tx.quizExam.update({
      where: { id: examId },
      data: {
        title: data.title?.trim() || currentExam.title,
        description: typeof data.description === "string" ? data.description : currentExam.description,
        subjectId: data.subjectId || currentExam.subjectId,
        studyYear: data.studyYear || currentExam.studyYear,
        difficulty: normalizeDifficulty(data.difficulty || currentExam.difficulty || "MEDIUM"),
        durationMinutes: Number(data.durationMinutes ?? currentExam.durationMinutes),
        passScore: Number(data.passScore ?? currentExam.passScore),
        allowRetake: typeof data.allowRetake === "boolean" ? data.allowRetake : currentExam.allowRetake,
        randomizeQuestions: typeof data.randomizeQuestions === "boolean" ? data.randomizeQuestions : currentExam.randomizeQuestions,
        randomizeOptions: typeof data.randomizeOptions === "boolean" ? data.randomizeOptions : currentExam.randomizeOptions,
        showAnswerExplanation: typeof data.showAnswerExplanation === "boolean" ? data.showAnswerExplanation : currentExam.showAnswerExplanation,
        isPublished: typeof data.isPublished === "boolean" ? data.isPublished : currentExam.isPublished,
        questionCount: Number(data.questionCount ?? currentExam.questions.length),
      },
    });

    if (data.questionIds) {
      await tx.quizExamQuestion.deleteMany({ where: { examId } });
      await tx.quizExamQuestion.createMany({
        data: data.questionIds.map((questionId, order) => ({ examId, questionId, order })),
      });
    }
  });

  revalidatePath("/admin/quiz");
  revalidatePath("/quiz");
  return { success: true };
}

export async function toggleQuizExamPublish(examId: string) {
  await requireAdmin();
  ensureQuizModels();

  const exam = await quizPrisma.quizExam.findUnique({ where: { id: examId } });
  if (!exam) throw new Error("الاختبار غير موجود");

  const updated = await quizPrisma.quizExam.update({
    where: { id: examId },
    data: { isPublished: !exam.isPublished },
  });

  revalidatePath("/admin/quiz");
  revalidatePath("/quiz");
  return { success: true, isPublished: updated.isPublished };
}

export async function deleteQuizExam(examId: string) {
  await requireAdmin();
  ensureQuizModels();
  await quizPrisma.quizExam.delete({ where: { id: examId } });
  revalidatePath("/admin/quiz");
  revalidatePath("/quiz");
  return { success: true };
}

export async function getPublishedQuizExamsForStudent() {
  try {
    ensureQuizModels();
    const userId = await getCurrentUserId();
    const exams = await quizPrisma.quizExam.findMany({
      where: {
        OR: [
          { isPublished: true },
          { questions: { some: { question: { isPublished: true } } } },
        ],
      },
      include: {
        subject: true,
        questions: {
          where: { question: { isPublished: true } },
          include: { question: { include: { options: true } } },
        },
        attempts: userId ? { where: { userId }, orderBy: { createdAt: "desc" } } : undefined,
      },
      orderBy: { createdAt: "desc" },
    });

    return exams.map((exam) => ({
      ...exam,
      questionCount: exam.questions.length,
      bestScore: exam.attempts.length > 0 ? Math.max(...exam.attempts.map((attempt) => Number(attempt.percentage || 0))) : null,
      difficultyLabel: exam.difficulty ? mapDifficultyLabel(exam.difficulty) : "متوسط",
    }));
  } catch (error) {
    if (isMissingTableError(error) || isDatabaseUnavailableError(error)) return [];
    console.warn("Quiz exam list unavailable:", (error as any)?.message || error);
    return [];
  }
}

export async function getPublishedQuizQuestionsForStudent(params?: { studyYear?: string; subjectId?: string }) {
  try {
    ensureQuizModels();
    const where: any = { isPublished: true };

    if (params?.studyYear) where.studyYear = params.studyYear;
    if (params?.subjectId) where.subjectId = params.subjectId;

    const questions = await quizPrisma.quizQuestion.findMany({
      where,
      include: {
        subject: true,
        options: { orderBy: { order: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return questions.map((question) => ({
      ...question,
      difficultyLabel: mapDifficultyLabel(question.difficulty),
    }));
  } catch (error) {
    if (isMissingTableError(error) || isDatabaseUnavailableError(error)) return [];
    console.warn("Quiz questions unavailable:", (error as any)?.message || error);
    return [];
  }
}

export async function startQuizAttempt(examId: string) {
  try {
    const userId = await requireUser();
    ensureQuizModels();

    const exam = await quizPrisma.quizExam.findUnique({
      where: { id: examId },
      include: {
        questions: {
          where: { question: { isPublished: true } },
          include: { question: { include: { options: true } } },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!exam || (!exam.isPublished && exam.questions.length === 0)) throw new Error("هذا الاختبار غير منشور أو غير موجود");

    let existingAttempt = await quizPrisma.quizAttempt.findFirst({
      where: { userId, examId, status: "IN_PROGRESS" },
      orderBy: { createdAt: "desc" },
    });

    if (!existingAttempt) {
      existingAttempt = await quizPrisma.quizAttempt.create({
        data: {
          userId,
          examId,
          status: "IN_PROGRESS",
          startedAt: new Date(),
        },
      });
    }

    const existingAnswers = await quizPrisma.quizAttemptAnswer.findMany({
      where: { attemptId: existingAttempt.id },
      select: { questionId: true },
    });

    const existingIds = new Set(existingAnswers.map((answer) => answer.questionId));

    for (const item of exam.questions) {
      if (!existingIds.has(item.questionId)) {
        await quizPrisma.quizAttemptAnswer.create({
          data: {
            attemptId: existingAttempt.id,
            questionId: item.questionId,
            selectedOptionId: null,
            isCorrect: false,
          },
        });
      }
    }

    return { success: true, attemptId: existingAttempt.id };
  } catch (error) {
    if (isMissingTableError(error) || isDatabaseUnavailableError(error) || /Quiz.*not available|نماذج Quiz/i.test((error as any)?.message || "")) {
      return { success: false, error: "خدمة الاختبارات غير متاحة حالياً، حاول لاحقاً." };
    }
    console.warn("startQuizAttempt failed:", (error as any)?.message || error);
    return { success: false, error: (error as any)?.message || "حدث خطأ أثناء بدء الاختبار" };
  }
}

export async function getQuizAttemptById(attemptId: string) {
  try {
    const userId = await requireUser();
    ensureQuizModels();

    const attempt = await quizPrisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        exam: {
          include: {
            subject: true,
            questions: { include: { question: { include: { options: { orderBy: { order: "asc" } } } } }, orderBy: { order: "asc" } },
          },
        },
        answers: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!attempt || attempt.userId !== userId) {
      throw new Error("غير مصرح لك بالوصول إلى هذه المحاولة");
    }

    return attempt;
  } catch (error) {
    if (isMissingTableError(error) || isDatabaseUnavailableError(error) || /Quiz.*not available|نماذج Quiz/i.test((error as any)?.message || "")) {
      return null;
    }
    console.warn("getQuizAttemptById failed:", (error as any)?.message || error);
    return null;
  }
}

export async function saveQuizAttemptProgress(attemptId: string, answers: Array<{ questionId: string; optionId: string | null }>) {
  try {
    const userId = await requireUser();
    ensureQuizModels();

    const attempt = await quizPrisma.quizAttempt.findUnique({ where: { id: attemptId } });
    if (!attempt || attempt.userId !== userId) throw new Error("محاولة غير صالحة");

    for (const answer of answers) {
      const target = await quizPrisma.quizAttemptAnswer.findFirst({
        where: { attemptId, questionId: answer.questionId },
      });

      if (!target) {
        await quizPrisma.quizAttemptAnswer.create({
          data: {
            attemptId,
            questionId: answer.questionId,
            selectedOptionId: answer.optionId || null,
            isCorrect: false,
          },
        });
        continue;
      }

      await quizPrisma.quizAttemptAnswer.update({
        where: { id: target.id },
        data: { selectedOptionId: answer.optionId || null },
      });
    }

    return { success: true };
  } catch (error) {
    if (isMissingTableError(error) || isDatabaseUnavailableError(error) || /Quiz.*not available|نماذج Quiz/i.test((error as any)?.message || "")) {
      return { success: false, error: "خدمة الاختبارات غير متاحة حالياً، حاول لاحقاً." };
    }
    console.warn("saveQuizAttemptProgress failed:", (error as any)?.message || error);
    return { success: false, error: (error as any)?.message || "حدث خطأ أثناء حفظ الإجابات" };
  }
}

export async function submitQuizAttempt(attemptId: string) {
  try {
    const userId = await requireUser();
    ensureQuizModels();

    const attempt = await quizPrisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        exam: true,
        answers: true,
      },
    });

    if (!attempt || attempt.userId !== userId) throw new Error("محاولة غير صالحة");
    if (attempt.status === "COMPLETED") return { success: true, alreadySubmitted: true, attemptId };

    const questions = await quizPrisma.quizExamQuestion.findMany({
      where: { examId: attempt.examId },
      include: { question: { include: { options: true } } },
      orderBy: { order: "asc" },
    });

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    for (const item of questions) {
      const answerRow = attempt.answers.find((answer) => answer.questionId === item.questionId);
      const selectedOptionId = answerRow?.selectedOptionId || null;

      const correctOption = item.question.options.find((option) => option.isCorrect);
      if (!selectedOptionId) {
        unansweredCount += 1;
        continue;
      }

      const isCorrect = selectedOptionId === correctOption?.id;
      await quizPrisma.quizAttemptAnswer.updateMany({
        where: { attemptId, questionId: item.questionId },
        data: { isCorrect },
      });

      if (isCorrect) correctCount += 1; else incorrectCount += 1;
    }

    const totalQuestions = questions.length || 1;
    const percentage = Number(((correctCount / totalQuestions) * 100).toFixed(2));
    const passed = correctCount >= Math.ceil((attempt.exam.passScore / 100) * totalQuestions);

    const completedAttempt = await quizPrisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        status: "COMPLETED",
        score: correctCount,
        correctCount,
        incorrectCount,
        unansweredCount,
        percentage,
        completedAt: new Date(),
        resultSummary: passed ? "نجح" : "لم ينجح",
        timeSpentSeconds: Math.max(1, Math.round((Date.now() - new Date(attempt.startedAt).getTime()) / 1000)),
      },
    });

    revalidatePath("/quiz");
    revalidatePath("/profile");
    return { success: true, attemptId, result: completedAttempt, percentage, correctCount, incorrectCount, unansweredCount };
  } catch (error) {
    if (isMissingTableError(error) || isDatabaseUnavailableError(error) || /Quiz.*not available|نماذج Quiz/i.test((error as any)?.message || "")) {
      return { success: false, error: "خدمة الاختبارات غير متاحة حالياً، حاول لاحقاً." };
    }
    console.warn("submitQuizAttempt failed:", (error as any)?.message || error);
    return { success: false, error: (error as any)?.message || "حدث خطأ أثناء إنهاء الاختبار" };
  }
}

export async function getQuizResultsForAdmin() {
  await requireAdmin();
  ensureQuizModels();
  return await quizPrisma.quizAttempt.findMany({
    where: { status: "COMPLETED" },
    include: {
      user: { select: { name: true, email: true } },
      exam: { select: { title: true } },
    },
    orderBy: { completedAt: "desc" },
  });
}

export async function getStudentQuizSummary(userId?: string) {
  const activeUserId = userId || (await getCurrentUserId());
  if (!activeUserId) return null;

  try {
    ensureQuizModels();

    const [attemptsCount, averageScore, bestScore, totalCorrect, totalWrong, totalUnanswered] = await Promise.all([
      quizPrisma.quizAttempt.count({ where: { userId: activeUserId, status: "COMPLETED" } }),
      quizPrisma.quizAttempt.aggregate({
        _avg: { percentage: true },
        where: { userId: activeUserId, status: "COMPLETED" },
      }),
      quizPrisma.quizAttempt.aggregate({
        _max: { percentage: true },
        where: { userId: activeUserId, status: "COMPLETED" },
      }),
      quizPrisma.quizAttempt.aggregate({
        _sum: { correctCount: true },
        where: { userId: activeUserId, status: "COMPLETED" },
      }),
      quizPrisma.quizAttempt.aggregate({
        _sum: { incorrectCount: true },
        where: { userId: activeUserId, status: "COMPLETED" },
      }),
      quizPrisma.quizAttempt.aggregate({
        _sum: { unansweredCount: true },
        where: { userId: activeUserId, status: "COMPLETED" },
      }),
    ]);

    return {
      attemptsCount,
      averageScore: Number((averageScore._avg?.percentage ?? 0).toFixed(2)),
      bestScore: Number((bestScore._max?.percentage ?? 0).toFixed(2)),
      totalCorrect: Number(totalCorrect._sum?.correctCount ?? 0),
      totalWrong: Number(totalWrong._sum?.incorrectCount ?? 0),
      totalUnanswered: Number(totalUnanswered._sum?.unansweredCount ?? 0),
    };
  } catch (error) {
    if (isMissingTableError(error) || isDatabaseUnavailableError(error)) {
      return {
        attemptsCount: 0,
        averageScore: 0,
        bestScore: 0,
        totalCorrect: 0,
        totalWrong: 0,
        totalUnanswered: 0,
      };
    }
    throw error;
  }
}

export async function getAvailableQuizSubjects(studyYear?: string) {
  try {
    ensureQuizModels();
    return await quizPrisma.subject.findMany({
      where: {
        category: {
          type: "YEAR",
          ...(studyYear ? { name: studyYear } : {}),
        },
      },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        category: {
          select: { name: true },
        },
      },
    });
  } catch (error) {
    if (isMissingTableError(error) || isDatabaseUnavailableError(error)) return [];
    throw error;
  }
}

export async function getAvailableQuizStudyYears() {
  try {
    const years = await prisma.category.findMany({
      where: { type: "YEAR" },
      select: { name: true },
      orderBy: { createdAt: "asc" },
    });

    return years.map((item) => item.name).filter(Boolean);
  } catch (error) {
    console.warn("Quiz study years unavailable:", (error as any)?.message || error);
    return [];
  }
}

export async function getQuizFilterOptions() {
  try {
    ensureQuizModels();
    const [subjects, years] = await Promise.all([
      quizPrisma.subject.findMany({
        where: {
          category: {
            type: "YEAR",
          },
        },
        select: { id: true, name: true },
      }),
      getAvailableQuizStudyYears(),
    ]);

    return {
      subjects,
      studyYears: years,
    };
  } catch (error) {
    if (isMissingTableError(error) || isDatabaseUnavailableError(error)) {
      return { subjects: [], studyYears: [] };
    }
    throw error;
  }
}
