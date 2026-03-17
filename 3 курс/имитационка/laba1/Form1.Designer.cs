using System.Windows.Forms;
using System.Windows.Forms.DataVisualization.Charting;

namespace FlightSimulation;

partial class Form1
{
    private System.ComponentModel.IContainer components = null;

    private NumericUpDown inputHeight;
    private NumericUpDown inputAngle;
    private NumericUpDown inputSpeed;
    private NumericUpDown inputStep;
    private Button btLaunch;
    private Chart chart1;
    private DataGridView resultsGrid;
    private Label labelHeight;
    private Label labelAngle;
    private Label labelSpeed;
    private Label labelStep;

    protected override void Dispose(bool disposing)
    {
        if (disposing && components != null)
        {
            components.Dispose();
        }

        base.Dispose(disposing);
    }

    private void InitializeComponent()
    {
        components = new System.ComponentModel.Container();
        inputHeight = new NumericUpDown();
        inputAngle = new NumericUpDown();
        inputSpeed = new NumericUpDown();
        inputStep = new NumericUpDown();
        btLaunch = new Button();
        chart1 = new Chart();
        resultsGrid = new DataGridView();
        labelHeight = new Label();
        labelAngle = new Label();
        labelSpeed = new Label();
        labelStep = new Label();

        ((System.ComponentModel.ISupportInitialize)inputHeight).BeginInit();
        ((System.ComponentModel.ISupportInitialize)inputAngle).BeginInit();
        ((System.ComponentModel.ISupportInitialize)inputSpeed).BeginInit();
        ((System.ComponentModel.ISupportInitialize)inputStep).BeginInit();
        ((System.ComponentModel.ISupportInitialize)chart1).BeginInit();
        ((System.ComponentModel.ISupportInitialize)resultsGrid).BeginInit();
        SuspendLayout();

        // inputHeight
        inputHeight.Location = new System.Drawing.Point(60, 12);
        inputHeight.Maximum = 1000;
        inputHeight.DecimalPlaces = 1;
        inputHeight.Size = new System.Drawing.Size(80, 23);

        // inputAngle
        inputAngle.Location = new System.Drawing.Point(180, 12);
        inputAngle.Minimum = 0;
        inputAngle.Maximum = 90;
        inputAngle.Value = 45;
        inputAngle.DecimalPlaces = 0;
        inputAngle.Size = new System.Drawing.Size(80, 23);

        // inputSpeed
        inputSpeed.Location = new System.Drawing.Point(300, 12);
        inputSpeed.Minimum = 1;
        inputSpeed.Maximum = 1000;
        inputSpeed.Value = 10;
        inputSpeed.DecimalPlaces = 1;
        inputSpeed.Size = new System.Drawing.Size(80, 23);

        // inputStep
        inputStep.Location = new System.Drawing.Point(420, 12);
        inputStep.DecimalPlaces = 3;
        inputStep.Minimum = 1;
        inputStep.Maximum = 1000;
        inputStep.Value = 100; // 0.1 с
        inputStep.Increment = 10;
        inputStep.Size = new System.Drawing.Size(80, 23);
        inputStep.ThousandsSeparator = false;

        // labels
        labelHeight.AutoSize = true;
        labelHeight.Location = new System.Drawing.Point(12, 14);
        labelHeight.Text = "Height";

        labelAngle.AutoSize = true;
        labelAngle.Location = new System.Drawing.Point(146, 14);
        labelAngle.Text = "Angle";

        labelSpeed.AutoSize = true;
        labelSpeed.Location = new System.Drawing.Point(266, 14);
        labelSpeed.Text = "Speed";

        labelStep.AutoSize = true;
        labelStep.Location = new System.Drawing.Point(400, 14);
        labelStep.Text = "dt";

        // btLaunch
        btLaunch.Location = new System.Drawing.Point(520, 10);
        btLaunch.Size = new System.Drawing.Size(75, 27);
        btLaunch.Text = "Launch";
        btLaunch.Click += btLaunch_Click;

        // chart1
        var chartArea = new ChartArea("Default");
        chart1.ChartAreas.Add(chartArea);
        chart1.Location = new System.Drawing.Point(12, 45);
        chart1.Size = new System.Drawing.Size(580, 260);

        // resultsGrid
        resultsGrid.Location = new System.Drawing.Point(12, 315);
        resultsGrid.Size = new System.Drawing.Size(580, 150);
        resultsGrid.ReadOnly = true;
        resultsGrid.AllowUserToAddRows = false;
        resultsGrid.AllowUserToDeleteRows = false;
        resultsGrid.RowHeadersVisible = false;

        // Form1
        AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
        AutoScaleMode = AutoScaleMode.Font;
        ClientSize = new System.Drawing.Size(604, 480);
        Controls.Add(inputHeight);
        Controls.Add(inputAngle);
        Controls.Add(inputSpeed);
        Controls.Add(inputStep);
        Controls.Add(btLaunch);
        Controls.Add(chart1);
        Controls.Add(resultsGrid);
        Controls.Add(labelHeight);
        Controls.Add(labelAngle);
        Controls.Add(labelSpeed);
        Controls.Add(labelStep);
        Text = "Flight simulation";

        ((System.ComponentModel.ISupportInitialize)inputHeight).EndInit();
        ((System.ComponentModel.ISupportInitialize)inputAngle).EndInit();
        ((System.ComponentModel.ISupportInitialize)inputSpeed).EndInit();
        ((System.ComponentModel.ISupportInitialize)inputStep).EndInit();
        ((System.ComponentModel.ISupportInitialize)chart1).EndInit();
        ((System.ComponentModel.ISupportInitialize)resultsGrid).EndInit();
        ResumeLayout(false);
        PerformLayout();
    }
}

