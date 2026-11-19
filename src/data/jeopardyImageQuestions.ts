import type { JeopardyQuestion } from '@/types/game';

/** Image-based valuation questions. Values are approximate Indian retail/market estimates. */
export const IMAGE_VALUATION_QUESTIONS: JeopardyQuestion[] = [
    { id: 'image-streaming', category: 'IMAGE VALUATION', points: 100, question: 'Estimate the combined value of all items shown.', actualAnswer: 6385, minLimit: 6385, maxLimit: 6385, unit: 'INR', isImageQuestion: true, imageUrl: '/jeopardy/streaming-services.png', isCompleted: false },
    { id: 'image-drinks', category: 'IMAGE VALUATION', points: 200, question: 'Estimate the combined value of all items shown.', actualAnswer: 390, minLimit: 390, maxLimit: 390, unit: 'INR', isImageQuestion: true, imageUrl: '/jeopardy/drinks.png', isCompleted: false },
    { id: 'image-dzire-gpu', category: 'IMAGE VALUATION', points: 300, question: 'Estimate the combined value of all items shown.', actualAnswer: 1250000, minLimit: 1250000, maxLimit: 1250000, unit: 'INR', isImageQuestion: true, imageUrl: '/jeopardy/dzire-rtx5090.png', isCompleted: false },
    { id: 'image-phones-ps5', category: 'IMAGE VALUATION', points: 400, question: 'Estimate the combined value of all items shown.', actualAnswer: 340000, minLimit: 340000, maxLimit: 340000, unit: 'INR', isImageQuestion: true, imageUrl: '/jeopardy/phones-ps5.png', isCompleted: false },
    { id: 'image-ferrari-maggi', category: 'IMAGE VALUATION', points: 500, question: 'Estimate the combined value of all items shown.', actualAnswer: 40000030, minLimit: 40000030, maxLimit: 40000030, unit: 'INR', isImageQuestion: true, imageUrl: '/jeopardy/ferrari-maggi.png', isCompleted: false },
];
