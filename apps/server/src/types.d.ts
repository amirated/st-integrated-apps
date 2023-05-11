export interface Request {
    config: {
        encoding: string;
        sampleRateHertz: number;
        languageCode: string;
        profanityFilter: boolean;
        enableWordTimeOffsets: boolean;
    };
    interimResults: boolean;
}
