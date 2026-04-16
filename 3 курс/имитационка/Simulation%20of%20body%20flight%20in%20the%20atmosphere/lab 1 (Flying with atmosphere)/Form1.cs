using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Globalization;
using System.Windows.Forms;
using System.Windows.Forms.DataVisualization.Charting;

namespace lab_1__Flying_with_atmosphere_
{
    public partial class Form1 : Form
    {
        private const double g = 9.81;
        private const double C = 0.15;
        private const double rho = 1.29;

        private readonly double[] timeSteps = { 1.0, 0.1, 0.01, 0.001, 0.0001 };
        private readonly Dictionary<double, SimulationResult> resultsByStep = new Dictionary<double, SimulationResult>();

        public Form1()
        {
            InitializeComponent();
            ConfigureChart();
            ConfigureTable();
            ConfigureStepSelector();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            inputSpeed.Text = "50";
            inputAngle.Text = "45";
            inputWeight.Text = "1";
            inputSize.Text = "0.01";
        }

       

        private void Button1_Click(object sender, EventArgs e)
        {
            if (!TryParseInput(inputSpeed.Text, out double speed) || speed <= 0)
            {
                MessageBox.Show("Введите корректную начальную скорость больше 0.");
                return;
            }

            if (!TryParseInput(inputAngle.Text, out double angle) || angle <= 0 || angle >= 90)
            {
                MessageBox.Show("Введите корректный угол броска в диапазоне от 0 до 90 градусов.");
                return;
            }

            if (!TryParseInput(inputSize.Text, out double size) || size <= 0)
            {
                MessageBox.Show("Введите корректный размер тела больше 0.");
                return;
            }

            if (!TryParseInput(inputWeight.Text, out double weight) || weight <= 0)
            {
                MessageBox.Show("Введите корректную массу тела больше 0.");
                return;
            }

            if (!TryGetSelectedTimeStep(out double dt))
            {
                MessageBox.Show("Выберите шаг моделирования из списка.");
                return;
            }

            SimulationResult result = SimulateTrajectory(speed, angle, size, weight, dt);

            resultsByStep[dt] = result;

            AddOrUpdateSeries(result);
            UpdateAxesFromAllResults();
            UpdateResultsTable();
        }

        private void ConfigureChart()//Настройка графика    
        {
            chart1.Series.Clear();

            if (chart1.ChartAreas.Count == 0)
                chart1.ChartAreas.Add(new ChartArea("ChartArea1"));

            if (chart1.Legends.Count == 0)
                chart1.Legends.Add(new Legend("Legend1"));

            ChartArea area = chart1.ChartAreas[0];
            area.AxisX.Title = "Дальность, м";
            area.AxisY.Title = "Высота, м";
            area.AxisX.Minimum = 0;
            area.AxisY.Minimum = 0;
            area.AxisX.MajorGrid.LineDashStyle = ChartDashStyle.Dash;
            area.AxisY.MajorGrid.LineDashStyle = ChartDashStyle.Dash;
        }

        private void ConfigureTable()
        {
            ResultsDataGrid.AutoGenerateColumns = true;
            ResultsDataGrid.AllowUserToAddRows = false;
            ResultsDataGrid.AllowUserToDeleteRows = false;
            ResultsDataGrid.ReadOnly = true;
            ResultsDataGrid.RowHeadersVisible = false;
            ResultsDataGrid.SelectionMode = DataGridViewSelectionMode.FullRowSelect;
            ResultsDataGrid.MultiSelect = false;
            ResultsDataGrid.AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill;
            ResultsDataGrid.BackgroundColor = Color.White;
            ResultsDataGrid.DataSource = null;
        }

        private void ConfigureStepSelector()
        {
            inputStep.Items.Clear();

            foreach (double dt in timeSteps)
            {
                inputStep.Items.Add(dt.ToString("0.####", CultureInfo.InvariantCulture));
            }

            inputStep.SelectedIndex = 0;
        }

