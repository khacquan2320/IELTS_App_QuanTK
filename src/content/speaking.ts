// Ngân hàng câu hỏi Speaking theo chủ đề (soạn theo dạng đề IELTS thường gặp).

export type Part1Topic = { topic: string; questions: string[] };
export type CueCard = { id: string; topic: string; title: string; points: string[]; part3: string[] };

export const PART1: Part1Topic[] = [
  { topic: "Work or Study", questions: ["Do you work or are you a student?", "What do you like most about your job?", "Is there anything you would like to change about your work?", "Do you plan to stay in this job for a long time?", "What was your first day at work like?"] },
  { topic: "Hometown", questions: ["Where is your hometown?", "What do you like about it?", "Has your hometown changed much since you were a child?", "Is it a good place for young people to live?", "Would you like to live there in the future?"] },
  { topic: "Home & Accommodation", questions: ["Do you live in a house or an apartment?", "Which room do you spend the most time in?", "What would you like to change about your home?", "Do you plan to live there for a long time?", "What kind of home would you like to have in the future?"] },
  { topic: "Daily Routine", questions: ["What is your daily routine like?", "Are you a morning person or a night person?", "Do you prefer to plan your day or be spontaneous?", "Has your routine changed in recent years?", "What part of the day do you like best?"] },
  { topic: "Technology & Phones", questions: ["How often do you use your phone?", "What apps do you use the most?", "Could you live without your phone for a week?", "Do you think people spend too much time online?", "What was the last piece of technology you bought?"] },
  { topic: "Food & Cooking", questions: ["What is your favourite food?", "Do you like cooking?", "Do you prefer eating at home or eating out?", "Is there any food you didn't like as a child but like now?", "What do people in your country usually eat for breakfast?"] },
  { topic: "Travel & Holidays", questions: ["Do you like travelling?", "Where did you go on your last holiday?", "Do you prefer travelling alone or with others?", "What kind of places would you like to visit in the future?", "Do you like to plan your trips carefully?"] },
  { topic: "Music", questions: ["What kind of music do you like?", "Did you learn to play a musical instrument as a child?", "When do you usually listen to music?", "Has your taste in music changed over the years?", "Do you prefer listening to music alone or with friends?"] },
  { topic: "Sport & Exercise", questions: ["Do you like doing sport?", "What sport is popular in your country?", "How often do you exercise?", "Did you play any sports when you were a child?", "Do you prefer watching sport or playing it?"] },
  { topic: "Weather & Seasons", questions: ["What's the weather like in your country?", "What is your favourite season?", "Does the weather affect your mood?", "Do you check the weather forecast every day?", "Has the weather in your hometown changed in recent years?"] },
  { topic: "Reading & Books", questions: ["Do you like reading?", "What kind of books do you read?", "Do you prefer paper books or e-books?", "Did your parents read to you when you were a child?", "Is there a book you would like to read again?"] },
  { topic: "Friends", questions: ["Do you have many friends?", "How often do you meet your friends?", "What do you usually do together?", "Is it easy to make new friends as an adult?", "Do you prefer having a few close friends or many friends?"] },
  { topic: "Shopping", questions: ["Do you enjoy shopping?", "Do you prefer shopping online or in stores?", "What was the last thing you bought?", "Do you ever buy things you don't need?", "Are there many shopping centres where you live?"] },
  { topic: "Learning English", questions: ["How long have you been learning English?", "What is the most difficult part of learning English for you?", "How do you practise English outside class?", "Do you think English will be important in your future job?", "Would you like to learn another language?"] },
];

