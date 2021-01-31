import { createPersonalFeedbackFiles } from "./PersonalFeedbackCreator";

const sessie = process.argv[2];
const toets = process.argv[3];

createPersonalFeedbackFiles(sessie, toets);
