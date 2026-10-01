// Đọc bài Reading rồi VIẾT câu trả lời bằng lời của mình (luyện đọc hiểu + paraphrase + viết câu).
// Mỗi bài: vài câu hỏi mở + 1 yêu cầu tóm tắt, kèm câu trả lời mẫu để tự so sánh.

export type ReadWriteSet = {
  passageId: string;
  questions: { q: string; model: string }[];
  summary: string;
};

export const SUMMARY_TASK = "Summarise the passage in 3–4 sentences using your own words (about 60–80 words).";

export const READ_WRITE: ReadWriteSet[] = [
  {
    passageId: "four-day-week",
    questions: [
      { q: "What happens to workers' pay in a typical four-day week trial?", model: "Their pay stays the same, even though they work one day less each week." },
      { q: "What were the main benefits of the UK trial for employees and employers?", model: "Employees felt less stressed, slept better and took fewer sick days, while employers kept roughly the same revenue and lost fewer staff." },
      { q: "Why do critics doubt that the results apply to all organisations?", model: "The companies chose to take part and were probably already suitable for a shorter week, whereas services such as hospitals or schools cannot simply close for a day." },
    ],
    summary: "Some companies are testing a four-day working week without reducing salaries. A large trial in the UK found that staff were less stressed and healthier, while revenue stayed about the same, so most firms kept the new system. However, critics say the results may not apply to every workplace, and some employees found their days more intense. Supporters believe the real key is working more efficiently.",
  },
  {
    passageId: "why-sleep",
    questions: [
      { q: "Why do many adults not get enough sleep?", model: "Because of busy work schedules, long journeys to work and using their phones late at night." },
      { q: "How does sleep help us learn?", model: "During sleep, the brain sorts the day's information and decides what to remember, so people who sleep after studying remember more." },
      { q: "Give two pieces of advice from the passage for sleeping better.", model: "People should go to bed and get up at the same time every day, and they should avoid screens for at least an hour before bed." },
    ],
    summary: "Many adults do not sleep enough, even though sleep is essential for health. While we sleep, the brain organises information, which improves memory, and the body's immune system and appetite are also affected. To sleep better, experts suggest keeping a regular routine, a cool and dark bedroom, avoiding caffeine later in the day and putting screens away before bed.",
  },
  {
    passageId: "adult-language-learning",
    questions: [
      { q: "What did the 2018 study discover about learning grammar?", model: "It found that the ability to learn grammar stays strong until about 17 or 18 and then declines slowly, but adults can still become very good speakers." },
      { q: "What advantages do adult learners have?", model: "They already understand how language works, can learn rules quickly and are better at using strategies such as grouping vocabulary and setting goals." },
      { q: "According to the writer, what should adult learners do?", model: "They should increase their exposure to the language, stop being afraid of mistakes and practise a little every day." },
    ],
    summary: "Many people think adults cannot learn languages well, but research shows the situation is more complex. Although the ability to learn grammar declines after the late teens, adults have useful advantages, such as understanding grammar rules and using learning strategies. The main difference is that children have more exposure and less fear. Therefore, adults should practise regularly and not worry about mistakes.",
  },
  {
    passageId: "online-news",
    questions: [
      { q: "How have people's news habits changed?", model: "People, especially those under 35, now get news mainly online and from social media, so printed newspaper sales have fallen sharply." },
      { q: "Why have many newspapers lost income?", model: "Most readers do not want to pay for online news, and advertising money now goes mainly to technology companies." },
      { q: "What solutions does the writer mention?", model: "Some newspapers use online subscriptions or ask for donations, and schools teach media literacy so that students can judge whether sources are reliable." },
    ],
    summary: "More and more people read news online, which makes news fast, free and varied. However, newspapers have lost income because readers will not pay and advertisers have moved to technology companies, leading to job losses and closures. False stories also spread quickly on social media. Subscriptions, donations and media literacy education may help, but readers' habits must change.",
  },
  {
    passageId: "urban-farming",
    questions: [
      { q: "Why is urban farming being suggested as a solution?", model: "Because cities are growing, and food is often transported very long distances, which increases emissions and reduces freshness." },
      { q: "What are the main advantages of vertical farms?", model: "They can produce crops all year, use far less water than normal farms and rarely need pesticides." },
      { q: "What are the main disadvantages of vertical farms?", model: "They use a lot of electricity, are expensive to build and run, and can only grow a limited range of crops." },
    ],
    summary: "As cities grow, urban farming is seen as one way to provide fresher food with lower emissions. It ranges from community gardens to high-tech vertical farms, which save water and grow crops all year but use a great deal of energy and are costly. Smaller projects bring social benefits. Experts think urban farming will support, not replace, traditional agriculture.",
  },
  {
    passageId: "overtourism",
    questions: [
      { q: "What does “overtourism” mean?", model: "It means a situation where a place has so many visitors that life for local people, and even the tourists' experience, becomes worse." },
      { q: "What are the causes of overtourism?", model: "Cheap flights, large cruise ships and social media, which makes people visit the same famous places." },
      { q: "How can tourists reduce the problem?", model: "They can stay longer in one place, use local businesses and travel outside the busy summer season." },
    ],
    summary: "Overtourism happens when too many visitors damage a place for residents and tourists alike. It is caused by cheap flights, cruise ships and social media. Local people suffer from higher rents, crowded streets and the loss of traditional shops. Governments are introducing fees and limits, and tourists can help by travelling more responsibly.",
  },
  {
    passageId: "prison-rehabilitation",
    questions: [
      { q: "Why do many experts think rehabilitation should be the main aim of prison?", model: "Because many prisoners commit new crimes after release, which creates more victims and costs, especially if they leave without jobs or support." },
      { q: "How are Norwegian prisons different from traditional prisons?", model: "Prisoners have private rooms, cook their own meals and work or study, and staff act as mentors instead of guards." },
      { q: "Why might alternatives to prison work better for minor crimes?", model: "Because offenders can stay with their families and keep their jobs, which helps stop them reoffending." },
    ],
    summary: "Traditionally, prison was seen as punishment, but many experts now believe its main aim should be rehabilitation, because many released prisoners reoffend. Norway's prisons focus on work, study and support, and its reoffending rate is very low, although critics say such prisons are too comfortable and expensive. For minor crimes, community-based punishments may be even more effective.",
  },
  {
    passageId: "cycling-city",
    questions: [
      { q: "Why did Copenhagen start investing in cycling?", model: "Because an oil crisis in the 1970s made fuel expensive and citizens wanted safer streets." },
      { q: "What has the city built to support cyclists?", model: "Wide cycle lanes separated from cars, traffic lights timed for bicycles and bridges only for cyclists and pedestrians." },
      { q: "What is the main lesson from Copenhagen, according to the writer?", model: "People's behaviour follows infrastructure: they cycle because it is the quickest and most convenient option, not mainly for the environment." },
    ],
    summary: "Copenhagen changed from a car-filled city into one where most commuters cycle. After the oil crisis of the 1970s, it invested in safe cycle lanes, special traffic lights and bridges. This has reduced pollution, improved health and saved space. Other cities find it harder to copy, but the key lesson is that good infrastructure makes cycling the easiest choice.",
  },
  {
    passageId: "food-waste",
    questions: [
      { q: "Why is food waste an environmental problem?", model: "Because food that rots in landfill releases methane, which is a powerful greenhouse gas." },
      { q: "How is food waste different in rich and poor countries?", model: "In poor countries, food is mostly lost before it reaches market because of poor storage and transport, while in rich countries shops and consumers waste the most." },
      { q: "How do supermarkets contribute to food waste?", model: "They reject fruit and vegetables that look imperfect and use special offers that make people buy more than they need." },
    ],
    summary: "About a third of the world's food is wasted, which is both unfair and harmful to the environment. Poor countries lose food early because of weak storage and transport, while rich countries waste it in shops and homes, partly because of strict supermarket standards and confusing date labels. Selling imperfect produce, new laws and better planning at home can reduce the problem.",
  },
  {
    passageId: "future-office",
    questions: [
      { q: "How did the pandemic change attitudes to working from home?", model: "Millions of people found they could do their jobs at home, and companies saw that productivity did not fall as much as they had expected." },
      { q: "What are the advantages of remote work for employers?", model: "They can spend less on office space and hire talented people who live far away." },
      { q: "Why are managers worried about young employees working remotely?", model: "Because young staff learn a lot informally from experienced colleagues, and they miss this when they are not in the office." },
    ],
    summary: "Since the pandemic, hybrid working has become normal in many industries, and workers value its flexibility highly. It saves employees time and money and helps companies cut costs, but it can cause isolation, blur the line between work and home and limit learning for junior staff. Although some firms want staff back in the office, offices will probably be used mainly for collaboration.",
  },
  {
    passageId: "zoos",
    questions: [
      { q: "How has the purpose of zoos changed over time?", model: "Zoos were first used to show the power of rulers and later to entertain the public, but today they focus on conservation, education and research." },
      { q: "What arguments do critics make against zoos?", model: "Most zoo animals are not endangered, little money goes to conservation in the wild, and some large animals show signs of stress in captivity." },
      { q: "What compromise is described in the final paragraph?", model: "Some zoos keep fewer species and give the rest bigger, more natural enclosures, while more attention is given to protecting wild habitats." },
    ],
    summary: "Zoos have changed from royal collections and public entertainment into organisations focused on conservation and education, and some have helped return species to the wild. Critics argue that most zoo animals are not endangered and that large animals suffer in captivity. A compromise is developing, with fewer species, larger enclosures and more focus on protecting natural habitats.",
  },
];
