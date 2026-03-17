using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;

namespace FlightSimulation
{
    public partial class Form1 : Form
    {
        const double g = 9.81;
        const double m = 1.0;
        const double Cd = 0.47;
        const double rho = 1.225;
        const double S = 0.01;

        double k;

        List<Result> results = new List<Result>();

        public Form1()
        {
            InitializeComponent();
            k = Cd * rho * S / 2;
        }

        struct Result
        {
            public double step;
            public double range;
            public double height;
            public double finalSpeed;
            public List<PointF> trajectory;
        }

        Result Simulate(double dt)
        {
            double x = 0;
            double y = 0;

            double v0 = 100;
            double angle = 45 * Math.PI / 180;

            double vx = v0 * Math.Cos(angle);
            double vy = v0 * Math.Sin(angle);

            double maxHeight = 0;

            List<PointF> points = new List<PointF>();
            points.Add(new PointF((float)x, (float)y));

            while (y >= 0)
            {
                double v = Math.Sqrt(vx * vx + vy * vy);

                double ax = -(k / m) * v * vx;
                double ay = -g - (k / m) * v * vy;

                vx += ax * dt;
                vy += ay * dt;

                x += vx * dt;
                y += vy * dt;

                if (y > maxHeight)
                    maxHeight = y;

                points.Add(new PointF((float)x, (float)y));
            }

            double finalSpeed = Math.Sqrt(vx * vx + vy * vy);

            return new Result
            {
                step = dt,
                range = x,
                height = maxHeight,
                finalSpeed = finalSpeed,
                trajectory = points
            };
        }

        private void buttonRun_Click(object sender, EventArgs e)
        {
            double dt;

            if (!double.TryParse(textStep.Text.Replace(",", "."),
                System.Globalization.NumberStyles.Any,
                System.Globalization.CultureInfo.InvariantCulture,
                out dt))
            {
                MessageBox.Show("¬ведите корректное число");
                return;
            }

            // ќграничение шага
            if (dt > 1 || dt < 0.0001)
            {
                MessageBox.Show("Ўаг должен быть в диапазоне от 0.0001 до 1");
                return;
            }

            var r = Simulate(dt);
            results.Add(r);

            AddToTable(r);

            panelDraw.Invalidate();
        }

        void AddToTable(Result r)
        {
            table.Rows.Add(
                r.step,
                Math.Round(r.range, 2),
                Math.Round(r.height, 2),
                Math.Round(r.finalSpeed, 2)
            );
        }

        private void panelDraw_Paint(object sender, PaintEventArgs e)
        {
            if (results.Count == 0)
                return;

            Graphics g = e.Graphics;

            Color[] colors =
            {
                Color.Red,
                Color.Blue,
                Color.Green,
                Color.Purple,
                Color.Orange,
                Color.Brown,
                Color.Black
            };

            float scale = 3;

            for (int j = 0; j < results.Count; j++)
            {
                Pen pen = new Pen(colors[j % colors.Length], 2);

                var traj = results[j].trajectory;

                for (int i = 1; i < traj.Count; i++)
                {
                    float x1 = traj[i - 1].X * scale;
                    float y1 = panelDraw.Height - traj[i - 1].Y * scale;

                    float x2 = traj[i].X * scale;
                    float y2 = panelDraw.Height - traj[i].Y * scale;

                    g.DrawLine(pen, x1, y1, x2, y2);
                }
            }
        }
    }
}