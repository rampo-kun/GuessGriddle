import type { JeopardyQuestion } from '@/types/game';

/**
 * Code-managed image valuation questions.
 *
 * 1. Put image files in: public/jeopardy/
 * 2. Add one object per image below.
 * 3. Use a path beginning with /jeopardy/, e.g. /jeopardy/market-basket.jpg
 *
 * The category is created automatically from the category field. Keep the same
 * category name for all image questions that should appear in one column.
 */
export const IMAGE_VALUATION_QUESTIONS: JeopardyQuestion[] = [
    // Example — copy this object, replace the image path and valuation details,
    // then add the corresponding image file to public/jeopardy/.
    // {
    //     id: 'image-worth-100',
    //     category: 'IMAGE VALUATION',
    //     points: 100,
    //     question: 'Estimate the total worth of everything shown in this image.',
    //     actualAnswer: 250000,
    //     minLimit: 200000,
    //     maxLimit: 300000,
    //     unit: 'INR',
    //     isImageQuestion: true,
    //     imageUrl: '/jeopardy/market-basket.jpg',
    //     isCompleted: false,
    // },
];
