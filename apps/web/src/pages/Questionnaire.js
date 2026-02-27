import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, SkipForward, Send, Sparkles, } from "lucide-react";
import { PERSONALITY_TRAITS, RELATIONSHIPS, } from "@birthday-song/shared";
import { cn } from "@/lib/cn";
import api from "@/lib/api";
import { useOrderStore } from "@/stores/order";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { ChatBubble } from "@/components/questionnaire/ChatBubble";
import { ProgressBar } from "@/components/questionnaire/ProgressBar";
import { SocialAutofill } from "@/components/questionnaire/SocialAutofill";
import { Shell } from "@/components/layout/Shell";
const TOTAL_STEPS = 12;
const STORAGE_KEY = "birthday-song-questionnaire";
function loadSavedAnswers() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    }
    catch {
        return {};
    }
}
function saveAnswers(answers) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
}
export default function Questionnaire() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const lang = (i18n.language === "he" ? "he" : "en");
    const setOrder = useOrderStore((s) => s.setOrder);
    const setOrderId = useOrderStore((s) => s.setOrderId);
    const [currentStep, setCurrentStep] = useState(0);
    const [showSocialAutofill, setShowSocialAutofill] = useState(true);
    const [answers, setAnswers] = useState(loadSavedAnswers);
    const [messages, setMessages] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [selectedTraits, setSelectedTraits] = useState(answers.personalityTraits ?? []);
    const chatContainerRef = useRef(null);
    const inputRef = useRef(null);
    const personalityOptions = PERSONALITY_TRAITS[lang];
    const relationshipOptions = RELATIONSHIPS[lang];
    const questions = useMemo(() => [
        {
            key: "recipientName",
            text: t("questionnaire.q1", "What's the birthday person's name? And do they have a nickname?"),
            type: "text",
            placeholder: t("questionnaire.q1Placeholder", "Name / Nickname"),
            required: true,
        },
        {
            key: "recipientGender",
            text: t("questionnaire.q2", "What's their gender?"),
            type: "select",
            options: [
                { value: "male", label: t("questionnaire.gender.male", "Male") },
                { value: "female", label: t("questionnaire.gender.female", "Female") },
                { value: "other", label: t("questionnaire.gender.other", "Other") },
            ],
            required: true,
        },
        {
            key: "recipientAge",
            text: t("questionnaire.q3", "How old are they turning?"),
            type: "number",
            placeholder: t("questionnaire.q3Placeholder", "Age"),
            required: true,
        },
        {
            key: "relationship",
            text: t("questionnaire.q4", "What's your relationship to them?"),
            type: "select",
            options: relationshipOptions.map((r) => ({ value: r, label: r })),
            required: true,
        },
        {
            key: "personalityTraits",
            text: t("questionnaire.q5", "Pick up to 3 personality traits that describe them best."),
            type: "multiselect",
            options: personalityOptions.map((p) => ({ value: p, label: p })),
            required: true,
        },
        {
            key: "hobbies",
            text: t("questionnaire.q6", "What are their hobbies or things they love doing?"),
            type: "textarea",
            placeholder: t("questionnaire.q6Placeholder", "e.g., cooking, hiking, gaming..."),
            required: false,
        },
        {
            key: "funnyStory",
            text: t("questionnaire.q7", "Got a funny or embarrassing story about them? The juicier the better!"),
            type: "textarea",
            placeholder: t("questionnaire.q7Placeholder", "That one time they..."),
            required: false,
        },
        {
            key: "desiredTone",
            text: t("questionnaire.q8", "What tone should the song have?"),
            type: "select",
            options: [
                { value: "funny", label: t("questionnaire.tone.funny", "Funny") },
                {
                    value: "emotional",
                    label: t("questionnaire.tone.emotional", "Emotional"),
                },
                { value: "mixed", label: t("questionnaire.tone.mixed", "Mixed") },
            ],
            required: true,
        },
        {
            key: "occupation",
            text: t("questionnaire.q9", "What do they do for work? (Optional)"),
            type: "text",
            placeholder: t("questionnaire.q9Placeholder", "Occupation"),
            required: false,
        },
        {
            key: "petPeeve",
            text: t("questionnaire.q10", "Any pet peeve or quirky habit? (Optional)"),
            type: "text",
            placeholder: t("questionnaire.q10Placeholder", "e.g., always late, hates pineapple on pizza..."),
            required: false,
        },
        {
            key: "importantPeople",
            text: t("questionnaire.q11", "Any important people to mention in the song? (Optional)"),
            type: "text",
            placeholder: t("questionnaire.q11Placeholder", "e.g., partner's name, best friend, pet..."),
            required: false,
        },
        {
            key: "sharedMemory",
            text: t("questionnaire.q12", "A special shared memory you'd like included? (Optional)"),
            type: "textarea",
            placeholder: t("questionnaire.q12Placeholder", "A trip, a moment, something meaningful..."),
            required: false,
        },
    ], [t, personalityOptions, relationshipOptions]);
    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages, currentStep]);
    // Focus input on step change
    useEffect(() => {
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 900);
        return () => clearTimeout(timer);
    }, [currentStep]);
    // Add AI question when step changes
    useEffect(() => {
        if (currentStep < questions.length) {
            const question = questions[currentStep];
            const msgId = `ai-${currentStep}`;
            setMessages((prev) => {
                if (prev.some((m) => m.id === msgId))
                    return prev;
                return [
                    ...prev,
                    {
                        id: msgId,
                        type: "ai",
                        content: question.text,
                        animate: true,
                    },
                ];
            });
        }
    }, [currentStep, questions]);
    const updateAnswer = useCallback((key, value) => {
        setAnswers((prev) => {
            const next = { ...prev, [key]: value };
            saveAnswers(next);
            return next;
        });
    }, []);
    const addUserMessage = useCallback((content) => {
        setMessages((prev) => [
            ...prev,
            {
                id: `user-${Date.now()}`,
                type: "user",
                content,
                animate: true,
            },
        ]);
    }, []);
    const goToNextStep = useCallback(() => {
        if (currentStep < TOTAL_STEPS - 1) {
            setCurrentStep((s) => s + 1);
            setInputValue("");
        }
    }, [currentStep]);
    const handleSubmitAnswer = useCallback(() => {
        const question = questions[currentStep];
        if (!question)
            return;
        if (question.type === "multiselect") {
            if (question.required && selectedTraits.length === 0)
                return;
            updateAnswer(question.key, selectedTraits);
            addUserMessage(selectedTraits.join(", "));
            goToNextStep();
            return;
        }
        if (question.type === "select") {
            // Select answers are handled via the RadioGroup onChange
            return;
        }
        const value = inputValue.trim();
        if (question.required && !value)
            return;
        if (question.type === "number") {
            updateAnswer(question.key, value ? parseInt(value, 10) : undefined);
        }
        else if (question.key === "recipientName") {
            const parts = value.split("/").map((p) => p.trim());
            updateAnswer("recipientName", parts[0]);
            if (parts[1]) {
                updateAnswer("recipientNickname", parts[1]);
            }
        }
        else {
            updateAnswer(question.key, value || undefined);
        }
        addUserMessage(value || t("questionnaire.skipped", "(skipped)"));
        goToNextStep();
    }, [
        currentStep,
        questions,
        inputValue,
        selectedTraits,
        updateAnswer,
        addUserMessage,
        goToNextStep,
        t,
    ]);
    const handleSelectOption = useCallback((value) => {
        const question = questions[currentStep];
        if (!question)
            return;
        updateAnswer(question.key, value);
        const option = question.type === "select"
            ? question.options?.find((o) => o.value === value)
            : null;
        addUserMessage(option?.label ?? value);
        goToNextStep();
    }, [currentStep, questions, updateAnswer, addUserMessage, goToNextStep]);
    const handleSkip = useCallback(() => {
        const question = questions[currentStep];
        if (!question || question.required)
            return;
        addUserMessage(t("questionnaire.skipped", "(skipped)"));
        goToNextStep();
    }, [currentStep, questions, addUserMessage, goToNextStep, t]);
    const handleBack = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep((s) => s - 1);
            setInputValue("");
        }
    }, [currentStep]);
    const handleSocialAutofillDone = useCallback((data) => {
        setAnswers((prev) => {
            const next = { ...prev, ...data };
            saveAnswers(next);
            return next;
        });
        setShowSocialAutofill(false);
    }, []);
    const handleComplete = useCallback(async () => {
        setSubmitting(true);
        try {
            const finalAnswers = {
                recipientName: answers.recipientName ?? "",
                recipientNickname: answers.recipientNickname,
                recipientGender: answers.recipientGender ?? "other",
                recipientAge: answers.recipientAge,
                relationship: answers.relationship ?? "",
                personalityTraits: answers.personalityTraits ?? [],
                hobbies: answers.hobbies,
                funnyStory: answers.funnyStory,
                occupation: answers.occupation,
                petPeeve: answers.petPeeve,
                importantPeople: answers.importantPeople,
                sharedMemory: answers.sharedMemory,
                desiredTone: answers.desiredTone ?? "mixed",
                language: lang,
                desiredMessage: answers.desiredMessage,
            };
            const response = await api.post("/api/orders", { questionnaire: finalAnswers });
            setOrderId(response.id);
            setOrder(response.order);
            localStorage.removeItem(STORAGE_KEY);
            navigate("/create/style");
        }
        catch {
            setSubmitting(false);
        }
    }, [answers, lang, navigate, setOrder, setOrderId]);
    const currentQuestion = questions[currentStep];
    const isLastStep = currentStep === TOTAL_STEPS - 1;
    const handleKeyDown = useCallback((e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (isLastStep) {
                const value = inputValue.trim();
                if (value) {
                    updateAnswer(currentQuestion.key, value);
                    addUserMessage(value);
                }
                else {
                    addUserMessage(t("questionnaire.skipped", "(skipped)"));
                }
                handleComplete();
            }
            else {
                handleSubmitAnswer();
            }
        }
    }, [
        isLastStep,
        inputValue,
        handleSubmitAnswer,
        handleComplete,
        currentQuestion,
        updateAnswer,
        addUserMessage,
        t,
    ]);
    const handleTraitToggle = useCallback((trait) => {
        setSelectedTraits((prev) => {
            if (prev.includes(trait)) {
                return prev.filter((t) => t !== trait);
            }
            if (prev.length >= 3)
                return prev;
            return [...prev, trait];
        });
    }, []);
    return (_jsx(Shell, { children: _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 }, className: "flex min-h-screen flex-col", children: [_jsx(ProgressBar, { currentStep: currentStep + 1, totalSteps: TOTAL_STEPS }), _jsx("div", { className: "sticky top-0 z-40 border-b border-[var(--glass-border)] bg-[var(--bg)]/80 backdrop-blur-xl", children: _jsxs("div", { className: "mx-auto flex max-w-2xl items-center justify-between px-4 py-3", children: [_jsxs("button", { type: "button", onClick: handleBack, disabled: currentStep === 0, className: cn("flex items-center gap-1 text-sm font-medium transition-colors", currentStep === 0
                                    ? "text-[var(--text-muted)]/40 cursor-not-allowed"
                                    : "text-[var(--text-muted)] hover:text-[var(--text)]"), children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), t("questionnaire.back", "Back")] }), _jsx("span", { className: "text-sm font-medium text-[var(--text-muted)]", children: t("questionnaire.stepOf", "{{current}} of {{total}}", {
                                    current: currentStep + 1,
                                    total: TOTAL_STEPS,
                                }) }), !currentQuestion?.required && (_jsxs("button", { type: "button", onClick: handleSkip, className: "flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)]", children: [t("questionnaire.skip", "Skip"), _jsx(SkipForward, { className: "h-4 w-4" })] })), currentQuestion?.required && _jsx("div", { className: "w-16" })] }) }), _jsx(AnimatePresence, { children: showSocialAutofill && currentStep === 0 && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 }, className: "mx-auto w-full max-w-2xl overflow-hidden px-4 pt-4", children: _jsx(SocialAutofill, { onComplete: handleSocialAutofillDone, onSkip: () => setShowSocialAutofill(false) }) })) }), _jsx("div", { ref: chatContainerRef, className: "flex-1 overflow-y-auto px-4 py-6", children: _jsxs("div", { className: "mx-auto flex max-w-2xl flex-col gap-4", children: [_jsx(ChatBubble, { type: "ai", animate: false, children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Sparkles, { className: "h-4 w-4 text-[var(--color-primary)]" }), _jsx("span", { className: "font-semibold", children: t("questionnaire.welcome", "Hi! I'll help you create the perfect birthday song. Let's get started!") })] }) }), _jsx(AnimatePresence, { mode: "popLayout", children: messages.map((msg) => (_jsx(ChatBubble, { type: msg.type, animate: msg.animate, children: msg.content }, msg.id))) })] }) }), _jsx("div", { className: "sticky bottom-0 border-t border-[var(--glass-border)] bg-[var(--bg)]/90 backdrop-blur-xl", children: _jsx("div", { className: "mx-auto max-w-2xl px-4 py-4", children: _jsxs(AnimatePresence, { mode: "wait", children: [currentQuestion?.type === "select" && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.2 }, children: _jsx(RadioGroup, { value: answers[currentQuestion.key] ?? "", onChange: handleSelectOption, direction: "horizontal", className: "flex-wrap justify-center", children: currentQuestion.options?.map((opt) => (_jsx(RadioGroup.Option, { value: opt.value, label: opt.label }, opt.value))) }) }, `select-${currentStep}`)), currentQuestion?.type === "multiselect" && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.2 }, className: "space-y-3", children: [_jsx("div", { className: "flex flex-wrap gap-2 justify-center", children: currentQuestion.options?.map((opt) => {
                                                const isSelected = selectedTraits.includes(opt.value);
                                                return (_jsx(motion.button, { type: "button", whileTap: { scale: 0.95 }, onClick: () => handleTraitToggle(opt.value), className: cn("rounded-full px-4 py-2 text-sm font-medium transition-all", "border", isSelected
                                                        ? "bg-[image:var(--gradient-main)] text-white border-transparent shadow-lg shadow-[var(--color-primary)]/25"
                                                        : "bg-[var(--glass-bg)] text-[var(--text)] border-[var(--glass-border)] hover:border-[var(--border)]"), children: opt.label }, opt.value));
                                            }) }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-[var(--text-muted)]", children: t("questionnaire.traitsSelected", "{{count}}/3 selected", {
                                                        count: selectedTraits.length,
                                                    }) }), _jsx(Button, { size: "sm", onClick: () => {
                                                        if (selectedTraits.length > 0) {
                                                            updateAnswer("personalityTraits", selectedTraits);
                                                            addUserMessage(selectedTraits.join(", "));
                                                            goToNextStep();
                                                        }
                                                    }, disabled: selectedTraits.length === 0, icon: _jsx(ArrowRight, { className: "h-4 w-4" }), iconPosition: "right", children: t("questionnaire.continue", "Continue") })] })] }, `multiselect-${currentStep}`)), (currentQuestion?.type === "text" ||
                                    currentQuestion?.type === "number") && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.2 }, className: "flex items-end gap-3", children: [_jsx("div", { className: "flex-1", children: _jsx(Input, { ref: inputRef, type: currentQuestion.type === "number" ? "number" : "text", value: inputValue, onChange: (e) => setInputValue(e.target.value), onKeyDown: handleKeyDown, placeholder: currentQuestion.placeholder, label: currentQuestion.placeholder }) }), _jsx(Button, { size: "md", onClick: () => {
                                                if (isLastStep) {
                                                    const value = inputValue.trim();
                                                    if (value) {
                                                        updateAnswer(currentQuestion.key, value);
                                                        addUserMessage(value);
                                                    }
                                                    else {
                                                        addUserMessage(t("questionnaire.skipped", "(skipped)"));
                                                    }
                                                    handleComplete();
                                                }
                                                else {
                                                    handleSubmitAnswer();
                                                }
                                            }, loading: submitting, icon: isLastStep ? (_jsx(Sparkles, { className: "h-4 w-4" })) : (_jsx(Send, { className: "h-4 w-4" })), className: "shrink-0", children: isLastStep
                                                ? t("questionnaire.finish", "Create Song")
                                                : t("questionnaire.send", "Send") })] }, `input-${currentStep}`)), currentQuestion?.type === "textarea" && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.2 }, className: "space-y-3", children: [_jsx(Input, { as: "textarea", ref: inputRef, value: inputValue, onChange: (e) => setInputValue(e.target
                                                .value), onKeyDown: handleKeyDown, placeholder: currentQuestion.placeholder, label: currentQuestion.placeholder, rows: 3 }), _jsxs("div", { className: "flex justify-end gap-2", children: [!currentQuestion.required && (_jsx(Button, { variant: "ghost", size: "sm", onClick: handleSkip, icon: _jsx(SkipForward, { className: "h-4 w-4" }), children: t("questionnaire.skip", "Skip") })), _jsx(Button, { size: "sm", onClick: () => {
                                                        if (isLastStep) {
                                                            const value = inputValue.trim();
                                                            if (value) {
                                                                updateAnswer(currentQuestion.key, value);
                                                                addUserMessage(value);
                                                            }
                                                            else {
                                                                addUserMessage(t("questionnaire.skipped", "(skipped)"));
                                                            }
                                                            handleComplete();
                                                        }
                                                        else {
                                                            handleSubmitAnswer();
                                                        }
                                                    }, loading: submitting, icon: isLastStep ? (_jsx(Sparkles, { className: "h-4 w-4" })) : (_jsx(Send, { className: "h-4 w-4" })), iconPosition: "right", children: isLastStep
                                                        ? t("questionnaire.finish", "Create Song")
                                                        : t("questionnaire.send", "Send") })] })] }, `textarea-${currentStep}`))] }) }) })] }) }));
}