        private bool TryGetSelectedTimeStep(out double dt)
        {
            dt = 0;

            if (inputStep.SelectedItem == null)
                return false;

            string value = inputStep.SelectedItem.ToString();

            return double.TryParse(
                value,
                NumberStyles.Float,
                CultureInfo.InvariantCulture,
                out dt
            );
        }

        private void AddOrUpdateSeries(SimulationResult result)
        {
            string seriesName = GetSeriesName(result.TimeStep);

            if (!chart1.Series.IsUniqueName(seriesName))
            {
                chart1.Series.Remove(chart1.Series[seriesName]);
            }

            Series series = new Series(seriesName)
            {
                ChartType = SeriesChartType.Line,
                BorderWidth = 2,
                ChartArea = chart1.ChartAreas[0].Name,
                Legend = chart1.Legends[0].Name
            };

            foreach (TrajectoryPoint point in result.Points)
            {
                series.Points.AddXY(point.X, point.Y);
            }

            chart1.Series.Add(series);
        }

        private string GetSeriesName(double dt)
        {
            return $"dt = {dt:0.####}";
        }

        private void UpdateAxesFromAllResults()
        {
            ChartArea area = chart1.ChartAreas[0];

            if (resultsByStep.Count == 0)
            {
                area.AxisX.Minimum = 0;
                area.AxisX.Maximum = 10;
                area.AxisY.Minimum = 0;
                area.AxisY.Maximum = 10;
                area.AxisX.Interval = 1;
                area.AxisY.Interval = 1;
                return;
            }

            double maxX = 0.0;//Дальность броска
            double maxY = 0.0;//Высота броска

            foreach (SimulationResult result in resultsByStep.Values)
            {
                if (result.Distance > maxX)
                    maxX = result.Distance;

                if (result.MaxHeight > maxY)
                    maxY = result.MaxHeight;
            }

            double axisXMax = Math.Max(10.0, maxX * 1.1);
            double axisYMax = Math.Max(10.0, maxY * 1.1);

            area.AxisX.Minimum = 0;
            area.AxisX.Maximum = axisXMax;
            area.AxisY.Minimum = 0;
            area.AxisY.Maximum = axisYMax;
            area.AxisX.Interval = axisXMax / 10.0;
            area.AxisY.Interval = axisYMax / 10.0;
        }

        private void UpdateResultsTable()
        {
            DataTable table = new DataTable();

            table.Columns.Add("Показатель");

            foreach (double dt in timeSteps)
            {
                table.Columns.Add(dt.ToString("0.####", CultureInfo.InvariantCulture));
            }

            DataRow distanceRow = table.NewRow();
            distanceRow[0] = "Дальность полёта, м";

            DataRow heightRow = table.NewRow();
            heightRow[0] = "Максимальная высота, м";

            DataRow speedRow = table.NewRow();
            speedRow[0] = "Скорость в конечной точке, м/с";

            for (int i = 0; i < timeSteps.Length; i++)
            {
                double dt = timeSteps[i];

                if (resultsByStep.TryGetValue(dt, out SimulationResult result))
                {
                    distanceRow[i + 1] = result.Distance.ToString("F2", CultureInfo.InvariantCulture);
                    heightRow[i + 1] = result.MaxHeight.ToString("F2", CultureInfo.InvariantCulture);
                    speedRow[i + 1] = result.EndSpeed.ToString("F2", CultureInfo.InvariantCulture);
                }
                else
                {
                    distanceRow[i + 1] = "";
                    heightRow[i + 1] = "";
                    speedRow[i + 1] = "";
                }
            }

            table.Rows.Add(distanceRow);
            table.Rows.Add(heightRow);
            table.Rows.Add(speedRow);

            ResultsDataGrid.DataSource = null;
            ResultsDataGrid.DataSource = table;

            if (ResultsDataGrid.Columns.Count > 0)
            {
                ResultsDataGrid.Columns[0].Width = 230;
            }
        }

