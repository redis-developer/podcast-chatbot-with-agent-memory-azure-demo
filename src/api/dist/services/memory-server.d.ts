export declare enum AmsRole {
    USER = "user",
    ASSISTANT = "assistant"
}
export type AmsMessage = {
    role: AmsRole;
    content: string;
};
export type AmsMemory = {
    session_id: string;
    namespace: string;
    context: string;
    messages: AmsMessage[];
};
/**
 * Retrieve conversation history for a session
 */
export declare function readWorkingMemory(sessionId: string, namespace: string): Promise<AmsMemory>;
/**
 * Replace conversation history for a session
 */
export declare function replaceWorkingMemory(sessionId: string, context_window_max: number, amsMemory: AmsMemory): Promise<AmsMemory>;
/**
 * Delete conversation history for a session
 */
export declare function removeWorkingMemory(sessionId: string, namespace: string): Promise<void>;
//# sourceMappingURL=memory-server.d.ts.map