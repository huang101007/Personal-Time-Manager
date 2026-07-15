# 專屬時間管理器(Personal Time Manager)

## 專案簡介
這是我在大學時期為了將所學實際應用於生活而創建的專屬時間管理器。經過一年多的持續使用與迭代改進，此系統不僅涵蓋了多項高度客製化的功能，更成功幫助我在25學分的繁重課業下維持高效率，最終獲得書卷獎的肯定。這不僅僅是一個待辦事項清單，而是一個能適應個人學習節奏的智慧助理。

## 核心功能
* **教學大綱匯入與自動更新**：開學時可直接匯入各科教學大綱，系統將自動提取資訊並更新考試倒數時間，免去手動輸入的繁瑣。
* **智慧讀書計畫分配**：支援自訂調整各科目的重要性與權重，系統會根據剩餘時間自動分配每個時段應該專注的科目，確保學習進度落實。
* **情緒預測與心靈調劑**：內建有趣的情緒預測小功能，並可依照當下心情自由選擇顯示勵志語錄或笑話，幫助在緊湊的學習中適度放鬆身心。

## 系統截圖
**主畫面**
可快速了解各科進度及考試倒數
<img width="861" height="388" alt="時間管理器主畫面" src="https://github.com/user-attachments/assets/bdaff96d-3cd2-4970-ac8e-7cd237328d26" />
**功能列表**
<img width="335" height="730" alt="功能列表" src="https://github.com/user-attachments/assets/1e6ff8d0-dd04-45f3-bc06-575777f4db4e" />
**時間表**
土黃色為固定課表，深藍為固定複習時間，扣除後剩餘可用時間會顯示在上面
<img width="645" height="576" alt="時間表" src="https://github.com/user-attachments/assets/aa250030-f863-4da8-931e-ef2cb5fb92c3" />
**各科權重分配**
依各科難易度，調整各科時間分配權重，將剩餘可用時間依比例分配到時間表
<img width="604" height="524" alt="image" src="https://github.com/user-attachments/assets/da0926ae-deda-4faf-91b1-3a07079f68b5" />
**各科細部複習內容**
可依預設比例在分配各科該花費幾小時做甚麼事情，也可手動調整
<img width="865" height="389" alt="image" src="https://github.com/user-attachments/assets/a0f6fa6b-5c49-4ef8-aca7-4fc31e50d6c6" />
**心情管理器**
依照考試密集程度以及歷史數據預測當天壓力程度(也可手動調整)，系統可以自動將複習進度排的鬆一點，並且把首頁顯示笑話當成給自己的小彩蛋
<img width="865" height="535" alt="image" src="https://github.com/user-attachments/assets/2f4a450b-61ee-4222-a5f3-a36b47b349e0" />


## 技術棧
* **前端框架**：React.js
* **建構工具**：Vite
* **樣式設計**：CSS
* **狀態管理**：ReactContext

## 專案結構
```
src/
├── components/   # 可重複使用的UI組件
├── config/       # 應用程式環境與全域設定
├── context/      # 全域狀態管理
├── data/         # 靜態資料或預設教學大綱格式
├── hooks/        # 自定義ReactHooks
├── pages/        # 應用程式主要頁面
├── utils/        # 共用的輔助函式庫
├── App.jsx       # 應用程式根組件
└── main.jsx      # 程式進入點
```

## 快速開始
環境要求
確保您的電腦已安裝Node.js。

安裝與執行
請在終端機執行以下指令：
```
# 複製專案到本機
git clone [https://github.com/huang101007/Personal-Time-Manager.git](https://github.com/huang101007/Personal-Time-Manager.git)

# 進入專案目錄
cd Personal-Time-Manager

# 安裝依賴套件
npm install

# 啟動本地開發伺服器
npm run dev
```
