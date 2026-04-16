using System.Drawing;
using System.Windows.Forms.DataVisualization.Charting;

namespace lab_1__Flying_with_atmosphere_
{
    partial class Form1
    {
        private System.ComponentModel.IContainer components = null;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }

            base.Dispose(disposing);
        }

        #region Код, автоматически созданный конструктором форм Windows

        private void InitializeComponent()
        {
            ChartArea chartArea1 = new ChartArea();
            Legend legend1 = new Legend();
            this.chart1 = new Chart();
            this.panel1 = new System.Windows.Forms.Panel();
            this.label1 = new System.Windows.Forms.Label();
            this.panel2 = new System.Windows.Forms.Panel();
            this.inputStep = new System.Windows.Forms.ComboBox();
            this.label5 = new System.Windows.Forms.Label();
            this.ResultsDataGrid = new System.Windows.Forms.DataGridView();
            this.button1 = new System.Windows.Forms.Button();
            this.inputSize = new System.Windows.Forms.TextBox();
            this.label6 = new System.Windows.Forms.Label();
            this.inputWeight = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.inputAngle = new System.Windows.Forms.TextBox();
            this.inputSpeed = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.chart1)).BeginInit();
            this.panel1.SuspendLayout();
            this.panel2.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.ResultsDataGrid)).BeginInit();
            this.SuspendLayout();
            // 
            // chart1
            // 
            this.chart1.BackColor = Color.FromArgb(25, 23, 24);
            this.chart1.BorderlineColor = Color.FromArgb(25, 23, 24);
            chartArea1.AxisX.LabelStyle.Font = new Font("Century Gothic", 12F, FontStyle.Bold);
            chartArea1.AxisX.LabelStyle.ForeColor = SystemColors.AppWorkspace;
            chartArea1.AxisX.LabelStyle.Format = "0.0";
            chartArea1.AxisX.LineColor = SystemColors.AppWorkspace;
            chartArea1.AxisX.LineWidth = 2;
            chartArea1.AxisX.MajorGrid.LineColor = SystemColors.ControlDarkDark;
            chartArea1.AxisX.Title = "Расстояние (м)";
            chartArea1.AxisX.TitleFont = new Font("Century Gothic", 12F, FontStyle.Bold);
            chartArea1.AxisX.TitleForeColor = SystemColors.AppWorkspace;
            chartArea1.AxisY.LabelStyle.Font = new Font("Century Gothic", 12F, FontStyle.Bold);
            chartArea1.AxisY.LabelStyle.ForeColor = SystemColors.AppWorkspace;
            chartArea1.AxisY.LabelStyle.Format = "0.0";
            chartArea1.AxisY.LineColor = SystemColors.AppWorkspace;
            chartArea1.AxisY.LineWidth = 2;
            chartArea1.AxisY.MajorGrid.LineColor = SystemColors.ControlDarkDark;
            chartArea1.AxisY.Title = "Высота (м)";
            chartArea1.AxisY.TitleFont = new Font("Century Gothic", 12F, FontStyle.Bold);
            chartArea1.AxisY.TitleForeColor = SystemColors.AppWorkspace;
            chartArea1.BackColor = Color.FromArgb(25, 23, 24);
            chartArea1.BorderColor = SystemColors.AppWorkspace;
            chartArea1.Name = "ChartArea1";
            this.chart1.ChartAreas.Add(chartArea1);
            legend1.BackColor = Color.FromArgb(25, 23, 24);
            legend1.Docking = Docking.Bottom;
            legend1.Font = new Font("Century Gothic", 12F, FontStyle.Regular);
            legend1.ForeColor = SystemColors.AppWorkspace;
            legend1.IsTextAutoFit = false;
            legend1.Name = "Legend1";
            this.chart1.Legends.Add(legend1);
            this.chart1.Location = new Point(12, 14);
            this.chart1.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.chart1.Name = "chart1";
            this.chart1.Size = new Size(1038, 858);
            this.chart1.TabIndex = 0;
            this.chart1.Text = "chart1";
         
            // 
            // panel1
            // 
            this.panel1.BackColor = Color.FromArgb(25, 23, 24);
            this.panel1.Controls.Add(this.label1);
            this.panel1.Location = new Point(1068, 14);
            this.panel1.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.panel1.Name = "panel1";
            this.panel1.Size = new Size(678, 94);
            this.panel1.TabIndex = 1;
 
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new Font("Century Gothic", 36F, FontStyle.Regular, GraphicsUnit.Point, ((byte)(204)));
            this.label1.ForeColor = SystemColors.AppWorkspace;
            this.label1.Location = new Point(105, 0);
            this.label1.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label1.Name = "label1";
            this.label1.Size = new Size(468, 87);
            this.label1.TabIndex = 2;
            this.label1.Text = "Параметры";
            // 
            // panel2
            // 
            this.panel2.BackColor = Color.FromArgb(25, 23, 24);
            this.panel2.Controls.Add(this.inputStep);
            this.panel2.Controls.Add(this.label5);
            this.panel2.Controls.Add(this.ResultsDataGrid);
            this.panel2.Controls.Add(this.button1);
            this.panel2.Controls.Add(this.inputSize);
            this.panel2.Controls.Add(this.label6);
            this.panel2.Controls.Add(this.inputWeight);
            this.panel2.Controls.Add(this.label4);
            this.panel2.Controls.Add(this.inputAngle);
            this.panel2.Controls.Add(this.inputSpeed);
            this.panel2.Controls.Add(this.label3);
            this.panel2.Controls.Add(this.label2);
            this.panel2.Location = new Point(1068, 132);
            this.panel2.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.panel2.Name = "panel2";
            this.panel2.Size = new Size(678, 740);
            this.panel2.TabIndex = 3;
           
            // 
            // inputStep
            // 
            this.inputStep.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.inputStep.Font = new Font("Century Gothic", 20.25F);
            this.inputStep.FormattingEnabled = true;
            this.inputStep.Location = new Point(355, 308);
            this.inputStep.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.inputStep.Name = "inputStep";
            this.inputStep.Size = new Size(157, 58);
            this.inputStep.TabIndex = 19;
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Font = new Font("Century Gothic", 20.25F, FontStyle.Regular, GraphicsUnit.Point, ((byte)(204)));
            this.label5.ForeColor = SystemColors.AppWorkspace;
            this.label5.Location = new Point(13, 311);
            this.label5.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label5.Name = "label5";
            this.label5.Size = new Size(216, 50);
            this.label5.TabIndex = 18;
            this.label5.Text = "Шаг dt, c:";
            // 
            // ResultsDataGrid
            // 
            this.ResultsDataGrid.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.ResultsDataGrid.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.ResultsDataGrid.Location = new Point(22, 450);
            this.ResultsDataGrid.Name = "ResultsDataGrid";
            this.ResultsDataGrid.RowHeadersWidth = 62;
            this.ResultsDataGrid.RowTemplate.Height = 28;
            this.ResultsDataGrid.Size = new Size(642, 260);
            this.ResultsDataGrid.TabIndex = 17;
            // 
            // button1
            // 
            this.button1.Font = new Font("Century Gothic", 20.25F);
            this.button1.Location = new Point(245, 379);
            this.button1.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.button1.Name = "button1";
            this.button1.Size = new Size(198, 56);
            this.button1.TabIndex = 7;
            this.button1.Text = "Запуск";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.Button1_Click);
            // 
            // inputSize
            // 
            this.inputSize.Font = new Font("Century Gothic", 20.25F);
            this.inputSize.Location = new Point(355, 234);
            this.inputSize.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.inputSize.Name = "inputSize";
            this.inputSize.Size = new Size(157, 57);
            this.inputSize.TabIndex = 11;
            this.inputSize.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Font = new Font("Century Gothic", 20.25F, FontStyle.Regular, GraphicsUnit.Point, ((byte)(204)));
            this.label6.ForeColor = SystemColors.AppWorkspace;
            this.label6.Location = new Point(13, 234);
            this.label6.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label6.Name = "label6";
            this.label6.Size = new Size(298, 50);
            this.label6.TabIndex = 10;
            this.label6.Text = "Размер тела:";
            // 
            // inputWeight
            // 
            this.inputWeight.Font = new Font("Century Gothic", 20.25F);
            this.inputWeight.Location = new Point(355, 158);
            this.inputWeight.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.inputWeight.Name = "inputWeight";
            this.inputWeight.Size = new Size(157, 57);
            this.inputWeight.TabIndex = 9;
            this.inputWeight.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Font = new Font("Century Gothic", 20.25F, FontStyle.Regular, GraphicsUnit.Point, ((byte)(204)));
            this.label4.ForeColor = SystemColors.AppWorkspace;
            this.label4.Location = new Point(13, 161);
            this.label4.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label4.Name = "label4";
            this.label4.Size = new Size(216, 50);
            this.label4.TabIndex = 8;
            this.label4.Text = "Вес тела:";
            // 
            // inputAngle
            // 
            this.inputAngle.Font = new Font("Century Gothic", 20.25F);
            this.inputAngle.Location = new Point(355, 84);
            this.inputAngle.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.inputAngle.Name = "inputAngle";
            this.inputAngle.Size = new Size(157, 57);
            this.inputAngle.TabIndex = 6;
            this.inputAngle.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            // 
            // inputSpeed
            // 
            this.inputSpeed.Font = new Font("Century Gothic", 20.25F);
            this.inputSpeed.Location = new Point(355, 9);
            this.inputSpeed.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.inputSpeed.Name = "inputSpeed";
            this.inputSpeed.Size = new Size(157, 57);
            this.inputSpeed.TabIndex = 5;
            this.inputSpeed.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new Font("Century Gothic", 20.25F, FontStyle.Regular, GraphicsUnit.Point, ((byte)(204)));
            this.label3.ForeColor = SystemColors.AppWorkspace;
            this.label3.Location = new Point(13, 86);
            this.label3.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label3.Name = "label3";
            this.label3.Size = new Size(293, 50);
            this.label3.TabIndex = 4;
            this.label3.Text = "Угол броска:";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new Font("Century Gothic", 20.25F, FontStyle.Regular, GraphicsUnit.Point, ((byte)(204)));
            this.label2.ForeColor = SystemColors.AppWorkspace;
            this.label2.Location = new Point(13, 11);
            this.label2.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label2.Name = "label2";
            this.label2.Size = new Size(311, 50);
            this.label2.TabIndex = 3;
            this.label2.Text = "Сила броска:";
         
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new SizeF(9F, 20F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = SystemColors.ActiveCaptionText;
            this.BackgroundImage = global::lab_1__Flying_with_atmosphere_.Properties.Resources.background;
            this.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.ClientSize = new Size(1760, 886);
            this.Controls.Add(this.panel2);
            this.Controls.Add(this.panel1);
            this.Controls.Add(this.chart1);
            this.DoubleBuffered = true;
            this.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.Name = "Form1";
            this.Text = "Моделирование полёта в атмосфере";
            this.Load += new System.EventHandler(this.Form1_Load);
            ((System.ComponentModel.ISupportInitialize)(this.chart1)).EndInit();
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            this.panel2.ResumeLayout(false);
            this.panel2.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.ResultsDataGrid)).EndInit();
            this.ResumeLayout(false);
        }

        #endregion

        private Chart chart1;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Panel panel2;
        private System.Windows.Forms.TextBox inputAngle;
        private System.Windows.Forms.TextBox inputSpeed;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.TextBox inputWeight;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.TextBox inputSize;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.DataGridView ResultsDataGrid;
        private System.Windows.Forms.ComboBox inputStep;
        private System.Windows.Forms.Label label5;
    }
}