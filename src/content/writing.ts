// Đề Writing Task 2 theo chủ đề và dạng bài (soạn theo dạng đề IELTS thường gặp).

export type EssayType = "Opinion" | "Discussion" | "Advantages & Disadvantages" | "Problem & Solution" | "Two-part question";

export type WritingPrompt = { id: string; topic: string; type: EssayType; prompt: string };

export const ESSAY_GUIDE: Record<EssayType, { vi: string; plan: string[] }> = {
  Opinion: {
    vi: "Nêu quan điểm (đồng ý / không đồng ý / đồng ý một phần)",
    plan: ["Mở bài: paraphrase đề + nêu rõ quan điểm", "Thân 1: lý do chính 1 + ví dụ", "Thân 2: lý do chính 2 + ví dụ", "Kết luận: nhắc lại quan điểm"],
  },
  Discussion: {
    vi: "Bàn về 2 quan điểm và nêu ý kiến của bạn",
    plan: ["Mở bài: giới thiệu 2 quan điểm + ý kiến của bạn", "Thân 1: quan điểm A và lý do", "Thân 2: quan điểm B và lý do (thường là phía bạn đồng ý)", "Kết luận: tóm tắt + nhắc lại ý kiến"],
  },
  "Advantages & Disadvantages": {
    vi: "Phân tích ưu điểm và nhược điểm",
    plan: ["Mở bài: paraphrase đề + (nếu đề hỏi) ưu hay nhược nhiều hơn", "Thân 1: 2 ưu điểm + ví dụ", "Thân 2: 2 nhược điểm + ví dụ", "Kết luận: tóm tắt"],
  },
  "Problem & Solution": {
    vi: "Nêu nguyên nhân/vấn đề và giải pháp",
    plan: ["Mở bài: paraphrase đề + nói sẽ bàn vấn đề và giải pháp", "Thân 1: 2 nguyên nhân/vấn đề + giải thích", "Thân 2: 2 giải pháp tương ứng", "Kết luận: tóm tắt"],
  },
  "Two-part question": {
    vi: "Trả lời 2 câu hỏi riêng biệt",
    plan: ["Mở bài: paraphrase + trả lời ngắn cả 2 câu hỏi", "Thân 1: trả lời câu hỏi 1", "Thân 2: trả lời câu hỏi 2", "Kết luận: tóm tắt 2 câu trả lời"],
  },
};

export const PROMPTS: WritingPrompt[] = [
  { id: "w1", topic: "Work & Careers", type: "Opinion", prompt: "Some people believe that working from home is better for both employees and employers. To what extent do you agree or disagree?" },
  { id: "w2", topic: "Work & Careers", type: "Discussion", prompt: "Some people think it is better to stay in the same job for a long time, while others believe changing jobs often is more beneficial. Discuss both views and give your own opinion." },
  { id: "w3", topic: "Education", type: "Opinion", prompt: "Some people think that university education should be free for all students. To what extent do you agree or disagree?" },
  { id: "w4", topic: "Education", type: "Discussion", prompt: "Some people believe children should start learning a foreign language at primary school, while others think they should wait until secondary school. Discuss both views and give your opinion." },
  { id: "w5", topic: "Technology", type: "Advantages & Disadvantages", prompt: "More and more people use smartphones to manage their daily lives. What are the advantages and disadvantages of this trend?" },
  { id: "w6", topic: "Technology", type: "Opinion", prompt: "Artificial intelligence will soon replace many jobs that are currently done by people. To what extent do you agree or disagree?" },
  { id: "w7", topic: "Environment", type: "Problem & Solution", prompt: "Air pollution is a serious problem in many large cities. What are the causes of this problem, and what can be done to solve it?" },
  { id: "w8", topic: "Environment", type: "Discussion", prompt: "Some people think that protecting the environment is the responsibility of governments, while others believe individuals should take action. Discuss both views and give your opinion." },
  { id: "w9", topic: "Health & Fitness", type: "Problem & Solution", prompt: "In many countries, the number of overweight children is increasing. What are the causes, and what solutions can you suggest?" },
  { id: "w10", topic: "Health & Fitness", type: "Opinion", prompt: "The government should spend more money on preventing illness than on treating people who are already ill. To what extent do you agree or disagree?" },
  { id: "w11", topic: "Travel & Tourism", type: "Advantages & Disadvantages", prompt: "International tourism has grown rapidly in recent decades. Do the advantages of this development outweigh the disadvantages?" },
  { id: "w12", topic: "Cities & Urbanisation", type: "Two-part question", prompt: "Many young people are moving from the countryside to big cities. Why is this happening? Is this a positive or negative development?" },
  { id: "w13", topic: "Transport", type: "Opinion", prompt: "The best way to reduce traffic congestion is to provide free public transport. To what extent do you agree or disagree?" },
  { id: "w14", topic: "Crime & Law", type: "Discussion", prompt: "Some people think that the best way to reduce crime is to give longer prison sentences. Others believe there are better ways. Discuss both views and give your opinion." },
  { id: "w15", topic: "Media & Advertising", type: "Opinion", prompt: "Advertising aimed at children should be banned. To what extent do you agree or disagree?" },
  { id: "w16", topic: "Media & Advertising", type: "Two-part question", prompt: "Nowadays many people get their news from social media rather than newspapers or television. Why is this? Is it a positive or negative development?" },
  { id: "w17", topic: "Family & Relationships", type: "Two-part question", prompt: "In many countries, people are now living longer than before. What problems does this cause for families and society? How can these problems be solved?" },
  { id: "w18", topic: "Food & Diet", type: "Advantages & Disadvantages", prompt: "Fast food is becoming more and more popular around the world. What are the advantages and disadvantages of this?" },
  { id: "w19", topic: "Sport & Leisure", type: "Opinion", prompt: "Professional athletes are paid too much money compared with other important jobs such as nurses and teachers. To what extent do you agree or disagree?" },
  { id: "w20", topic: "Art & Culture", type: "Discussion", prompt: "Some people think governments should spend money on museums and art galleries, while others think the money should be spent on other public services. Discuss both views and give your opinion." },
  { id: "w21", topic: "Economy & Globalisation", type: "Advantages & Disadvantages", prompt: "Multinational companies are opening branches in many developing countries. What are the advantages and disadvantages for these countries?" },
  { id: "w22", topic: "Science & Research", type: "Opinion", prompt: "Governments should spend more money on scientific research rather than on space exploration. To what extent do you agree or disagree?" },
];

/** Tự kiểm tra trước khi nộp (theo 4 tiêu chí chấm). */
export const SELF_CHECK = [
  "Đã trả lời đúng và đủ mọi phần câu hỏi của đề",
  "Quan điểm rõ ràng ở mở bài và kết luận",
  "Mỗi đoạn thân bài có 1 ý chính + giải thích + ví dụ",
  "Dùng từ nối đa dạng (However, As a result, For instance…)",
  "Có dùng từ vựng chủ đề, không lặp lại từ trong đề",
  "Có câu phức (although, which, if…) và đã kiểm tra lỗi chia động từ, số nhiều",
];
