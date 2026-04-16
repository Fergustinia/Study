using System;
using System.Drawing;
using System.Windows.Forms;

namespace lab3__1d_cellular_machine_
{
    public partial class Form1 : Form
    {
        private enum CellState
        {
            Empty,
            Tree,
            Burning
        }

        private enum WindDirection
        {
            None,
            North,
            South,
            West,
            East
        }

        private readonly Random random = new Random();

        private CellState[,] grid;
        private Timer simulationTimer;
        private int stepNumber = 0;

        private Panel controlPanel;
        private PictureBox pictureBoxField;

        private NumericUpDown numRows;
        private NumericUpDown numCols;
        private NumericUpDown numDensity;
        private NumericUpDown numHumidity;
        private NumericUpDown numTemperature;
        private NumericUpDown numInterval;
        private ComboBox cmbWind;

        private Button btnGenerate;
        private Button btnStep;
        private Button btnStart;
        private Button btnStop;

        private Label lblInfo;
        private Label lblLegend;

        public Form1()
        {
            InitializeComponent();
            BuildInterface();

            simulationTimer = new Timer();
            simulationTimer.Interval = 150;
            simulationTimer.Tick += SimulationTimer_Tick;

            CreateForest();
        }

        private void BuildInterface()
        {
            controlPanel = new Panel
            {
                Dock = DockStyle.Left,
                Width = 300,
                BackColor = Color.FromArgb(245, 245, 245),
                Padding = new Padding(10)
            };

            pictureBoxField = new PictureBox
            {
                Dock = DockStyle.Fill,
                BackColor = Color.White,
                BorderStyle = BorderStyle.FixedSingle
            };
            pictureBoxField.Resize += (s, e) => DrawForest();

            Controls.Add(pictureBoxField);
            Controls.Add(controlPanel);

            int y = 10;

            AddTitle("Параметры сетки", ref y);

            numRows = AddNumeric("Строк:", 20, 200, 60, ref y);
            numCols = AddNumeric("Столбцов:", 20, 200, 90, ref y);
            numDensity = AddNumeric("Плотность леса (%):", 1, 100, 70, ref y);

            AddTitle("3 доп. правила", ref y);

            cmbWind = AddCombo("Ветер:", ref y,
                new[] { "Нет", "Север", "Юг", "Запад", "Восток" }, 0);

            numTemperature = AddNumeric("Температура (%):", 0, 100, 30, ref y);
            numHumidity = AddNumeric("Влажность (%):", 0, 100, 20, ref y);

            AddTitle("Управление", ref y);

            numInterval = AddNumeric("Интервал (мс):", 20, 2000, 150, ref y);

            btnGenerate = AddButton("Сгенерировать лес", ref y);
            btnGenerate.Click += (s, e) =>
            {
                StopSimulation();
                CreateForest();
            };

            btnStep = AddButton("1 шаг", ref y);
            btnStep.Click += (s, e) => SimulateStep();

            btnStart = AddButton("Старт", ref y);
            btnStart.Click += (s, e) =>
            {
                simulationTimer.Interval = (int)numInterval.Value;
                simulationTimer.Start();
            };

            btnStop = AddButton("Стоп", ref y);
            btnStop.Click += (s, e) => StopSimulation();

            lblInfo = new Label
            {
                Left = 10,
                Top = y + 10,
                Width = 260,
                Height = 140,
                BorderStyle = BorderStyle.FixedSingle,
                BackColor = Color.White,
                Font = new Font("Segoe UI", 9F)
            };
            controlPanel.Controls.Add(lblInfo);

            y += 155;

            lblLegend = new Label
            {
                Left = 10,
                Top = y,
                Width = 260,
                Height = 160,
                BorderStyle = BorderStyle.FixedSingle,
                BackColor = Color.White,
                Font = new Font("Segoe UI", 9F),
                Text =
                    "Легенда:\r\n" +
                    "Белый — пустая клетка\r\n" +
                    "Зелёный — дерево\r\n" +
                    "Красный — горящая клетка\r\n\r\n" +
                    "Основные правила:\r\n" +
                    "1) Центр поджигается при создании леса\r\n" +
                    "2) Дерево загорается от горящих соседей\r\n" +
                    "3) Горящая клетка становится пустой\r\n\r\n" +
                    "Доп. правила:\r\n" +
                    "ветер, температура, влажность"
            };
            controlPanel.Controls.Add(lblLegend);
        }

        private void AddTitle(string text, ref int y)
        {
            Label label = new Label
            {
                Left = 10,
                Top = y,
                Width = 260,
                Height = 25,
                Text = text,
                Font = new Font("Segoe UI", 10F, FontStyle.Bold)
            };

            controlPanel.Controls.Add(label);
            y += 30;
        }

