export interface LoadingScreenProps {
    /** Override the rotating messages */
    messages?: string[];
    /** Additional class names */
    className?: string;
}
declare const defaultMessagesEn: string[];
declare const defaultMessagesHe: string[];
declare function LoadingScreen({ messages, className }: LoadingScreenProps): import("react/jsx-runtime").JSX.Element;
declare namespace LoadingScreen {
    var displayName: string;
}
export { LoadingScreen, defaultMessagesEn, defaultMessagesHe };
//# sourceMappingURL=LoadingScreen.d.ts.map