        private SimulationResult SimulateTrajectory(double speed, double angleDeg, double size, double weight, double dt)
        {
            double angleRad = angleDeg * Math.PI / 180.0;
            double k = 0.5 * C * rho * size / weight;//Коэффициент сопротивления воздуха

            State state = new State( 
                0.0,
                0.0,
                speed * Math.Cos(angleRad),
                speed * Math.Sin(angleRad)
            );

            State previousState = state;
            double maxHeight = state.Y;

            List<TrajectoryPoint> points = new List<TrajectoryPoint>
            {
                new TrajectoryPoint(state.X, state.Y)
            };

            const int maxIterations = 10_000_000;

            for (int i = 0; i < maxIterations; i++)
            {
                previousState = state;
                state = RungeKuttaStep(state, dt, k);

                if (state.Y > maxHeight)
                    maxHeight = state.Y;

                if (state.Y >= 0)
                {
                    points.Add(new TrajectoryPoint(state.X, state.Y));
                }
                else
                {
                    double alpha = previousState.Y / (previousState.Y - state.Y);

                    double hitX = previousState.X + (state.X - previousState.X) * alpha;
                    double hitVx = previousState.Vx + (state.Vx - previousState.Vx) * alpha;
                    double hitVy = previousState.Vy + (state.Vy - previousState.Vy) * alpha;
                    double hitSpeed = Math.Sqrt(hitVx * hitVx + hitVy * hitVy);

                    points.Add(new TrajectoryPoint(hitX, 0.0));

                    return new SimulationResult
                    {
                        TimeStep = dt,
                        Distance = hitX,
                        MaxHeight = maxHeight,
                        EndSpeed = hitSpeed,
                        Points = points
                    };
                }
            }

            double emergencySpeed = Math.Sqrt(state.Vx * state.Vx + state.Vy * state.Vy);

            return new SimulationResult
            {
                TimeStep = dt,
                Distance = state.X,
                MaxHeight = maxHeight,
                EndSpeed = emergencySpeed,
                Points = points
            };
        }

        private State RungeKuttaStep(State s, double dt, double k)
        {
            State k1 = Derivatives(s, k);
            State k2 = Derivatives(AddState(s, MultiplyState(k1, dt / 2.0)), k);// dt Шаг моделирования
            State k3 = Derivatives(AddState(s, MultiplyState(k2, dt / 2.0)), k);
            State k4 = Derivatives(AddState(s, MultiplyState(k3, dt)), k);

            State increment = MultiplyState(
                AddState( //вектор состояния
                    AddState(k1, MultiplyState(k2, 2.0)),
                    AddState(MultiplyState(k3, 2.0), k4)
                ),
                dt / 6.0
            );

            return AddState(s, increment);
        }

        private State Derivatives(State s, double k)
        {
            double v = Math.Sqrt(s.Vx * s.Vx + s.Vy * s.Vy);

            return new State(
                s.Vx,
                s.Vy,
                -k * s.Vx * v, 
                -g - k * s.Vy * v
            );
        }

        private State AddState(State a, State b)
        {
            return new State(
                a.X + b.X,
                a.Y + b.Y,
                a.Vx + b.Vx,
                a.Vy + b.Vy
            );
        }

        private State MultiplyState(State s, double factor)
        {
            return new State(
                s.X * factor,
                s.Y * factor,
                s.Vx * factor,
                s.Vy * factor
            );
        }

        private bool TryParseInput(string text, out double value)
        {
            string normalized = text.Trim().Replace(" ", "").Replace(',', '.');

            return double.TryParse(
                normalized,
                NumberStyles.Float,
                CultureInfo.InvariantCulture,
                out value
            );
        }

        private class TrajectoryPoint
        {
            public double X { get; }
            public double Y { get; }

            public TrajectoryPoint(double x, double y)
            {
                X = x;
                Y = y;
            }
        }

        private class SimulationResult
        {
            public double TimeStep { get; set; }
            public double Distance { get; set; }
            public double MaxHeight { get; set; }
            public double EndSpeed { get; set; }
            public List<TrajectoryPoint> Points { get; set; }
        }

        private struct State
        {
            public double X { get; }
            public double Y { get; }
            public double Vx { get; }
            public double Vy { get; }

            public State(double x, double y, double vx, double vy)
            {
                X = x;
                Y = y;
                Vx = vx;
                Vy = vy;
            }
        }
    }
}           