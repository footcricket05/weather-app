# 🌍 **Weather Trend Forecasting**

Welcome to the **Weather Trend Forecasting** project! This repository contains the code, data, and analysis for forecasting global weather trends using the **Global Weather Repository** dataset. 🌦️

---

## **🛠️ Project Overview**
This project showcases data science techniques to analyze and forecast weather trends worldwide. It includes:
- 🌟 Basic and advanced analyses of global weather data.
- 📊 Exploratory Data Analysis (EDA) to uncover trends and patterns.
- 📈 Time-series forecasting models to predict future weather conditions.
- 🔍 Advanced analyses like anomaly detection, feature importance, and spatial mapping.

---

## **📂 Folder Structure**
```plaintext
weather_forecasting_project/
├── data/
│   ├── raw/                  # Original datasets
│   │   └── naturalearth_lowres/  # Shapefiles for spatial analysis
│   └── processed/            # Cleaned and preprocessed datasets
├── notebooks/
│   ├── 01_data_cleaning.ipynb       # Data cleaning and preprocessing
│   ├── 02_basic_eda.ipynb           # Exploratory Data Analysis
│   ├── 03_forecasting_models.ipynb # Forecasting models
│   └── 04_advanced_analysis.ipynb  # Advanced analyses
├── src/                      # Python scripts for various tasks
├── visuals/
│   ├── plots/
│   │   └── geographical_weather_map.html  # Interactive map
│   └── charts/               # Saved visualizations
├── reports/
│   ├── presentation.pptx     # Final presentation
│   └── report.pdf            # Detailed project report
├── README.md                 # Project documentation
└── requirements.txt          # Python dependencies
```

---

## **📊 Key Features**
### **1. Basic Assessment**
- 🧹 **Data Cleaning**:
  - Handled missing values using mean and mode imputation.
  - Detected and managed outliers with Z-score.
  - Normalized numerical features for consistency.
- 🔍 **EDA**:
  - Visualized temperature and precipitation trends.
  - Analyzed correlations among weather parameters.
- 📈 **Forecasting Models**:
  - Built time-series forecasting using **FB Prophet**.
  - Evaluated models with metrics like MAE, MSE, and RMSE.

### **2. Advanced Assessment**
- 🚨 **Anomaly Detection**:
  - Identified extreme weather conditions using Z-score analysis.
- 🧠 **Ensemble Models**:
  - Combined ARIMA and XGBoost for improved forecast accuracy.
- 🌟 **Feature Importance**:
  - Used SHAP to interpret key contributors to temperature predictions.
- 🗺️ **Spatial Analysis**:
  - Created an interactive map using **GeoPandas** and **Folium** to visualize geographical weather patterns.

---

## **📋 Key Insights**
1. 🌡️ Temperature trends show significant seasonal variations globally.
2. 🌧️ High humidity and low wind speeds strongly correlate with temperature increases.
3. ❄️ Temperature anomalies were detected in polar and tropical regions, indicating extreme weather events.

---

## **🚀 How to Run the Project**
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/footcricket05/weather-app.git
   cd "SWE - AIML Role" # Or the respective folder
   ```
2. **Set Up the Environment**:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   pip install -r requirements.txt
   ```
3. **Run Notebooks**:
   - Open the notebooks in the `notebooks/` folder using Jupyter or any IDE.
4. **Explore the Interactive Map**:
   - Open the HTML file:
     ```
     C:\Users\SHAURYA\Downloads\weather-app\Data Scientist Role\weather_forecasting_project\visuals\plots\geographical_weather_map.html
     ```

---

## **📂 Deliverables**
- 📜 **Report**: Detailed analysis available in `reports/report.pdf`.
- 🎥 **Presentation**: Slides summarizing findings in `reports/presentation.pptx`.
- 🌍 **Interactive Map**: Visualizes global temperature data in:
  ```
  C:\Users\SHAURYA\Downloads\weather-app\Data Scientist Role\weather_forecasting_project\visuals\plots\geographical_weather_map.html
  ```

---

## **📦 Dependencies**
- Python 3.10+
- Key libraries:
  - `pandas`, `numpy`, `matplotlib`, `seaborn`, `folium`
  - `geopandas`, `shap`, `xgboost`, `prophet`

Install dependencies with:
```bash
pip install -r requirements.txt
```

---

## **📧 Contact**
For questions or feedback, feel free to reach out:
- **GitHub**: [@footcricket05](https://github.com/footcricket05)

---

Enjoy exploring global weather trends! 🌤️🌎✨
