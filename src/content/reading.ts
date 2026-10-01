// Bài đọc luyện IELTS (soạn riêng cho app, độ khó band 5.5 → 6.5).
// Thêm bài mới: thêm 1 object vào BASE_PASSAGES (file này) hoặc MORE_PASSAGES (reading-more.ts).
import { MORE_PASSAGES } from "./reading-more";

export type TFNG = "TRUE" | "FALSE" | "NOT GIVEN";

export type Question =
  | { id: string; type: "tfng"; text: string; answer: TFNG; explain: string }
  | { id: string; type: "mcq"; text: string; options: string[]; answer: number; explain: string }
  | { id: string; type: "gap"; text: string; answers: string[]; explain: string }
  /** Chọn từ danh sách chung của nhóm (Matching Headings / Matching Information) */
  | { id: string; type: "choice"; text: string; answer: string; explain: string };

export type QuestionGroup = {
  title: string;
  instruction: string;
  /** Danh sách lựa chọn chung cho câu hỏi dạng "choice": [mã, nội dung] */
  options?: [string, string][];
  questions: Question[];
};

export type Passage = {
  id: string;
  title: string;
  topic: string;
  level: string;
  minutes: number;
  paragraphs: { label: string; text: string }[];
  groups: QuestionGroup[];
};

const TFNG_INSTRUCTION =
  "Chọn TRUE nếu câu khớp với thông tin trong bài, FALSE nếu câu trái với bài, NOT GIVEN nếu bài không nhắc tới.";