        private NumericUpDown AddNumeric(
            string text,
            decimal min,
            decimal max,
            decimal value,
            ref int y)
        {
            Label label = new Label
            {
                Left = 10,
                Top = y + 5,
                Width = 165,
                Height = 23,
                Text = text,
                Font = new Font("Segoe UI", 9F)
            };
            controlPanel.Controls.Add(label);

            NumericUpDown numeric = new NumericUpDown
            {
                Left = 180,
                Top = y,
                Width = 90,
                Minimum = min,
                Maximum = max,
                Value = value,
                DecimalPlaces = 0,
                Increment = 1,
                Font = new Font("Segoe UI", 9F)
            };
            controlPanel.Controls.Add(numeric);

            y += 35;
            return numeric;
        }

        private ComboBox AddCombo(string text, ref int y, string[] items, int selectedIndex)
        {
            Label label = new Label
            {
                Left = 10,
                Top = y + 5,
                Width = 165,
                Height = 23,
                Text = text,
                Font = new Font("Segoe UI", 9F)
            };
            controlPanel.Controls.Add(label);

            ComboBox combo = new ComboBox
            {
                Left = 180,
                Top = y,
                Width = 90,
                DropDownStyle = ComboBoxStyle.DropDownList,
                Font = new Font("Segoe UI", 9F)
            };

            combo.Items.AddRange(items);
            combo.SelectedIndex = selectedIndex;

            controlPanel.Controls.Add(combo);

            y += 35;
            return combo;
        }

        private Button AddButton(string text, ref int y)
        {
            Button button = new Button
            {
                Left = 10,
                Top = y,
                Width = 260,
                Height = 34,
                Text = text,
                Font = new Font("Segoe UI", 9F)
            };

            controlPanel.Controls.Add(button);
            y += 40;
            return button;
        }

        private void SimulationTimer_Tick(object sender, EventArgs e)
        {
            SimulateStep();
        }

        private void StopSimulation()
        {
            simulationTimer.Stop();
        }

        private void CreateForest()
        {
            int rows = (int)numRows.Value;
            int cols = (int)numCols.Value;
            double density = (double)numDensity.Value / 100.0;

            grid = new CellState[rows, cols];
            stepNumber = 0;

            for (int r = 0; r < rows; r++)
            {
                for (int c = 0; c < cols; c++)
                {
                    grid[r, c] = random.NextDouble() < density
                        ? CellState.Tree
                        : CellState.Empty;
                }
            }

            IgniteCenter();
            DrawForest();
            UpdateInfo();
        }

        private void IgniteCenter()
        {
            if (grid == null)
                return;

            int rows = grid.GetLength(0);
            int cols = grid.GetLength(1);

            int centerRow = rows / 2;
            int centerCol = cols / 2;

            if (grid[centerRow, centerCol] == CellState.Empty)
            {
                grid[centerRow, centerCol] = CellState.Tree;
            }

            grid[centerRow, centerCol] = CellState.Burning;
        }

        private void SimulateStep()
        {
            if (grid == null)
                return;

            int rows = grid.GetLength(0);
            int cols = grid.GetLength(1);

            CellState[,] next = new CellState[rows, cols];

            double humidity = (double)numHumidity.Value / 100.0;
            double temperature = (double)numTemperature.Value / 100.0;
            WindDirection wind = (WindDirection)cmbWind.SelectedIndex;

            for (int r = 0; r < rows; r++)
            {
                for (int c = 0; c < cols; c++)
                {
                    CellState current = grid[r, c];

                    switch (current)
                    {
                        case CellState.Empty:
                            next[r, c] = CellState.Empty;
                            break;

                        case CellState.Burning:
                            next[r, c] = CellState.Empty;
                            break;

                        case CellState.Tree:
                            int burningNeighbors = CountBurningNeighbors(r, c);

                            if (burningNeighbors == 0)
                            {
                                next[r, c] = CellState.Tree;
                                break;
                            }

                            double spreadChance = 0.30 + 0.12 * burningNeighbors;

                            spreadChance += 0.25 * temperature;
                            spreadChance -= 0.35 * humidity;
                            spreadChance += GetWindBonus(r, c, wind);

                            spreadChance = Clamp01(spreadChance);

                            bool ignite = random.NextDouble() < spreadChance;

                            next[r, c] = ignite
                                ? CellState.Burning
                                : CellState.Tree;
                            break;
                    }
                }
            }

            grid = next;
            stepNumber++;

            DrawForest();
            UpdateInfo();
        }

        private int CountBurningNeighbors(int row, int col)//
        {
            int count = 0;

            for (int dr = -1; dr <= 1; dr++)
            {
                for (int dc = -1; dc <= 1; dc++)
                {
                    if (dr == 0 && dc == 0)//Проверяет, не является ли рассматриваемая клетка самой собой.
                        continue;

                    int nr = row + dr;//Соседняя строчка
                    int nc = col + dc;//Номер соседнего столбца

                    if (nr >= 0 && nr < grid.GetLength(0) &&
                        nc >= 0 && nc < grid.GetLength(1) &&
                        grid[nr, nc] == CellState.Burning)
                    {
                        count++;
                    }
                }
            }

            return count;
        }

