using System;
using System.Windows.Forms;

namespace HeatEquationApp
{
    public partial class Form1 : Form
    {
        const double L = 1.0;

        const double T_left = 20;
        const double T_right = 100;

        const double lambda = 1;
        const double rho = 1;
        const double c = 1;

        const double modelTime = 2.0;

        double[] steps = { 0.1, 0.01, 0.001, 0.0001 };

       

        private void CreateTable()
        {
            table.Columns.Clear();
            table.Rows.Clear();

            table.Columns.Add("dt", "Шаг по времени \\ Шаг по пространству");
            table.Columns.Add("dx1", "0.1");
            table.Columns.Add("dx2", "0.01");
            table.Columns.Add("dx3", "0.001");
            table.Columns.Add("dx4", "0.0001");

            table.Rows.Add("0.1");
            table.Rows.Add("0.01");
            table.Rows.Add("0.001");
            table.Rows.Add("0.0001");
        }
        public Form1()
        {
            InitializeComponent();
            CreateTable();
        }

        private void btnCalculate_Click(object sender, EventArgs e)
        {
            double[] steps = { 0.1, 0.01, 0.001, 0.0001 };

            for (int i = 0; i < steps.Length; i++)
            {
                for (int j = 0; j < steps.Length; j++)
                {
                    double dt = steps[i];
                    double dx = steps[j];

                    double result = Solve(dt, dx);

                    table.Rows[i].Cells[j + 1].Value = result.ToString("F4");
                }
            }
        }

        private double Solve(double dt, double dx)
        {
            int Nx = (int)(L / dx);
            int Nt = (int)(modelTime / dt);

            double alpha = lambda / (rho * c);
            double r = alpha * dt / (dx * dx);

            double[] T = new double[Nx + 1];
            double[] Tnew = new double[Nx + 1];

            for (int i = 0; i <= Nx; i++)
                T[i] = 20;

            T[0] = T_left;
            T[Nx] = T_right;

            for (int n = 0; n < Nt; n++)
            {
                for (int i = 1; i < Nx; i++)
                {
                    Tnew[i] = T[i] + r *
                        (T[i + 1] - 2 * T[i] + T[i - 1]);
                }

                Tnew[0] = T_left;
                Tnew[Nx] = T_right;

                var temp = T;
                T = Tnew;
                Tnew = temp;
            }

            return T[Nx / 2];
        }
    }
}