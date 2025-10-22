declare enum ChatRole {
    SUMMARY = "summary",
    USER = "user",
    PODBOT = "podbot"
}
export type ChatMessage = {
    role: ChatRole;
    content: string;
};
export declare function fetchHistory(username: string): Promise<ChatMessage[]>;
export declare function processMessage(username: string, message: string): Promise<string>;
export declare function clearSession(username: string): Promise<void>;
export {};
//# sourceMappingURL=chat-service.d.ts.map