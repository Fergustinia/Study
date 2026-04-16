using System;
using System.Diagnostics;
using System.Drawing;
using System.Windows.Forms;
using System.Windows.Forms.DataVisualization.Charting;

namespace HeatEquationFiniteDifference
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            InitializeTable();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
        }

        private void InitializeTable()
        {
            dgvResults.Columns.Clear();
            dgvResults.Rows.Clear();

            dgvResults.Columns.Add("dt_dx", "Шаг по времени, с \\ Шаг по пространству, м");
            dgvResults.Columns.Add("dx_01", "0.1");
            dgvResults.Columns.Add("dx_001", "0.01");
            dgvResults.Columns.Add("dx_0001", "0.001");
            dgvResults.Columns.Add("dx_00001", "0.0001");

            dgvResults.Rows.Add("0.1");
            dgvResults.Rows.Add("0.01");
            dgvResults.Rows.Add("0.001");
            dgvResults.Rows.Add("0.0001");

            dgvResults.AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill;
            dgvResults.AutoSizeRowsMode = DataGridViewAutoSizeRowsMode.AllCells;
            dgvResults.DefaultCellStyle.WrapMode = DataGridViewTriState.True;
            dgvResults.DefaultCellStyle.Alignment = DataGridViewContentAlignment.MiddleCenter;
            dgvResults.ColumnHeadersDefaultCellStyle.Alignment = DataGridViewContentAlignment.MiddleCenter;

            dgvResults.RowHeadersVisible = false;
            dgvResults.AllowUserToAddRows = false;
            dgvResults.AllowUserToDeleteRows = false;
            dgvResults.AllowUserToResizeRows = false;
            dgvResults.ReadOnly = true;
        }

        private void btnRun_Click(object sender, EventArgs e)
        {
            try
            {
                double length = ParseDouble(txtLength.Text);
                double alpha = ParseDouble(txtAlpha.Text);
                double initialTemp = ParseDouble(txtInitialTemp.Text);
                double leftTemp = ParseDouble(txtLeftTemp.Text);
                double rightTemp = ParseDouble(txtRightTemp.Text);
                double totalTime = ParseDouble(txtTotalTime.Text);
                double dt = ParseDouble(txtDt.Text);
                double dx = ParseDouble(txtDx.Text);

                SimulationResult singleResult = SolveHeatEquationImplicit(
                    length,
                    alpha,
                    initialTemp,
                    leftTemp,
                    rightTemp,
                    totalTime,
                    dt,
                    dx);

                DrawChart(singleResult.X, singleResult.Temperature);
                ShowSingleResult(singleResult, totalTime, dt, dx);

                FillComparisonTable(
                    length,
                    alpha,
                    initialTemp,
                    leftTemp,
                    rightTemp);

                lblInfo.Text = "Расчёт выполнен. Использована неявная схема и метод прогонки.";
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    "Ошибка при расчёте:\n" + ex.Message,
                    "Ошибка",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error);
            }
        }

        private void FillComparisonTable(
            double length,
            double alpha,
            double initialTemp,
            double leftTemp,
            double rightTemp)
        {
            double totalTime = 2.0;

            double[] dtValues = { 0.1, 0.01, 0.001, 0.0001 };
            double[] dxValues = { 0.1, 0.01, 0.001, 0.0001 };

            dgvResults.Rows.Clear();

            for (int i = 0; i < dtValues.Length; i++)
            {
                int rowIndex = dgvResults.Rows.Add(dtValues[i].ToString());

                for (int j = 0; j < dxValues.Length; j++)
                {
                    SimulationResult result = SolveHeatEquationImplicit(
                        length,
                        alpha,
                        initialTemp,
                        leftTemp,
                        rightTemp,
                        totalTime,
                        dtValues[i],
                        dxValues[j]);

                    DataGridViewCell cell = dgvResults.Rows[rowIndex].Cells[j + 1];

                    cell.Value =
                        $"T = {result.CenterTemperature:F4} °C{Environment.NewLine}" +
                        $"t = {result.ElapsedMilliseconds} мс";

                    cell.Style.BackColor = Color.Honeydew;
                    cell.Style.ForeColor = Color.DarkGreen;
                }
            }
        }

        private void ShowSingleResult(SimulationResult result, double totalTime, double dt, double dx)
        {
            txtOutput.Clear();

            txtOutput.AppendText("Результаты моделирования\r\n");
            txtOutput.AppendText("--------------------------------------------------\r\n");
            txtOutput.AppendText("Схема: неявная\r\n");
            txtOutput.AppendText("Метод решения: прогонка\r\n");
            txtOutput.AppendText($"Длина пластины: {result.Length:F6} м\r\n");
            txtOutput.AppendText($"Введённый шаг по времени dt: {dt}\r\n");
            txtOutput.AppendText($"Введённый шаг по пространству dx: {dx}\r\n");
            txtOutput.AppendText($"Фактический шаг сетки h: {result.AdjustedDx:F6}\r\n");
            txtOutput.AppendText($"Количество узлов: {result.NodeCount}\r\n");
            txtOutput.AppendText($"Количество шагов по времени: {result.TimeSteps}\r\n");
            txtOutput.AppendText($"Модельное время: {totalTime:F4} с\r\n");
            txtOutput.AppendText($"sigma = alpha * dt / h^2 = {result.R:F6}\r\n");
            txtOutput.AppendText($"Температура в центральной точке: {result.CenterTemperature:F6} °C\r\n");
            txtOutput.AppendText($"Реальное время расчёта: {result.ElapsedMilliseconds} мс\r\n");
        }

        private void DrawChart(double[] x, double[] temperature)
        {
            chartTemperature.Series.Clear();
            chartTemperature.ChartAreas.Clear();

            ChartArea area = new ChartArea("MainArea");
            area.AxisX.Title = "Координата x, м";
            area.AxisY.Title = "Температура, °C";
            area.AxisX.MajorGrid.LineColor = Color.LightGray;
            area.AxisY.MajorGrid.LineColor = Color.LightGray;

            chartTemperature.ChartAreas.Add(area);

            Series series = new Series("Температура")
            {
                ChartType = SeriesChartType.Line,
                BorderWidth = 3
            };

            for (int i = 0; i < x.Length; i++)
            {
                series.Points.AddXY(x[i], temperature[i]);
            }

            chartTemperature.Series.Add(series);
        }

        private SimulationResult SolveHeatEquationImplicit(
            double length,
            double alpha,  
            double initialTemp,
            double leftTemp,
            double rightTemp,
            double totalTime,
            double dt,
            double dx)
        {
            if (length <= 0)
                throw new ArgumentException("Длина пластины должна быть больше 0.");

            if (alpha <= 0)
                throw new ArgumentException("Коэффициент температуропроводности должен быть больше 0.");

            if (totalTime < 0)
                throw new ArgumentException("Модельное время не может быть отрицательным.");

            if (dt <= 0 || dx <= 0)
                throw new ArgumentException("Шаги dt и dx должны быть больше 0.");

            int n = (int)Math.Round(length / dx) + 1;
            if (n < 3)
                throw new ArgumentException("Слишком крупный шаг по пространству. Нужно минимум 3 узла.");

            double h = length / (n - 1); //фактический шаг сетки
            int steps = (int)Math.Round(totalTime / dt);//количество временных шагов

            double sigma = alpha * dt / (h * h);//коэффициент схемы

            double[] x = new double[n]; //Массив координат(узлы по толщине пластины)
            for (int i = 0; i < n; i++)
                x[i] = i * h;

            double[] current = new double[n];//Температура  
            double[] next = new double[n];

            for (int i = 0; i < n; i++) 
                current[i] = initialTemp;

            current[0] = leftTemp; //сначала во всех точках температура одинаковая
            current[n - 1] = rightTemp;

            Stopwatch sw = Stopwatch.StartNew();

            

            double A = alpha / (h * h);
            double B = 2.0 * alpha / (h * h) + 1.0 / dt;
            double C = alpha / (h * h);

            for (int step = 0; step < steps; step++) //на каждом шаге решается новая система для следующего временного слоя.
            {
                next[0] = leftTemp; 
                next[n - 1] = rightTemp;

                int m = n - 2; // количество внутренних узлов

                if (m > 0) 
                {
                    
                    double[] sweepAlpha = new double[m + 1];//Коэффициенты прогонки
                    double[] sweepBeta = new double[m + 1];//Правая часть прогонки


                    double F1 = -current[1] / dt; //Правая часть для первого внутреннего узла с учётом граничного условия на левом краю
                    sweepAlpha[1] = A / B;//Коэффициент для первого внутреннего узла
                    sweepBeta[1] = (C * leftTemp - F1) / B; //Правая часть для первого внутреннего узла с учётом граничного условия


                    for (int i = 2; i <= m; i++) //Прогонка для внутренних узлов от 2 до m
                    {
                        double Fi = -current[i] / dt; //Правая часть для i-го внутреннего узла с учётом температуры на предыдущем временном слое
                        double denominator = B - C * sweepAlpha[i - 1];//Знаменатель для i-го внутреннего узла с учётом коэффициента прогонки от предыдущего узла

                        sweepAlpha[i] = A / denominator;//Коэффициент для i-го внутреннего узла
                        sweepBeta[i] = (C * sweepBeta[i - 1] - Fi) / denominator;//Правая часть для i-го внутреннего узла
                    }

                 
                    next[m] = sweepAlpha[m] * rightTemp + sweepBeta[m]; //Температура в последнем внутреннем узле

                    for (int i = m - 1; i >= 1; i--) 
                    {
                        next[i] = sweepAlpha[i] * next[i + 1] + sweepBeta[i];
                    }
                }

                double[] temp = current;//Переход от шага n к шагу n+1
                current = next;
                next = temp;
            }

            sw.Stop();

            int centerIndex = n / 2;
            double centerTemperature = current[centerIndex];

            return new SimulationResult
            {
                X = x,
                Temperature = current,
                CenterTemperature = centerTemperature,
                NodeCount = n,
                TimeSteps = steps,
                R = sigma,
                ElapsedMilliseconds = sw.ElapsedMilliseconds,
                AdjustedDx = h,
                Length = length
            };
        }

        private double ParseDouble(string text)
        {
            if (!double.TryParse(
                    text.Replace(',', '.'),
                    System.Globalization.NumberStyles.Any,
                    System.Globalization.CultureInfo.InvariantCulture,
                    out double value))
            {
                throw new ArgumentException($"Не удалось преобразовать число: {text}");
            }

            return value;
        }
    }

    public class SimulationResult
    {
        public double[] X { get; set; }
        public double[] Temperature { get; set; }
        public double CenterTemperature { get; set; }
        public int NodeCount { get; set; }
        public int TimeSteps { get; set; }
        public double R { get; set; }
        public long ElapsedMilliseconds { get; set; }
        public double AdjustedDx { get; set; }
        public double Length { get; set; }
    }
}