const BASE_PASSAGES: Passage[] = [
  {
    id: "four-day-week",
    title: "The Four-Day Working Week",
    topic: "Work & Employment",
    level: "Band 5.5",
    minutes: 18,
    paragraphs: [
      {
        label: "A",
        text: "For more than a century, most office workers around the world have worked five days a week. However, a growing number of companies are now experimenting with a shorter week. In a typical trial, employees work four days instead of five but receive the same salary. The idea is not new: in 1956, the American politician Richard Nixon predicted that a four-day week was “not far off”. Nearly seventy years later, it is still unusual.",
      },
      {
        label: "B",
        text: "The largest trial so far took place in the United Kingdom in 2022. About 60 companies, with around 2,900 workers in total, took part for six months. The organisations came from many sectors, including banking, marketing and healthcare, as well as small businesses such as restaurants.",
      },
      {
        label: "C",
        text: "The results were largely positive. Most employees reported feeling less stressed and said they slept better. The number of sick days fell by about two thirds, and fewer staff left their jobs during the trial. Perhaps most importantly for employers, company revenue stayed roughly the same. At the end, the majority of the companies decided to continue with the four-day week.",
      },
      {
        label: "D",
        text: "Not everyone is convinced, however. Critics point out that the companies which took part chose to do so, and were probably already well suited to the change. A hospital or a school, for example, cannot simply close one day a week. In some trials, workers also complained that they had to fit five days of work into four, which made their working days longer and more intense.",
      },
      {
        label: "E",
        text: "Supporters argue that the key is not working less, but working smarter. Many companies in the trial cut the length of meetings, reduced unnecessary emails and gave staff periods of time without interruptions. These changes, they say, would improve productivity whether or not the working week becomes shorter. Whatever happens, the debate about how many days we should work seems certain to continue.",
      },
    ],
    groups: [
      {
        title: "Questions 1–5",
        instruction: "Matching Headings: chọn tiêu đề phù hợp cho mỗi đoạn A–E. Có nhiều tiêu đề hơn số đoạn.",
        options: [
          ["i", "Reasons to doubt the findings"],
          ["ii", "An old idea that has not become common"],
          ["iii", "How the main experiment was organised"],
          ["iv", "Why salaries have fallen"],
          ["v", "Benefits for both staff and businesses"],
          ["vi", "Changes in the way people work"],
          ["vii", "Problems for hospitals in the UK"],
          ["viii", "Government plans for a new law"],
        ],
        questions: [
          { id: "1", type: "choice", text: "Paragraph A", answer: "ii", explain: "Đoạn A: Nixon dự đoán từ 1956 nhưng “Nearly seventy years later, it is still unusual” → ý tưởng cũ nhưng chưa phổ biến." },
          { id: "2", type: "choice", text: "Paragraph B", answer: "iii", explain: "Đoạn B mô tả quy mô thử nghiệm: bao nhiêu công ty, bao nhiêu người, kéo dài bao lâu, ngành nào → cách tổ chức thí nghiệm." },
          { id: "3", type: "choice", text: "Paragraph C", answer: "v", explain: "Nhân viên bớt stress, ngủ tốt hơn (lợi cho staff) + doanh thu giữ nguyên (lợi cho businesses)." },
          { id: "4", type: "choice", text: "Paragraph D", answer: "i", explain: "“Not everyone is convinced… Critics point out…” → lý do nghi ngờ kết quả. Bẫy: vii nhắc hospital nhưng đó chỉ là ví dụ, không phải ý chính." },
          { id: "5", type: "choice", text: "Paragraph E", answer: "vi", explain: "“working smarter”: họp ngắn hơn, bớt email, có thời gian không bị làm phiền → thay đổi cách làm việc." },
        ],
      },
      {
        title: "Questions 6–9",
        instruction: TFNG_INSTRUCTION,
        questions: [
          { id: "6", type: "tfng", text: "In most four-day week trials, workers' pay is reduced.", answer: "FALSE", explain: "Đoạn A: “work four days instead of five but receive the same salary” → lương giữ nguyên, trái với câu hỏi." },
          { id: "7", type: "tfng", text: "The UK trial lasted for half a year.", answer: "TRUE", explain: "Đoạn B: “took part for six months” = half a year (paraphrase)." },
          { id: "8", type: "tfng", text: "More than half of the workers in the UK trial were women.", answer: "NOT GIVEN", explain: "Bài không nói gì về giới tính người tham gia." },
          { id: "9", type: "tfng", text: "Fewer employees resigned during the trial.", answer: "TRUE", explain: "Đoạn C: “fewer staff left their jobs” — resign = leave a job." },
        ],
      },
      {
        title: "Questions 10–12",
        instruction: "Hoàn thành câu. Dùng ONE WORD ONLY lấy từ bài đọc.",
        questions: [
          { id: "10", type: "gap", text: "Critics say the companies in the trial ______ to take part.", answers: ["chose"], explain: "Đoạn D: “the companies which took part chose to do so”." },
          { id: "11", type: "gap", text: "Some workers said their working days became longer and more ______.", answers: ["intense"], explain: "Đoạn D: “made their working days longer and more intense”." },
          { id: "12", type: "gap", text: "Many companies reduced the length of ______.", answers: ["meetings"], explain: "Đoạn E: “cut the length of meetings”. Cut = reduced." },
        ],
      },
    ],
  },
  {
    id: "why-sleep",
    title: "Why We Need Sleep",
    topic: "Health & Recreation",
    level: "Band 5.5",
    minutes: 18,
    paragraphs: [
      {
        label: "A",
        text: "Most adults need between seven and nine hours of sleep a night, yet surveys suggest that around a third of adults regularly get less than this. Busy work schedules, long journeys to work and the use of phones late at night are all common reasons. Many people see sleep as wasted time, but scientists now believe it is one of the most important things we do for our health.",
      },
      {
        label: "B",
        text: "While we sleep, the brain is far from inactive. Researchers have found that during sleep the brain sorts through the information it received during the day, deciding what to keep and what to forget. In one well-known experiment, students who slept after learning a list of words remembered far more of them the next day than students who stayed awake. For this reason, staying up all night to study before an exam is usually a bad idea.",
      },
      {
        label: "C",
        text: "Sleep also affects the body. People who regularly sleep less than six hours are more likely to catch colds, because their immune system does not work as well. A lack of sleep also changes the hormones that control hunger, making people want more sugary and fatty food. Over time, this can lead to weight gain.",
      },
      {
        label: "D",
        text: "So how can we sleep better? Experts recommend going to bed and getting up at the same time every day, even at weekends. Bedrooms should be dark, quiet and slightly cool. Caffeine, which is found in coffee, tea and many soft drinks, can stay in the body for up to ten hours, so it is best avoided in the afternoon.",
      },
      {
        label: "E",
        text: "Perhaps the most difficult advice to follow is to put screens away at least an hour before bed. The blue light from phones and laptops tells the brain that it is still daytime, which delays the release of melatonin, the hormone that makes us feel sleepy. Reading a paper book or listening to quiet music are better ways to relax.",
      },
    ],
    groups: [
      {
        title: "Questions 1–2",
        instruction: "Chọn đáp án đúng A, B, C hoặc D.",
        questions: [
          {
            id: "1",
            type: "mcq",
            text: "According to paragraph A, what proportion of adults regularly sleep less than they need?",
            options: ["About 10%", "About one third", "About half", "Most adults"],
            answer: 1,
            explain: "“around a third of adults regularly get less than this”.",
          },
          {
            id: "2",
            type: "mcq",
            text: "What did the experiment in paragraph B show?",
            options: [
              "Students who studied at night got better results.",
              "Sleep helps people remember new information.",
              "Students forget most words within a day.",
              "The brain stops working during sleep.",
            ],
            answer: 1,
            explain: "Sinh viên ngủ sau khi học “remembered far more of them” → giấc ngủ giúp ghi nhớ. D sai vì “the brain is far from inactive”.",
          },
        ],
      },
      {
        title: "Questions 3–6",
        instruction: TFNG_INSTRUCTION,
        questions: [
          { id: "3", type: "tfng", text: "People who sleep less than six hours catch colds more easily.", answer: "TRUE", explain: "Đoạn C: “more likely to catch colds”." },
          { id: "4", type: "tfng", text: "A lack of sleep makes people want to eat less.", answer: "FALSE", explain: "Đoạn C: thiếu ngủ khiến người ta “want more sugary and fatty food” → ăn nhiều hơn." },
          { id: "5", type: "tfng", text: "Most people sleep longer at weekends.", answer: "NOT GIVEN", explain: "Đoạn D chỉ khuyên ngủ giờ cố định kể cả cuối tuần, không nói phần lớn mọi người có ngủ lâu hơn vào cuối tuần hay không." },
          { id: "6", type: "tfng", text: "Caffeine can remain in the body for as long as ten hours.", answer: "TRUE", explain: "Đoạn D: “can stay in the body for up to ten hours” — remain = stay." },
        ],
      },
      {
        title: "Questions 7–10",
        instruction: "Hoàn thành câu. Dùng NO MORE THAN TWO WORDS lấy từ bài đọc.",
        questions: [
          { id: "7", type: "gap", text: "A bedroom should be dark, quiet and slightly ______.", answers: ["cool"], explain: "Đoạn D: “dark, quiet and slightly cool”." },
          { id: "8", type: "gap", text: "Blue light delays the release of a hormone called ______.", answers: ["melatonin"], explain: "Đoạn E: “delays the release of melatonin”." },
          { id: "9", type: "gap", text: "Instead of using screens, people could read a ______ or listen to quiet music.", answers: ["paper book"], explain: "Đoạn E: “Reading a paper book or listening to quiet music”." },
          { id: "10", type: "gap", text: "A lack of sleep changes the hormones that control ______.", answers: ["hunger"], explain: "Đoạn C: “changes the hormones that control hunger”." },
        ],
      },
    ],
  },
  {
    id: "adult-language-learning",
    title: "Learning a Language as an Adult",
    topic: "Education",
    level: "Band 6.0",
    minutes: 20,
    paragraphs: [
      {
        label: "A",
        text: "It is widely believed that children learn languages more easily than adults. A child who moves to a new country often speaks the local language like a native speaker within a few years, while their parents may struggle for decades. This has led many adults to conclude that it is simply too late for them to become fluent in a foreign language.",
      },
      {
        label: "B",
        text: "Research suggests that the truth is more complicated. A large study published in 2018, which tested the grammar of almost 670,000 people online, found that the ability to learn grammar remains strong until around the age of 17 or 18. After this, it declines slowly. However, the researchers stressed that this mainly affects whether learners can reach a native-like level. Adults can still become highly competent speakers.",
      },
      {
        label: "C",
        text: "In fact, adults have several advantages. They already understand how language works, so they can learn grammar rules quickly and make connections with their first language. They are also better at using learning strategies, such as organising vocabulary into groups or setting clear goals. Studies of classroom learning have found that, over a short period, older learners often make faster progress than young children.",
      },
      {
        label: "D",
        text: "The biggest difference between children and adults may be not their brains but their situation. Children who move abroad spend many hours a day surrounded by the new language, at school and with friends, and they are rarely afraid of making mistakes. Adults, by contrast, often have limited time, and many feel embarrassed when they speak imperfectly, so they avoid speaking at all.",
      },
      {
        label: "E",
        text: "For adult learners, therefore, the most useful advice is to increase exposure and reduce fear. Listening to podcasts, watching series with English subtitles and speaking regularly, even with mistakes, all help. Researchers agree that regular practice matters more than talent: studying for twenty minutes every day is more effective than studying for three hours once a week.",
      },
    ],
    groups: [
      {
        title: "Questions 1–4",
        instruction: "Matching Information: đoạn nào (A–E) chứa thông tin sau? Một đoạn có thể dùng nhiều lần.",
        options: [
          ["A", "Paragraph A"],
          ["B", "Paragraph B"],
          ["C", "Paragraph C"],
          ["D", "Paragraph D"],
          ["E", "Paragraph E"],
        ],
        questions: [
          { id: "1", type: "choice", text: "a comparison of how much time children and adults spend with a new language", answer: "D", explain: "Đoạn D: trẻ em “spend many hours a day surrounded by the new language”, còn người lớn “often have limited time”." },
          { id: "2", type: "choice", text: "a common belief about age and language learning", answer: "A", explain: "Đoạn A: “It is widely believed that children learn languages more easily than adults” — widely believed = common belief." },
          { id: "3", type: "choice", text: "an explanation of why adults can learn grammar rules quickly", answer: "C", explain: "Đoạn C: “They already understand how language works, so they can learn grammar rules quickly”." },
          { id: "4", type: "choice", text: "the number of people who took part in a study", answer: "B", explain: "Đoạn B: “almost 670,000 people”." },
        ],
      },
      {
        title: "Questions 5–8",
        instruction: TFNG_INSTRUCTION,
        questions: [
          { id: "5", type: "tfng", text: "The 2018 study was carried out in classrooms.", answer: "FALSE", explain: "Đoạn B: nghiên cứu kiểm tra “online”, không phải trên lớp." },
          { id: "6", type: "tfng", text: "The ability to learn grammar starts to fall at around 17 or 18.", answer: "TRUE", explain: "Đoạn B: “remains strong until around the age of 17 or 18. After this, it declines slowly” — decline = fall." },
          { id: "7", type: "tfng", text: "Adults are unable to become highly competent speakers of a foreign language.", answer: "FALSE", explain: "Đoạn B: “Adults can still become highly competent speakers”." },
          { id: "8", type: "tfng", text: "Most adult learners prefer studying grammar to speaking.", answer: "NOT GIVEN", explain: "Bài không so sánh người lớn thích học ngữ pháp hay luyện nói hơn. Đừng suy diễn từ đoạn D." },
        ],
      },
      {
        title: "Question 9",
        instruction: "Chọn đáp án đúng A, B, C hoặc D.",
        questions: [
          {
            id: "9",
            type: "mcq",
            text: "According to the writer, the main reason children seem to learn languages faster is that",
            options: ["their brains work differently.", "their situation is different.", "they have better teachers.", "they learn grammar rules more quickly."],
            answer: 1,
            explain: "Đoạn D: “The biggest difference… may be not their brains but their situation”. D sai: chính người lớn mới học quy tắc ngữ pháp nhanh (đoạn C).",
          },
        ],
      },
      {
        title: "Questions 10–12",
        instruction: "Hoàn thành câu. Dùng NO MORE THAN TWO WORDS lấy từ bài đọc.",
        questions: [
          { id: "10", type: "gap", text: "Many adults feel ______ when they speak imperfectly.", answers: ["embarrassed"], explain: "Đoạn D: “many feel embarrassed when they speak imperfectly”." },
          { id: "11", type: "gap", text: "Studying for twenty minutes ______ is better than three hours once a week.", answers: ["every day"], explain: "Đoạn E: “studying for twenty minutes every day”." },
          { id: "12", type: "gap", text: "Researchers say regular practice is more important than ______.", answers: ["talent"], explain: "Đoạn E: “regular practice matters more than talent”." },
        ],
      },
    ],
  },
  {
    id: "online-news",
    title: "The Rise of Online News",
    topic: "Media",
    level: "Band 6.0",
    minutes: 20,
    paragraphs: [
      {
        label: "A",
        text: "Twenty years ago, most people got their news from newspapers, television and radio. Today, a large and growing share of people, especially those under 35, get their news mainly from the internet, and increasingly from social media platforms and video apps. In many countries, sales of printed newspapers have fallen by more than half since the early 2000s.",
      },
      {
        label: "B",
        text: "This change has brought clear benefits. News is now available instantly and usually for free. Readers can compare reports from many different sources, and ordinary people can share what they see with a phone camera, sometimes reporting events before professional journalists arrive. During natural disasters, for example, posts from local residents have helped emergency services understand what is happening.",
      },
      {
        label: "C",
        text: "However, the move online has created serious problems for the news industry. Because most readers are unwilling to pay for news on the internet, newspapers have lost much of their income. Advertising money, which used to support journalism, now goes largely to technology companies. As a result, thousands of journalists have lost their jobs, and many local newspapers have closed completely. Some researchers warn that when a town loses its local paper, fewer people vote in local elections.",
      },
      {
        label: "D",
        text: "A second concern is the spread of false information. On social media, stories are often shared because they are surprising or emotional, not because they are accurate. One large study of the platform Twitter found that false stories spread significantly faster than true ones. Many users read only the headline before sharing an article, and few check where the story came from.",
      },
      {
        label: "E",
        text: "Some solutions are beginning to appear. A number of newspapers have successfully introduced online subscriptions, and some have asked readers for voluntary donations. Schools in several countries now teach “media literacy”, helping students to judge whether a source is reliable. Nevertheless, experts agree that the habits of news readers will have to change if high-quality journalism is to survive.",
      },
    ],
    groups: [
      {
        title: "Questions 1–5",
        instruction: "Matching Headings: chọn tiêu đề phù hợp cho mỗi đoạn A–E. Có nhiều tiêu đề hơn số đoạn.",
        options: [
          ["i", "A move from traditional media to digital sources"],
          ["ii", "The advantages of digital news"],
          ["iii", "Why journalists prefer social media"],
          ["iv", "Financial difficulties for news organisations"],
          ["v", "How untrue stories travel"],
          ["vi", "Possible ways forward"],
          ["vii", "The end of television news"],
        ],
        questions: [
          { id: "1", type: "choice", text: "Paragraph A", answer: "i", explain: "Từ báo, TV, radio → internet, mạng xã hội: chuyển từ truyền thông truyền thống sang số. vii sai vì bài không nói TV biến mất." },
          { id: "2", type: "choice", text: "Paragraph B", answer: "ii", explain: "“This change has brought clear benefits” → câu chủ đề nói về lợi ích." },
          { id: "3", type: "choice", text: "Paragraph C", answer: "iv", explain: "Mất thu nhập, tiền quảng cáo chuyển sang công ty công nghệ, nhà báo mất việc → khó khăn tài chính." },
          { id: "4", type: "choice", text: "Paragraph D", answer: "v", explain: "“the spread of false information” — false = untrue, spread = travel." },
          { id: "5", type: "choice", text: "Paragraph E", answer: "vi", explain: "“Some solutions are beginning to appear” → các hướng giải quyết." },
        ],
      },
      {
        title: "Questions 6–9",
        instruction: TFNG_INSTRUCTION,
        questions: [
          { id: "6", type: "tfng", text: "Younger people are especially likely to get their news online.", answer: "TRUE", explain: "Đoạn A: “especially those under 35”." },
          { id: "7", type: "tfng", text: "Ordinary people never report events before journalists do.", answer: "FALSE", explain: "Đoạn B: “sometimes reporting events before professional journalists arrive”." },
          { id: "8", type: "tfng", text: "Technology companies now receive much of the advertising money.", answer: "TRUE", explain: "Đoạn C: “Advertising money… now goes largely to technology companies”." },
          { id: "9", type: "tfng", text: "Most of the local newspapers that closed were in rural areas.", answer: "NOT GIVEN", explain: "Bài nói nhiều tờ báo địa phương đóng cửa nhưng không nói chúng ở nông thôn hay thành phố." },
        ],
      },
      {
        title: "Question 10",
        instruction: "Chọn đáp án đúng A, B, C hoặc D.",
        questions: [
          {
            id: "10",
            type: "mcq",
            text: "According to paragraph D, why are stories often shared on social media?",
            options: ["Because they are accurate.", "Because they are surprising or emotional.", "Because journalists recommend them.", "Because they have short headlines."],
            answer: 1,
            explain: "“shared because they are surprising or emotional, not because they are accurate”.",
          },
        ],
      },
      {
        title: "Questions 11–12",
        instruction: "Hoàn thành câu. Dùng ONE WORD ONLY lấy từ bài đọc.",
        questions: [
          { id: "11", type: "gap", text: "Some newspapers ask readers for voluntary ______.", answers: ["donations"], explain: "Đoạn E: “asked readers for voluntary donations”." },
          { id: "12", type: "gap", text: "Media literacy teaches students to decide whether a source is ______.", answers: ["reliable"], explain: "Đoạn E: “judge whether a source is reliable”." },
        ],
      },
    ],
  },
  {
    id: "urban-farming",
    title: "Urban Farming",
    topic: "Environment",
    level: "Band 6.5",
    minutes: 22,
    paragraphs: [
      {
        label: "A",
        text: "By 2050, around two thirds of the world's population is expected to live in cities. Feeding these urban populations is a major challenge: food is often transported hundreds or even thousands of kilometres before it reaches a supermarket shelf, which adds to carbon emissions and means that fruit and vegetables lose some of their freshness. Urban farming — growing food in and around cities — is increasingly being proposed as part of the solution.",
      },
      {
        label: "B",
        text: "Urban farms take many forms. The simplest are community gardens, where local residents share a piece of land and grow vegetables together. On a larger scale, some cities have converted the flat roofs of supermarkets and office buildings into productive gardens. The most technologically advanced are vertical farms: indoor facilities in which crops are grown in stacked layers under LED lights, often without soil, with their roots in water containing nutrients.",
      },
      {
        label: "C",
        text: "Advocates of vertical farming highlight its efficiency. Because conditions such as temperature and light are carefully controlled, crops can be harvested all year round, regardless of the weather. Such farms typically use up to 95 percent less water than conventional agriculture, as water is recycled within the system, and pesticides are rarely needed because insects cannot easily get inside.",
      },
      {
        label: "D",
        text: "Critics, however, point to considerable drawbacks. Vertical farms consume enormous amounts of electricity for lighting and climate control, and unless this energy comes from renewable sources, their environmental benefits may be lost. They are also expensive to build and run, and several high-profile companies in the sector have gone out of business in recent years. Moreover, the range of crops is limited: leafy greens and herbs grow well, but staple foods such as wheat and rice are not economically viable indoors.",
      },
      {
        label: "E",
        text: "The benefits of smaller projects are often social rather than economic. Community gardens give city dwellers, particularly children, the chance to learn where food comes from, and research has linked gardening with lower levels of stress. In some low-income neighbourhoods with few shops selling fresh produce, community gardens have improved residents' access to healthy food.",
      },
      {
        label: "F",
        text: "Few experts believe that urban farming will ever replace traditional agriculture; cities simply do not have enough space. Most see it instead as a complement that can make urban food systems more resilient, reduce food miles for certain products and reconnect people with the food they eat.",
      },
    ],
    groups: [
      {
        title: "Questions 1–4",
        instruction: "Matching Information: đoạn nào (A–F) chứa thông tin sau?",
        options: [
          ["A", "Paragraph A"],
          ["B", "Paragraph B"],
          ["C", "Paragraph C"],
          ["D", "Paragraph D"],
          ["E", "Paragraph E"],
          ["F", "Paragraph F"],
        ],
        questions: [
          { id: "1", type: "choice", text: "a description of different types of urban farm", answer: "B", explain: "Đoạn B: “Urban farms take many forms”, sau đó kể community gardens, mái nhà, vertical farms." },
          { id: "2", type: "choice", text: "a reason why some vertical farming businesses have failed", answer: "D", explain: "Đoạn D: “expensive to build and run, and several… companies… have gone out of business” — go out of business = fail." },
          { id: "3", type: "choice", text: "a mental health benefit of gardening", answer: "E", explain: "Đoạn E: “gardening with lower levels of stress”." },
          { id: "4", type: "choice", text: "a prediction about where people will live", answer: "A", explain: "Đoạn A: “By 2050, around two thirds… is expected to live in cities”." },
        ],
      },
      {
        title: "Questions 5–8",
        instruction: TFNG_INSTRUCTION,
        questions: [
          { id: "5", type: "tfng", text: "Vertical farms can produce crops in any season.", answer: "TRUE", explain: "Đoạn C: “harvested all year round, regardless of the weather”." },
          { id: "6", type: "tfng", text: "Vertical farms generally need more water than traditional farms.", answer: "FALSE", explain: "Đoạn C: “use up to 95 percent less water than conventional agriculture”." },
          { id: "7", type: "tfng", text: "Wheat is commonly grown in vertical farms.", answer: "FALSE", explain: "Đoạn D: wheat và rice “are not economically viable indoors” → không trồng phổ biến trong nhà." },
          { id: "8", type: "tfng", text: "Most community gardens are paid for by local governments.", answer: "NOT GIVEN", explain: "Bài không nhắc ai chi tiền cho community gardens." },
        ],
      },
      {
        title: "Questions 9–12",
        instruction: "Hoàn thành tóm tắt. Dùng NO MORE THAN TWO WORDS lấy từ bài đọc.",
        questions: [
          { id: "9", type: "gap", text: "In vertical farms, crops are grown in layers under ______,", answers: ["led lights"], explain: "Đoạn B: “grown in stacked layers under LED lights”." },
          { id: "10", type: "gap", text: "and their roots are often placed in water that contains ______.", answers: ["nutrients"], explain: "Đoạn B: “roots in water containing nutrients”." },
          { id: "11", type: "gap", text: "Because insects find it hard to get in, ______ are seldom used.", answers: ["pesticides"], explain: "Đoạn C: “pesticides are rarely needed” — seldom = rarely." },
          { id: "12", type: "gap", text: "However, their heavy use of ______ may cancel out the environmental benefits.", answers: ["electricity", "energy"], explain: "Đoạn D: “consume enormous amounts of electricity… their environmental benefits may be lost”." },
        ],
      },
      {
        title: "Question 13",
        instruction: "Chọn đáp án đúng A, B, C hoặc D.",
        questions: [
          {
            id: "13",
            type: "mcq",
            text: "What is the overall view of urban farming presented in the final paragraph?",
            options: [
              "It will soon replace traditional agriculture.",
              "It is too expensive to be useful.",
              "It can support, but not replace, conventional farming.",
              "It is mainly useful for educating children.",
            ],
            answer: 2,
            explain: "Đoạn F: “Few experts believe… will ever replace… Most see it instead as a complement” — complement = hỗ trợ, bổ sung.",
          },
        ],
      },
    ],
  },
];

export const PASSAGES: Passage[] = [...BASE_PASSAGES, ...MORE_PASSAGES];

/** Quy đổi tỉ lệ đúng sang band ước lượng, dựa trên thang 40 câu của IELTS Academic Reading. */
export function estimateBand(score: number, total: number): number {
  const raw = (score / total) * 40;
  const table: [number, number][] = [
    [39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6], [19, 5.5], [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3],
  ];
  for (const [min, band] of table) if (raw >= min) return band;
  return 2.5;
}

export function normalizeAnswer(s: string) {
  return s.toLowerCase().replace(/[.,!?"“”']/g, "").replace(/\s+/g, " ").trim();
}