        private double GetWindBonus(int row, int col, WindDirection wind)
        {
            if (wind == WindDirection.None)
                return 0.0;

            switch (wind)
            {
                case WindDirection.East:
                    if (IsBurning(row, col - 1) ||
                        IsBurning(row - 1, col - 1) ||
                        IsBurning(row + 1, col - 1))
                    {
                        return 0.20;
                    }
                    break;

                case WindDirection.West:
                    if (IsBurning(row, col + 1) ||
                        IsBurning(row - 1, col + 1) ||
                        IsBurning(row + 1, col + 1))
                    {
                        return 0.20;
                    }
                    break;

                case WindDirection.South:
                    if (IsBurning(row - 1, col) ||
                        IsBurning(row - 1, col - 1) ||
                        IsBurning(row - 1, col + 1))
                    {
                        return 0.20;
                    }
                    break;

                case WindDirection.North:
                    if (IsBurning(row + 1, col) ||
                        IsBurning(row + 1, col - 1) ||
                        IsBurning(row + 1, col + 1))
                    {
                        return 0.20;
                    }
                    break;
            }

            return 0.0;
        }

        private bool IsBurning(int row, int col)
        {
            if (row < 0 || row >= grid.GetLength(0) || col < 0 || col >= grid.GetLength(1))
                return false;

            return grid[row, col] == CellState.Burning; 
        }

        private void DrawForest()
        {
            if (grid == null || pictureBoxField.Width <= 0 || pictureBoxField.Height <= 0)
                return;

            Bitmap bmp = new Bitmap(pictureBoxField.Width, pictureBoxField.Height);

            using (Graphics g = Graphics.FromImage(bmp))
            {
                g.Clear(Color.White);

                int rows = grid.GetLength(0);
                int cols = grid.GetLength(1);

                float cellWidth = (float)pictureBoxField.Width / cols;
                float cellHeight = (float)pictureBoxField.Height / rows;

                for (int r = 0; r < rows; r++)
                {
                    for (int c = 0; c < cols; c++)
                    {
                        Brush brush = GetBrush(grid[r, c]);

                        float x = c * cellWidth;
                        float y = r * cellHeight;

                        g.FillRectangle(brush, x, y, cellWidth + 1, cellHeight + 1);
                    }
                }

                if (rows <= 80 && cols <= 80)
                {
                    using (Pen pen = new Pen(Color.LightGray, 1))
                    {
                        for (int r = 0; r <= rows; r++)
                        {
                            float y = r * cellHeight;
                            g.DrawLine(pen, 0, y, pictureBoxField.Width, y);
                        }

                        for (int c = 0; c <= cols; c++)
                        {
                            float x = c * cellWidth;
                            g.DrawLine(pen, x, 0, x, pictureBoxField.Height);
                        }
                    }
                }
            }

            Image oldImage = pictureBoxField.Image;
            pictureBoxField.Image = bmp;
            oldImage?.Dispose();
        }

        private Brush GetBrush(CellState state)
        {
            switch (state)
            {
                case CellState.Empty:
                    return Brushes.WhiteSmoke;
                case CellState.Tree:
                    return Brushes.ForestGreen;
                case CellState.Burning:
                    return Brushes.OrangeRed;
                default:
                    return Brushes.White;
            }
        }

        private void UpdateInfo()
        {
            if (grid == null)
                return;

            int empty = 0;
            int trees = 0;
            int burning = 0;

            int rows = grid.GetLength(0);
            int cols = grid.GetLength(1);

            for (int r = 0; r < rows; r++)
            {
                for (int c = 0; c < cols; c++)
                {
                    switch (grid[r, c])
                    {
                        case CellState.Empty:
                            empty++;
                            break;
                        case CellState.Tree:
                            trees++;
                            break;
                        case CellState.Burning:
                            burning++;
                            break;
                    }
                }
            }

            lblInfo.Text =
                $"Шаг: {stepNumber}\r\n" +
                $"Пустых клеток: {empty}\r\n" +
                $"Деревьев: {trees}\r\n" +
                $"Горящих: {burning}\r\n\r\n" +
                $"Доп. правила:\r\n" +
                $"1) Ветер\r\n" +
                $"2) Температура\r\n" +
                $"3) Влажность";
        }

        private double Clamp01(double value)
        {
            if (value < 0.0) return 0.0;
            if (value > 1.0) return 1.0;
            return value;
        }

        protected override void OnFormClosing(FormClosingEventArgs  e)
        {
            simulationTimer?.Stop();

            if (pictureBoxField?.Image != null)
            {
                pictureBoxField.Image.Dispose();
            }

            base.OnFormClosing(e);
        }
    }
}