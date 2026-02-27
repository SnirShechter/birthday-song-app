import { type ReactNode } from "react";
export interface ChatBubbleProps {
    type: "ai" | "user";
    children: ReactNode;
    animate?: boolean;
}
export declare function ChatBubble({ type, children, animate, }: ChatBubbleProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ChatBubble.d.ts.map