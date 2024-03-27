import i18n from "i18n-js";

// Mặc định là tiếng Anh
const en = {
  greeting: "Hello",
  // Thêm các bản dịch khác ở đây
};

const vi = {
  greeting: "Xin chào",
  // Thêm các bản dịch khác ở đây
};

i18n.translations = { en, vi };
i18n.fallbacks = true;
i18n.locale = "en"; // Ngôn ngữ mặc định

export default i18n;
