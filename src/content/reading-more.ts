// Bài đọc bổ sung theo các chủ đề IELTS thường gặp (soạn riêng cho app).
import type { Passage } from "./reading";

const TFNG = "Chọn TRUE nếu câu khớp với thông tin trong bài, FALSE nếu câu trái với bài, NOT GIVEN nếu bài không nhắc tới.";

export const MORE_PASSAGES: Passage[] = [
  {
    id: "overtourism",
    title: "The Problem of Overtourism",
    topic: "Travel & Tourism",
    level: "Band 6.0",
    minutes: 20,
    paragraphs: [
      { label: "A", text: "Tourism is one of the world's largest industries, and for many destinations it is a vital source of income and employment. Yet in recent years, a new word has entered the dictionary: “overtourism”. It describes a situation in which so many visitors arrive at a place that the quality of life for residents, and often the experience of the visitors themselves, begins to suffer." },
      { label: "B", text: "The causes are not difficult to identify. Cheap flights have made international travel affordable for millions of people, cruise ships can unload thousands of passengers into a small port in a single morning, and social media encourages travellers to visit the same famous spots in order to take the same photographs. As a result, popular places such as Venice, Barcelona and Amsterdam now receive far more visitors than they were designed for." },
      { label: "C", text: "For local people, the effects can be serious. In some historic city centres, homes have been turned into short-term holiday rentals, pushing up rents and forcing residents to move out. Traditional shops are replaced by souvenir stores, streets become crowded and noisy, and rubbish increases. In a number of cities, residents have organised protests, holding signs asking tourists to stay away." },
      { label: "D", text: "Governments have begun to respond. Venice has introduced an entrance fee for day visitors on its busiest days, and some cities have limited the number of new hotels or restricted short-term rentals. Others are trying to spread visitors more evenly, by promoting less famous neighbourhoods or encouraging people to travel outside the peak season." },
      { label: "E", text: "Experts argue that travellers can also play a part. Staying longer in one place rather than making short trips, using locally owned businesses and visiting in spring or autumn can all reduce pressure on popular destinations. The aim, they say, is not to stop tourism, but to make sure that it benefits the places people visit rather than damaging them." },
    ],
    groups: [
      {
        title: "Questions 1–5",
        instruction: "Matching Headings: chọn tiêu đề phù hợp cho mỗi đoạn A–E. Có nhiều tiêu đề hơn số đoạn.",
        options: [
          ["i", "Measures taken by the authorities"],
          ["ii", "A definition of a modern problem"],
          ["iii", "How tourists themselves can help"],
          ["iv", "Reasons for the growth in visitor numbers"],
          ["v", "The impact on people who live there"],
          ["vi", "The history of cruise ships"],
          ["vii", "Why tourism should be banned"],
        ],
        questions: [
          { id: "1", type: "choice", text: "Paragraph A", answer: "ii", explain: "Đoạn A giải thích từ mới “overtourism”: “It describes a situation in which…” → định nghĩa một vấn đề hiện đại." },
          { id: "2", type: "choice", text: "Paragraph B", answer: "iv", explain: "“The causes are…”: vé máy bay rẻ, tàu du lịch, mạng xã hội → lý do lượng khách tăng. vi là bẫy vì cruise ships chỉ là 1 ví dụ." },
          { id: "3", type: "choice", text: "Paragraph C", answer: "v", explain: "“For local people, the effects can be serious” → tác động lên người dân địa phương." },
          { id: "4", type: "choice", text: "Paragraph D", answer: "i", explain: "“Governments have begun to respond”: thu phí, giới hạn khách sạn → biện pháp của chính quyền." },
          { id: "5", type: "choice", text: "Paragraph E", answer: "iii", explain: "“travellers can also play a part” → khách du lịch có thể góp phần. vii sai vì bài nói rõ “The aim… is not to stop tourism”." },
        ],
      },
      {
        title: "Questions 6–9",
        instruction: TFNG,
        questions: [
          { id: "6", type: "tfng", text: "Overtourism can also make the experience worse for tourists.", answer: "TRUE", explain: "Đoạn A: “and often the experience of the visitors themselves, begins to suffer”." },
          { id: "7", type: "tfng", text: "Cruise ship passengers spend more money than other visitors.", answer: "NOT GIVEN", explain: "Bài chỉ nói tàu du lịch đưa nhiều khách đến cùng lúc, không so sánh chi tiêu." },
          { id: "8", type: "tfng", text: "Short-term holiday rentals have caused rents to rise in some city centres.", answer: "TRUE", explain: "Đoạn C: “turned into short-term holiday rentals, pushing up rents” — push up = rise." },
          { id: "9", type: "tfng", text: "Venice charges all visitors an entrance fee every day of the year.", answer: "FALSE", explain: "Đoạn D: phí chỉ áp dụng cho “day visitors on its busiest days”, không phải mọi khách, mọi ngày." },
        ],
      },
      {
        title: "Questions 10–12",
        instruction: "Hoàn thành câu. Dùng ONE WORD ONLY lấy từ bài đọc.",
        questions: [
          { id: "10", type: "gap", text: "In some cities, residents have organised ______ against tourists.", answers: ["protests"], explain: "Đoạn C: “residents have organised protests”." },
          { id: "11", type: "gap", text: "Some cities promote less famous ______ to spread visitors more evenly.", answers: ["neighbourhoods", "neighborhoods"], explain: "Đoạn D: “promoting less famous neighbourhoods”." },
          { id: "12", type: "gap", text: "Experts suggest travelling in spring or ______.", answers: ["autumn", "fall"], explain: "Đoạn E: “visiting in spring or autumn”." },
        ],
      },
    ],
  },
  {
    id: "prison-rehabilitation",
    title: "Prison: Punishment or Rehabilitation?",
    topic: "Crime & Law",
    level: "Band 6.0",
    minutes: 20,
    paragraphs: [
      { label: "A", text: "What is prison for? For most of history, the answer seemed obvious: prison was a punishment, and its purpose was to make offenders suffer for their crimes and to keep them away from the public. Today, however, many criminologists argue that the most important goal should be rehabilitation — helping prisoners to change so that they do not commit crimes again after release." },
      { label: "B", text: "The reason is practical as well as moral. In many countries, a large proportion of prisoners reoffend within a few years of leaving prison. Each new crime creates new victims and new costs for the state, as the offender is arrested, tried and imprisoned once again. If prison simply returns people to society with no job, no qualifications and no support, critics say, it is hardly surprising that so many return to crime." },
      { label: "C", text: "Norway is often cited as an example of a different approach. Its prisons look more like student accommodation than traditional jails: prisoners have private rooms, cook their own meals and are expected to work or study during the day. Staff are trained to act as mentors rather than guards. Norway's rate of reoffending is among the lowest in the world, although researchers point out that other factors, such as its strong welfare system, may also play a role." },
      { label: "D", text: "Opponents of this model argue that comfortable prisons fail to deter crime and are unfair to victims, who may feel that offenders are being rewarded. They also note that such prisons are expensive to run. Supporters reply that education and training programmes cost far less than the repeated imprisonment of the same people." },
      { label: "E", text: "Many experts now believe that for minor offences, alternatives to prison may be more effective still. Community service, electronic tagging and programmes that bring offenders face to face with their victims allow people to remain with their families and keep their jobs, which are two of the strongest protections against reoffending." },
    ],
    groups: [
      {
        title: "Questions 1–4",
        instruction: "Matching Information: đoạn nào (A–E) chứa thông tin sau?",
        options: [["A", "Paragraph A"], ["B", "Paragraph B"], ["C", "Paragraph C"], ["D", "Paragraph D"], ["E", "Paragraph E"]],
        questions: [
          { id: "1", type: "choice", text: "an example of one country's approach to prisons", answer: "C", explain: "Đoạn C: “Norway is often cited as an example of a different approach”." },
          { id: "2", type: "choice", text: "a reason why many former prisoners commit new crimes", answer: "B", explain: "Đoạn B: ra tù mà “no job, no qualifications and no support” → dễ tái phạm." },
          { id: "3", type: "choice", text: "arguments against comfortable prisons", answer: "D", explain: "Đoạn D: “Opponents of this model argue…”." },
          { id: "4", type: "choice", text: "a traditional view of the purpose of prison", answer: "A", explain: "Đoạn A: “For most of history… prison was a punishment”." },
        ],
      },
      {
        title: "Questions 5–8",
        instruction: TFNG,
        questions: [
          { id: "5", type: "tfng", text: "Prisoners in Norway prepare their own food.", answer: "TRUE", explain: "Đoạn C: “cook their own meals” — prepare food = cook meals." },
          { id: "6", type: "tfng", text: "Researchers agree that Norway's low reoffending rate is caused only by its prisons.", answer: "FALSE", explain: "Đoạn C: “other factors, such as its strong welfare system, may also play a role” → không chỉ do nhà tù." },
          { id: "7", type: "tfng", text: "Norwegian prison staff are paid more than prison staff in other countries.", answer: "NOT GIVEN", explain: "Bài nói nhân viên được đào tạo làm mentor, không nhắc đến lương." },
          { id: "8", type: "tfng", text: "Supporters claim that education programmes are cheaper than repeatedly imprisoning the same people.", answer: "TRUE", explain: "Đoạn D: “cost far less than the repeated imprisonment of the same people”." },
        ],
      },
      {
        title: "Question 9",
        instruction: "Chọn đáp án đúng A, B, C hoặc D.",
        questions: [
          {
            id: "9",
            type: "mcq",
            text: "According to paragraph E, alternatives to prison work well for minor offences mainly because offenders",
            options: ["pay less money to the state.", "can stay with their families and keep their jobs.", "are punished more severely.", "never meet their victims."],
            answer: 1,
            explain: "“allow people to remain with their families and keep their jobs, which are two of the strongest protections against reoffending”. D sai: một số chương trình còn cho họ gặp nạn nhân.",
          },
        ],
      },
      {
        title: "Questions 10–12",
        instruction: "Hoàn thành câu. Dùng NO MORE THAN TWO WORDS lấy từ bài đọc.",
        questions: [
          { id: "10", type: "gap", text: "Staff in Norwegian prisons are trained to act as ______ rather than guards.", answers: ["mentors"], explain: "Đoạn C: “act as mentors rather than guards”." },
          { id: "11", type: "gap", text: "Alternatives to prison include community service and electronic ______.", answers: ["tagging"], explain: "Đoạn E: “Community service, electronic tagging…”." },
          { id: "12", type: "gap", text: "Opponents say comfortable prisons are unfair to ______.", answers: ["victims"], explain: "Đoạn D: “unfair to victims”." },
        ],
      },
    ],
  },
  {
    id: "cycling-city",
    title: "A City of Cyclists",
    topic: "Transport",
    level: "Band 5.5",
    minutes: 18,
    paragraphs: [
      { label: "A", text: "In Copenhagen, the capital of Denmark, more people travel to work or school by bicycle than by car. On a typical morning, the city's cycle lanes are full of commuters, parents carrying children in cargo bikes and business people in suits. This was not always the case. In the 1960s and 1970s, the city was filled with cars, just like most European capitals." },
      { label: "B", text: "Things began to change in the 1970s, when an oil crisis made fuel expensive and many citizens began to demand safer streets. Over the following decades, the city invested steadily in cycling. It built wide cycle lanes separated from traffic by a kerb, introduced traffic lights timed to the speed of bicycles, and constructed bridges used only by cyclists and pedestrians." },
      { label: "C", text: "The benefits have been significant. Cycling produces no emissions, so it helps reduce air pollution. It is also good for health: regular cyclists take fewer sick days, which saves money for both employers and the health system. In addition, bicycles take up far less space than cars, so streets can carry more people without becoming congested." },
      { label: "D", text: "Other cities have tried to copy Copenhagen's success, with mixed results. Simply painting a line on the road is rarely enough; people only start cycling in large numbers when they feel safe. Climate and geography also matter. Cities that are very hot or very hilly face greater challenges, although electric bicycles are making hills much less of a problem." },
      { label: "E", text: "Perhaps the most important lesson from Copenhagen is that people's behaviour follows infrastructure. Most residents do not cycle because they care about the environment, but simply because it is the fastest and most convenient way to get around the city." },
    ],
    groups: [
      {
        title: "Questions 1–2",
        instruction: "Chọn đáp án đúng A, B, C hoặc D.",
        questions: [
          { id: "1", type: "mcq", text: "In the 1960s, Copenhagen was", options: ["famous for cycling.", "full of cars.", "smaller than other capitals.", "closed to cars."], answer: 1, explain: "Đoạn A: “In the 1960s and 1970s, the city was filled with cars”." },
          { id: "2", type: "mcq", text: "What first caused the change in the 1970s?", options: ["New national laws", "An oil crisis and public demand for safer streets", "The invention of electric bicycles", "A rise in tourism"], answer: 1, explain: "Đoạn B: “an oil crisis made fuel expensive and many citizens began to demand safer streets”." },
        ],
      },
      {
        title: "Questions 3–6",
        instruction: TFNG,
        questions: [
          { id: "3", type: "tfng", text: "In Copenhagen, cycling is more common than driving for journeys to work or school.", answer: "TRUE", explain: "Đoạn A: “more people travel to work or school by bicycle than by car”." },
          { id: "4", type: "tfng", text: "Some bridges in Copenhagen are closed to cars.", answer: "TRUE", explain: "Đoạn B: “bridges used only by cyclists and pedestrians” → ô tô không được đi." },
          { id: "5", type: "tfng", text: "Regular cyclists in Copenhagen earn higher salaries than drivers.", answer: "NOT GIVEN", explain: "Bài nói người đạp xe ít nghỉ ốm, không nói về lương." },
          { id: "6", type: "tfng", text: "Painting lines on the road is usually enough to make people cycle.", answer: "FALSE", explain: "Đoạn D: “Simply painting a line on the road is rarely enough”." },
        ],
      },
      {
        title: "Questions 7–10",
        instruction: "Hoàn thành câu. Dùng ONE WORD ONLY lấy từ bài đọc.",
        questions: [
          { id: "7", type: "gap", text: "Cycle lanes are separated from traffic by a ______.", answers: ["kerb", "curb"], explain: "Đoạn B: “separated from traffic by a kerb”." },
          { id: "8", type: "gap", text: "Some traffic lights are timed to the ______ of bicycles.", answers: ["speed"], explain: "Đoạn B: “traffic lights timed to the speed of bicycles”." },
          { id: "9", type: "gap", text: "Regular cyclists take fewer ______ days.", answers: ["sick"], explain: "Đoạn C: “take fewer sick days”." },
          { id: "10", type: "gap", text: "Electric bicycles are making ______ less of a problem.", answers: ["hills"], explain: "Đoạn D: “electric bicycles are making hills much less of a problem”." },
        ],
      },
      {
        title: "Question 11",
        instruction: "Chọn đáp án đúng A, B, C hoặc D.",
        questions: [
          { id: "11", type: "mcq", text: "According to the last paragraph, why do most people in Copenhagen cycle?", options: ["To protect the environment", "Because it is quick and convenient", "Because cars are banned", "To keep fit"], answer: 1, explain: "Đoạn E: “not because they care about the environment, but simply because it is the fastest and most convenient way”." },
        ],
      },
    ],
  },
  {
    id: "food-waste",
    title: "The Hidden Cost of Food Waste",
    topic: "Food & Diet",
    level: "Band 6.0",
    minutes: 20,
    paragraphs: [
      { label: "A", text: "Around a third of all the food produced in the world is never eaten. It is lost or thrown away somewhere between the farm and the plate. At a time when hundreds of millions of people do not have enough to eat, this waste is not only a moral problem but also an environmental one: when food rots in landfill sites, it releases methane, a powerful greenhouse gas." },
      { label: "B", text: "Where the waste happens depends on the country. In poorer nations, most food is lost early in the supply chain, because farmers lack proper storage facilities, refrigeration or good roads to transport crops to market. In wealthy countries, by contrast, the largest share is wasted by shops and consumers." },
      { label: "C", text: "Supermarkets contribute in several ways. They often reject fruit and vegetables that are the wrong shape or size, even though they are perfectly safe to eat. Special offers such as “buy one, get one free” encourage shoppers to buy more than they need. At home, confusion about date labels is a major factor: many people throw away food on its “best before” date, although this label refers to quality rather than safety." },
      { label: "D", text: "Some solutions are simple. A number of supermarkets now sell “ugly” vegetables at lower prices, and apps allow restaurants and shops to sell surplus food cheaply at the end of the day. In France, a law passed in 2016 prevents large supermarkets from destroying unsold food that is still edible; instead, it must be given to charities." },
      { label: "E", text: "Individuals can also make a difference by planning meals, writing shopping lists and using leftovers creatively. Campaigners argue that if food waste were a country, it would be one of the largest producers of greenhouse gases in the world — so reducing it is one of the easiest ways for ordinary people to help the planet." },
    ],
    groups: [
      {
        title: "Questions 1–5",
        instruction: "Matching Headings: chọn tiêu đề phù hợp cho mỗi đoạn A–E. Có nhiều tiêu đề hơn số đoạn.",
        options: [
          ["i", "Different patterns in rich and poor countries"],
          ["ii", "The scale of the problem"],
          ["iii", "Practices that encourage waste"],
          ["iv", "Practical steps by businesses and governments"],
          ["v", "What ordinary people can do"],
          ["vi", "The rising cost of food"],
          ["vii", "Health risks of eating old food"],
        ],
        questions: [
          { id: "1", type: "choice", text: "Paragraph A", answer: "ii", explain: "“Around a third of all the food… is never eaten” → quy mô vấn đề." },
          { id: "2", type: "choice", text: "Paragraph B", answer: "i", explain: "So sánh “poorer nations” và “wealthy countries” → khác biệt giữa nước giàu và nghèo." },
          { id: "3", type: "choice", text: "Paragraph C", answer: "iii", explain: "Siêu thị loại rau xấu, khuyến mãi mua 1 tặng 1, nhầm nhãn ngày → những thói quen gây lãng phí." },
          { id: "4", type: "choice", text: "Paragraph D", answer: "iv", explain: "Siêu thị bán rau “xấu”, app bán đồ dư, luật của Pháp → doanh nghiệp và chính phủ hành động." },
          { id: "5", type: "choice", text: "Paragraph E", answer: "v", explain: "“Individuals can also make a difference” → người bình thường có thể làm gì." },
        ],
      },
      {
        title: "Questions 6–9",
        instruction: TFNG,
        questions: [
          { id: "6", type: "tfng", text: "Rotting food produces a gas that contributes to global warming.", answer: "TRUE", explain: "Đoạn A: “releases methane, a powerful greenhouse gas”." },
          { id: "7", type: "tfng", text: "In poor countries, most food is wasted by consumers.", answer: "FALSE", explain: "Đoạn B: ở nước nghèo, thực phẩm mất “early in the supply chain” do thiếu kho, tủ lạnh. Người tiêu dùng lãng phí nhiều nhất là ở nước giàu." },
          { id: "8", type: "tfng", text: "A “best before” date shows when food becomes unsafe to eat.", answer: "FALSE", explain: "Đoạn C: nhãn này “refers to quality rather than safety”." },
          { id: "9", type: "tfng", text: "The French law also applies to small shops.", answer: "NOT GIVEN", explain: "Bài chỉ nhắc “large supermarkets”, không nói gì về cửa hàng nhỏ. Đừng tự suy ra là FALSE." },
        ],
      },
      {
        title: "Questions 10–13",
        instruction: "Hoàn thành câu. Dùng ONE WORD ONLY lấy từ bài đọc.",
        questions: [
          { id: "10", type: "gap", text: "Food that rots in landfill releases ______.", answers: ["methane"], explain: "Đoạn A: “it releases methane”." },
          { id: "11", type: "gap", text: "Some supermarkets sell “______” vegetables at lower prices.", answers: ["ugly"], explain: "Đoạn D: “sell “ugly” vegetables at lower prices”." },
          { id: "12", type: "gap", text: "In France, unsold edible food must be given to ______.", answers: ["charities"], explain: "Đoạn D: “it must be given to charities”." },
          { id: "13", type: "gap", text: "People can cut waste by using ______ creatively.", answers: ["leftovers"], explain: "Đoạn E: “using leftovers creatively”." },
        ],
      },
    ],
  },
  {
    id: "future-office",
    title: "The Future of the Office",
    topic: "Work & Careers",
    level: "Band 6.5",
    minutes: 22,
    paragraphs: [
      { label: "A", text: "Before 2020, working from home was a privilege enjoyed by a relatively small number of employees, usually in technology companies or senior positions. The COVID-19 pandemic changed that almost overnight. As offices closed, millions of workers discovered that much of their job could be done from a kitchen table, and many companies discovered that productivity did not collapse as they had feared." },
      { label: "B", text: "Several years later, a new pattern has emerged. Fully remote work remains relatively uncommon, but hybrid working — in which employees divide their week between home and the office — has become standard in many industries. Surveys consistently show that workers value this flexibility highly; some even say they would accept a lower salary in exchange for the right to work from home part of the week." },
      { label: "C", text: "The advantages for employees are clear. Without a daily commute, workers save time and money, and parents find it easier to combine work with childcare. Employers can benefit too: they can reduce spending on office space and recruit talented people who live far from the company's headquarters." },
      { label: "D", text: "However, remote work has drawbacks. Many employees report feeling isolated, and the boundary between work and private life can become blurred, with some people finding it difficult to stop checking emails in the evening. Managers worry that new and younger staff, in particular, miss out on learning from experienced colleagues, much of which happens informally, through overheard conversations and quick questions." },
      { label: "E", text: "Some large firms have therefore asked staff to return to the office for most of the week, arguing that face-to-face contact encourages creativity and builds a stronger company culture. These policies have not always been popular, and some companies have lost skilled employees to competitors offering greater flexibility." },
      { label: "F", text: "What seems certain is that the traditional five-day office week is unlikely to return for most knowledge workers. The office of the future may be used less as a place to do individual tasks and more as a space for meetings, training and collaboration." },
    ],
    groups: [
      {
        title: "Questions 1–4",
        instruction: "Matching Information: đoạn nào (A–F) chứa thông tin sau?",
        options: [["A", "Paragraph A"], ["B", "Paragraph B"], ["C", "Paragraph C"], ["D", "Paragraph D"], ["E", "Paragraph E"], ["F", "Paragraph F"]],
        questions: [
          { id: "1", type: "choice", text: "the effect of strict office policies on keeping staff", answer: "E", explain: "Đoạn E: “some companies have lost skilled employees to competitors offering greater flexibility”." },
          { id: "2", type: "choice", text: "a prediction about how offices will be used", answer: "F", explain: "Đoạn F: “The office of the future may be used… for meetings, training and collaboration”." },
          { id: "3", type: "choice", text: "a reason why junior employees may be disadvantaged", answer: "D", explain: "Đoạn D: “new and younger staff… miss out on learning from experienced colleagues”." },
          { id: "4", type: "choice", text: "ways in which employers can save money", answer: "C", explain: "Đoạn C: “reduce spending on office space”." },
        ],
      },
      {
        title: "Questions 5–8",
        instruction: TFNG,
        questions: [
          { id: "5", type: "tfng", text: "Before 2020, most employees worked from home at least some of the time.", answer: "FALSE", explain: "Đoạn A: làm ở nhà là đặc quyền của “a relatively small number of employees”." },
          { id: "6", type: "tfng", text: "Productivity fell sharply when offices closed.", answer: "FALSE", explain: "Đoạn A: “productivity did not collapse as they had feared”." },
          { id: "7", type: "tfng", text: "Some workers would accept less pay in order to work from home part of the week.", answer: "TRUE", explain: "Đoạn B: “would accept a lower salary in exchange for the right to work from home”." },
          { id: "8", type: "tfng", text: "Hybrid working is more common in Europe than in Asia.", answer: "NOT GIVEN", explain: "Bài không so sánh giữa các châu lục." },
        ],
      },
      {
        title: "Questions 9–11",
        instruction: "Hoàn thành câu. Dùng NO MORE THAN TWO WORDS lấy từ bài đọc.",
        questions: [
          { id: "9", type: "gap", text: "Without a daily ______, workers save time and money.", answers: ["commute"], explain: "Đoạn C: “Without a daily commute”." },
          { id: "10", type: "gap", text: "Some people find it hard to stop checking ______ in the evening.", answers: ["emails"], explain: "Đoạn D: “difficult to stop checking emails in the evening”." },
          { id: "11", type: "gap", text: "Much learning from colleagues happens ______, through overheard conversations.", answers: ["informally"], explain: "Đoạn D: “much of which happens informally”." },
        ],
      },
      {
        title: "Questions 12–13",
        instruction: "Chọn đáp án đúng A, B, C hoặc D.",
        questions: [
          { id: "12", type: "mcq", text: "Why have some firms asked staff to return to the office?", options: ["To reduce costs", "Because face-to-face contact helps creativity and company culture", "Because employees asked for it", "Because of new government rules"], answer: 1, explain: "Đoạn E: “arguing that face-to-face contact encourages creativity and builds a stronger company culture”." },
          { id: "13", type: "mcq", text: "Which statement best reflects the writer's view in paragraph F?", options: ["The five-day office week will soon return.", "Offices will disappear completely.", "Offices will be used mainly for working together.", "Remote work will come to an end."], answer: 2, explain: "Đoạn F: văn phòng sẽ dùng “more as a space for meetings, training and collaboration” — collaboration = working together." },
        ],
      },
    ],
  },
  {
    id: "zoos",
    title: "Do We Still Need Zoos?",
    topic: "Animals & Nature",
    level: "Band 6.0",
    minutes: 20,
    paragraphs: [
      { label: "A", text: "Zoos have existed in some form for thousands of years, but their purpose has changed dramatically. Early collections of wild animals were kept by kings and emperors to display their wealth and power. In the nineteenth century, public zoos opened in cities such as London, mainly to entertain visitors and satisfy their curiosity about exotic creatures. Animals were often kept in small cages with bare floors." },
      { label: "B", text: "Modern zoos describe their mission very differently. Leading zoos today say their main goals are conservation, education and research. Many run breeding programmes for endangered species, and a few animals that had disappeared from the wild, such as the Arabian oryx, have been successfully returned to their natural habitat after being bred in captivity." },
      { label: "C", text: "Zoos also argue that they inspire people to care about wildlife. For many city children, a zoo visit is the only chance to see an elephant or a tiger in real life, and supporters believe this experience can create a lifelong interest in protecting nature." },
      { label: "D", text: "Critics are not convinced. They point out that most animals in zoos are not endangered and that only a small proportion of zoo budgets is spent on conservation in the wild. Some species, particularly large animals that travel long distances in nature, such as elephants and polar bears, appear to suffer in captivity and may develop repetitive behaviours, like walking in circles, which are signs of stress." },
      { label: "E", text: "A possible compromise is emerging. Some zoos have stopped keeping species that do not adapt well to captivity and have used the space to create larger, more natural enclosures for others. At the same time, wildlife sanctuaries and protected areas are receiving more attention, as many experts believe that the best way to save a species is to protect the habitat in which it lives." },
    ],
    groups: [
      {
        title: "Questions 1–5",
        instruction: "Matching Headings: chọn tiêu đề phù hợp cho mỗi đoạn A–E. Có nhiều tiêu đề hơn số đoạn.",
        options: [
          ["i", "Doubts about the value of zoos"],
          ["ii", "From royal collections to public entertainment"],
          ["iii", "A middle way"],
          ["iv", "The emotional impact on visitors"],
          ["v", "New aims of today's zoos"],
          ["vi", "How zoos make money"],
          ["vii", "The best zoos in the world"],
        ],
        questions: [
          { id: "1", type: "choice", text: "Paragraph A", answer: "ii", explain: "Vua chúa sưu tầm thú → thế kỷ 19 sở thú công cộng để “entertain visitors”." },
          { id: "2", type: "choice", text: "Paragraph B", answer: "v", explain: "“main goals are conservation, education and research” → mục tiêu mới." },
          { id: "3", type: "choice", text: "Paragraph C", answer: "iv", explain: "Trẻ em thành phố được thấy voi, hổ thật → tạo hứng thú suốt đời: tác động cảm xúc." },
          { id: "4", type: "choice", text: "Paragraph D", answer: "i", explain: "“Critics are not convinced” → nghi ngờ giá trị của sở thú." },
          { id: "5", type: "choice", text: "Paragraph E", answer: "iii", explain: "“A possible compromise” — compromise = middle way." },
        ],
      },
      {
        title: "Questions 6–9",
        instruction: TFNG,
        questions: [
          { id: "6", type: "tfng", text: "Zoos in the nineteenth century were mainly intended to entertain the public.", answer: "TRUE", explain: "Đoạn A: “mainly to entertain visitors”." },
          { id: "7", type: "tfng", text: "The Arabian oryx has been returned to the wild after being bred in zoos.", answer: "TRUE", explain: "Đoạn B: “returned to their natural habitat after being bred in captivity”." },
          { id: "8", type: "tfng", text: "Most animals kept in zoos belong to endangered species.", answer: "FALSE", explain: "Đoạn D: “most animals in zoos are not endangered”." },
          { id: "9", type: "tfng", text: "Polar bears live longer in zoos than in the wild.", answer: "NOT GIVEN", explain: "Bài nói gấu Bắc Cực có dấu hiệu căng thẳng, không nói về tuổi thọ." },
        ],
      },
      {
        title: "Questions 10–12",
        instruction: "Hoàn thành câu. Dùng ONE WORD ONLY lấy từ bài đọc.",
        questions: [
          { id: "10", type: "gap", text: "Repetitive behaviours such as walking in circles are signs of ______.", answers: ["stress"], explain: "Đoạn D: “which are signs of stress”." },
          { id: "11", type: "gap", text: "Some zoos have created larger, more natural ______.", answers: ["enclosures"], explain: "Đoạn E: “larger, more natural enclosures”." },
          { id: "12", type: "gap", text: "Many experts think the best way to save a species is to protect its ______.", answers: ["habitat"], explain: "Đoạn E: “protect the habitat in which it lives”." },
        ],
      },
    ],
  },
];