export const CUE_CARDS: CueCard[] = [
  {
    id: "useful-skill", topic: "Education",
    title: "Describe a skill you learned that is useful in your daily life.",
    points: ["what the skill is", "when and how you learned it", "how difficult it was to learn", "and explain why it is useful to you"],
    part3: ["What skills should children learn at school?", "Is it better to learn skills from teachers or from the internet?", "Do you think older people find it harder to learn new skills?"],
  },
  {
    id: "colleague", topic: "Work & Careers",
    title: "Describe a person you work or study with who you admire.",
    points: ["who this person is", "how you know them", "what they are like", "and explain why you admire them"],
    part3: ["What makes a good manager?", "Is teamwork more important than individual work?", "Why do some people change jobs often?"],
  },
  {
    id: "difficult-decision", topic: "Work & Careers",
    title: "Describe a difficult decision you made.",
    points: ["what the decision was", "when you made it", "how you made it", "and explain how you felt about it afterwards"],
    part3: ["Do young people make decisions differently from older people?", "Should parents make important decisions for their children?", "Why do some people find it hard to make decisions?"],
  },
  {
    id: "memorable-trip", topic: "Travel & Tourism",
    title: "Describe a trip you enjoyed.",
    points: ["where you went", "who you went with", "what you did there", "and explain why you enjoyed it"],
    part3: ["Why do people like to travel?", "What are the negative effects of tourism?", "How has travel changed compared to the past?"],
  },
  {
    id: "useful-app", topic: "Technology",
    title: "Describe an app or website you use often.",
    points: ["what it is", "how you found it", "what you use it for", "and explain why you find it useful"],
    part3: ["How has technology changed the way people communicate?", "Do you think children use technology too much?", "Will computers replace teachers in the future?"],
  },
  {
    id: "healthy-habit", topic: "Health & Fitness",
    title: "Describe a healthy habit you have.",
    points: ["what the habit is", "when you started it", "how often you do it", "and explain how it helps you"],
    part3: ["Why do many people have unhealthy lifestyles?", "Should the government encourage people to exercise?", "Is mental health as important as physical health?"],
  },
  {
    id: "city-place", topic: "Cities & Urbanisation",
    title: "Describe a place in your city where you like to relax.",
    points: ["where it is", "how often you go there", "what you do there", "and explain why you like it"],
    part3: ["What are the advantages of living in a big city?", "Should cities have more parks and green spaces?", "Why do young people move from the countryside to cities?"],
  },
  {
    id: "environment-action", topic: "Environment",
    title: "Describe something you do to help protect the environment.",
    points: ["what you do", "when you started doing it", "how difficult it is", "and explain why you think it is important"],
    part3: ["Who is more responsible for protecting the environment: governments or individuals?", "Why don't more people recycle?", "How will climate change affect your country?"],
  },
  {
    id: "advert", topic: "Media & Advertising",
    title: "Describe an advertisement that you remember well.",
    points: ["what it advertised", "where you saw it", "what it showed", "and explain why you remember it"],
    part3: ["Do adverts influence what people buy?", "Should advertising aimed at children be banned?", "How has advertising changed with social media?"],
  },
  {
    id: "family-member", topic: "Family & Relationships",
    title: "Describe a family member you spend a lot of time with.",
    points: ["who this person is", "what you usually do together", "how long you have been close", "and explain why you enjoy spending time with them"],
    part3: ["How have families changed in your country?", "Should elderly parents live with their children?", "Who has more influence on children: parents or friends?"],
  },
  {
    id: "meal", topic: "Food & Diet",
    title: "Describe a memorable meal you had.",
    points: ["where you had it", "who you were with", "what you ate", "and explain why it was memorable"],
    part3: ["Why is fast food so popular?", "Should schools teach children how to cook?", "How have eating habits changed in your country?"],
  },
  {
    id: "sport-event", topic: "Sport & Leisure",
    title: "Describe a sports event you watched or took part in.",
    points: ["what the event was", "where and when it took place", "who you were with", "and explain how you felt about it"],
    part3: ["Why do people like watching sport?", "Should professional athletes earn so much money?", "How can governments encourage people to do more sport?"],
  },
  {
    id: "tradition", topic: "Art & Culture",
    title: "Describe a festival or tradition that is important in your country.",
    points: ["what it is", "when it happens", "what people do", "and explain why it is important"],
    part3: ["Are traditional festivals still important to young people?", "How can traditions be preserved?", "What are the benefits of learning about other cultures?"],
  },
  {
    id: "goal", topic: "Work & Careers",
    title: "Describe a goal you hope to achieve in the future.",
    points: ["what the goal is", "when you set it", "what you are doing to achieve it", "and explain why it is important to you"],
    part3: ["Is it important to set goals?", "Do people today have different goals from their parents?", "Is success more about hard work or luck?"],
  },
  {
    id: "rule", topic: "Government & Society",
    title: "Describe a rule or law that you think is important.",
    points: ["what the rule is", "where it applies", "how people feel about it", "and explain why you think it is important"],
    part3: ["Why do some people break rules?", "Should punishment for crime be stricter?", "What rules should children follow at home?"],
  },
  {
    id: "book-film", topic: "Media & Advertising",
    title: "Describe a book or film that taught you something.",
    points: ["what it was", "when you read or watched it", "what it was about", "and explain what you learned from it"],
    part3: ["Do people read less than in the past?", "Should films based on true stories be completely accurate?", "Why are some books or films popular all over the world?"],
  },
];

/** Khung trả lời gợi ý cho người mới. */
export const ANSWER_TIPS = {
  part1: "Trả lời 2–3 câu: Câu trả lời trực tiếp → Lý do → Ví dụ/chi tiết. VD: “Yes, I do. I really enjoy cooking because it helps me relax after work. For example, last weekend I made pho for my family.”",
  part2: "Dùng 1 phút ghi từ khóa cho từng gạch đầu dòng (không viết câu). Nói theo thứ tự các gạch đầu dòng, phần “explain why” nói dài nhất. Nếu hết ý, thêm một câu chuyện nhỏ hoặc cảm xúc của bạn.",
  part3: "Đưa ra quan điểm → giải thích → so sánh/ví dụ chung cho xã hội (không chỉ bản thân). Dùng: “I'd say that…”, “One reason is that…”, “On the other hand…”, “In the long run…”.",
};
