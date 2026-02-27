export interface QuestionConfig {
    id: string;
    type: "text" | "select" | "multiselect" | "number" | "textarea";
    label: string;
    placeholder?: string;
    options?: string[];
    required?: boolean;
}
export interface QuestionStepProps {
    question: QuestionConfig;
    onAnswer: (id: string, value: string | string[] | number) => void;
    initialValue?: string | string[] | number;
}
export declare function QuestionStep({ question, onAnswer, initialValue, }: QuestionStepProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=QuestionStep.d.ts.map