export interface Language {
    dayNames: string[];
    monthNames: string[];
    tokens: {
        [k: string]: RegExp;
    };
}
declare const ENGLISH: Language;
export default ENGLISH;
