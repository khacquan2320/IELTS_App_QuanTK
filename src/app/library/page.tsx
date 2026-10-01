import { MaterialBrowser } from "@/components/MaterialBrowser";
import { PageHeader } from "@/components/ui";

export default function LibraryPage() {
  return (
    <div>
      <PageHeader
        title="Tài liệu khóa học"
        subtitle="Toàn bộ tài liệu khóa L5.5 trong thư mục IELTS_Hang_vu: bài tập, vocab list, grammar, đề kiểm tra, ảnh vở ghi. File mp3 nằm ở trang Listening."
      />
      <MaterialBrowser />
    </div>
  );
}
