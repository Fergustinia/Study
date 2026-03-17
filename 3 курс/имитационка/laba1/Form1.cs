using System.Globalization;
using System.Windows.Forms;
using System.Windows.Forms.DataVisualization.Charting;

namespace FlightSimulation;

public partial class Form1 : Form
{
    private const double G = 9.81;

    public Form1()
    {
        InitializeComponent();
        InitChart();
        InitGrid();
    }

    private void InitChart()
    {
        chart1.Series.Clear();
        chart1.ChartAreas[0].AxisX.Minimum = 0;
        chart1.ChartAreas[0].AxisY.Minimum = 0;
        chart1.ChartAreas[0].AxisX.Maximum = 100;
        chart1.ChartAreas[0].AxisY.Maximum = 20;
        chart1.ChartAreas[0].AxisX.Title = "x, м";
        chart1.ChartAreas[0].AxisY.Title = "y, м";
    }

    private void InitGrid()
    {
        resultsGrid.AutoGenerateColumns = false;
        resultsGrid.Columns.Clear();

        resultsGrid.Columns.Add(new DataGridViewTextBoxColumn
        {
            HeaderText = "Шаг dt, c",
            Width = 80
        });
        resultsGrid.Columns.Add(new DataGridViewTextBoxColumn
        {
            HeaderText = "Дальность, м",
            Width = 120
        });
        resultsGrid.Columns.Add(new DataGridViewTextBoxColumn
        {
            HeaderText = "Макс. высота, м",
            Width = 130
        });
        resultsGrid.Columns.Add(new DataGridViewTextBoxColumn
        {
            HeaderText = "Скорость в конце, м/с",
            Width = 150
        });
    }

    private void btLaunch_Click(object sender, EventArgs e)
    {
        var v0 = (double)inputSpeed.Value;
        var angleDeg = (double)inputAngle.Value;
        var y0 = (double)inputHeight.Value;
        var dt = (double)inputStep.Value / 1000.0;

        var angleRad = angleDeg * Math.PI / 180.0;

        var result = SimulateFlight(v0, angleRad, y0, dt);

        var series = new Series($"dt={dt.ToString("0.###", CultureInfo.InvariantCulture)}")
        {
            ChartType = SeriesChartType.Line
        };

        foreach (var p in result.Trajectory)
        {
            series.Points.AddXY(p.X, p.Y);
        }

        chart1.Series.Add(series);

        resultsGrid.Rows.Add(
            dt.ToString("0.###", CultureInfo.InvariantCulture),
            result.Range.ToString("F3", CultureInfo.InvariantCulture),
            result.MaxHeight.ToString("F3", CultureInfo.InvariantCulture),
            result.FinalSpeed.ToString("F3", CultureInfo.InvariantCulture));
    }

    private sealed class SimulationResult
    {
        public double Range { get; init; }
        public double MaxHeight { get; init; }
        public double FinalSpeed { get; init; }
        public List<(double X, double Y)> Trajectory { get; init; } = new();
    }

    private static SimulationResult SimulateFlight(double v0, double angleRad, double y0, double dt)
    {
        const double x0 = 0.0;
        var cosa = Math.Cos(angleRad);
        var sina = Math.Sin(angleRad);

        double t = 0.0;
        var x = x0;
        var y = y0;
        var maxHeight = y0;

        var trajectory = new List<(double X, double Y)> { (x, y) };

        while (true)
        {
            t += dt;
            x = x0 + v0 * cosa * t;
            y = y0 + v0 * sina * t - G * t * t / 2.0;

            if (y > maxHeight)
            {
                maxHeight = y;
            }

            if (y < 0.0)
            {
                break;
            }

            trajectory.Add((x, y));
        }

        var vx = v0 * cosa;
        var vy = v0 * sina - G * t;
        var finalSpeed = Math.Sqrt(vx * vx + vy * vy);

        return new SimulationResult
        {
            Range = x,
            MaxHeight = maxHeight,
            FinalSpeed = finalSpeed,
            Trajectory = trajectory
        };
    }
}

