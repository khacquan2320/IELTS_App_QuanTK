// Đề Writing Task 1 (Academic) — số liệu giả định, soạn riêng cho app để luyện mô tả biểu đồ.

export type ChartKind = "line" | "bar" | "pie" | "table" | "process";

export type Task1 = {
  id: string;
  kind: ChartKind;
  title: string;
  prompt: string;
  unit: string;
  /** Nhãn trục X (line/bar), các phần (pie), các hàng (table) hoặc các bước (process) */
  categories: string[];
  /** Mỗi series là 1 đường / 1 màu cột / 1 biểu đồ tròn / 1 cột của bảng */
  series: { name: string; values: number[] }[];
  overview: string;
  tips: string[];
};

export const TASK1_GUIDE = [
  "Mở bài (1 câu): paraphrase đề — “The chart illustrates / compares / shows…”",
  "Overview (2 câu): xu hướng chính hoặc điểm nổi bật nhất. KHÔNG nêu số liệu chi tiết.",
  "Thân bài 1: nhóm số liệu thứ nhất, có số liệu cụ thể và so sánh.",
  "Thân bài 2: nhóm số liệu còn lại. Không cần kết luận, không nêu ý kiến cá nhân.",
];

export const TASK1: Task1[] = [
  {
    id: "t1-tourists",
    kind: "line",
    title: "International tourist arrivals",
    prompt: "The graph below shows the number of international tourists visiting three countries between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    unit: "million visitors",
    categories: ["2000", "2005", "2010", "2015", "2020"],
    series: [
      { name: "Country A", values: [10, 15, 22, 30, 12] },
      { name: "Country B", values: [20, 22, 21, 25, 8] },
      { name: "Country C", values: [5, 9, 16, 28, 10] },
    ],
    overview: "Overall, all three countries saw tourist numbers grow until 2015, with Country C showing the most dramatic rise, before every country experienced a sharp fall in 2020.",
    tips: ["Nhóm A và C (tăng mạnh) vào 1 đoạn, B (khá ổn định) vào 1 đoạn.", "Dùng: rose steadily, climbed to a peak of, plummeted to.", "Năm 2020 là điểm đặc biệt — nhắc trong overview."],
  },
  {
    id: "t1-commute",
    kind: "bar",
    title: "How people travel to work",
    prompt: "The chart below shows the percentage of workers in one city using different types of transport to travel to work in 1990 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    unit: "%",
    categories: ["Car", "Bus", "Bicycle", "Walking", "Metro"],
    series: [
      { name: "1990", values: [45, 30, 10, 15, 0] },
      { name: "2020", values: [35, 20, 15, 10, 20] },
    ],
    overview: "Overall, the car remained the most popular way to commute in both years, although its share fell, while the most notable change was the introduction of the metro, which was used by a fifth of workers by 2020.",
    tips: ["So sánh 2 năm cho từng phương tiện, không mô tả từng cột một.", "Dùng: accounted for, fell from… to…, a fifth of, whereas.", "Metro từ 0% lên 20% là điểm nổi bật nhất."],
  },
  {
    id: "t1-spending",
    kind: "pie",
    title: "Household spending",
    prompt: "The pie charts below show how the average household in one country spent its budget in 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    unit: "%",
    categories: ["Housing", "Food", "Transport", "Entertainment", "Other"],
    series: [
      { name: "2000", values: [25, 35, 15, 10, 15] },
      { name: "2020", values: [35, 20, 18, 15, 12] },
    ],
    overview: "Overall, housing replaced food as the largest area of household spending over the twenty-year period, while the proportions spent on transport and entertainment increased slightly.",
    tips: ["Biểu đồ tròn: dùng proportion, share, percentage.", "Nhóm: các mục tăng (housing, transport, entertainment) và các mục giảm (food, other).", "Dùng: rose from a quarter to over a third, dropped significantly."],
  },
  {
    id: "t1-leisure",
    kind: "table",
    title: "Time spent on leisure activities",
    prompt: "The table below shows the average number of hours per month that people in three age groups spent on four leisure activities. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    unit: "hours per month",
    categories: ["Watching TV", "Social media", "Sport", "Reading"],
    series: [
      { name: "16–24", values: [40, 60, 15, 8] },
      { name: "25–44", values: [45, 35, 10, 10] },
      { name: "45–64", values: [60, 15, 8, 15] },
    ],
    overview: "Overall, younger people spent the most time on social media, whereas the oldest group preferred watching TV, and reading and sport were the least popular activities for all ages.",
    tips: ["Bảng nhiều số: chỉ chọn số nổi bật nhất (cao nhất, thấp nhất, chênh lệch lớn).", "So sánh theo hoạt động HOẶC theo nhóm tuổi — chọn 1 cách và giữ nguyên.", "Dùng: by contrast, the figure for…, twice as much as."],
  },
  {
    id: "t1-house-prices",
    kind: "line",
    title: "Average house prices",
    prompt: "The graph below shows average house prices in three cities between 2010 and 2022. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    unit: "thousand USD",
    categories: ["2010", "2013", "2016", "2019", "2022"],
    series: [
      { name: "City X", values: [200, 230, 280, 350, 420] },
      { name: "City Y", values: [150, 145, 150, 160, 170] },
      { name: "City Z", values: [100, 140, 190, 210, 205] },
    ],
    overview: "Overall, house prices rose in all three cities, with City X remaining the most expensive throughout and experiencing the greatest increase, while prices in City Y changed very little.",
    tips: ["City X tăng mạnh liên tục, City Y gần như đi ngang, City Z tăng rồi chững lại.", "Dùng: more than doubled, remained relatively stable, levelled off.", "Nhớ ghi đơn vị: $200,000 (không ghi 200)."],
  },
  {
    id: "t1-paper",
    kind: "process",
    title: "How recycled paper is made",
    prompt: "The diagram below shows the process of producing recycled paper. Summarise the information by selecting and reporting the main features.",
    unit: "",
    categories: [
      "Used paper is collected from homes and offices",
      "Paper is sorted by type and quality",
      "Paper is mixed with water to make pulp",
      "Ink and dirt are removed",
      "Pulp is pressed and dried in large rollers",
      "Recycled paper is rolled and sent to shops",
    ],
    series: [],
    overview: "Overall, the process consists of six main stages, beginning with the collection of used paper and ending with the delivery of new paper products to shops.",
    tips: ["Quy trình: dùng câu bị động (is collected, is sorted, are removed).", "Từ nối thứ tự: First, Next, After that, Once…, Finally.", "Nêu số bước và điểm đầu – điểm cuối trong overview."],
  },
];
