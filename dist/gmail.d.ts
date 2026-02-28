export interface GmailCredentials {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
}
export declare function createGmailClient(credentials: GmailCredentials): import("googleapis").gmail_v1.Gmail;
export interface EmailSummary {
    messageId: string;
    subject: string;
    from: string;
    date: string;
    snippet: string;
    links: string[];
}
export declare function fetchEmailsFromSender(credentials: GmailCredentials, senderEmail: string, options?: {
    maxResults?: number;
    sinceDate?: string;
}): Promise<EmailSummary[]>;
//# sourceMappingURL=gmail.d.ts.map