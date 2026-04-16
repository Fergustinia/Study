using System.Windows.Forms;
using System.Windows.Forms.DataVisualization.Charting;

namespace HeatEquationFiniteDifference
{
    partial class Form1
    {
        private System.ComponentModel.IContainer components = null;

        private Label lblLength;
        private Label lblAlpha;
        private Label lblInitialTemp;
        private Label lblLeftTemp;
        private Label lblRightTemp;
        private Label lblTotalTime;
        private Label lblDt;
        private Label lblDx;
        private Label lblInfo;

        private TextBox txtLength;
        private TextBox txtAlpha;
        private TextBox txtInitialTemp;
        private TextBox txtLeftTemp;
        private TextBox txtRightTemp;
        private TextBox txtTotalTime;
        private TextBox txtDt;
        private TextBox txtDx;
        private TextBox txtOutput;

        private Button btnRun;

        private DataGridView dgvResults;
        private Chart chartTemperature;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }

            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        private void InitializeComponent()
        {
            this.lblLength = new System.Windows.Forms.Label();
            this.lblAlpha = new System.Windows.Forms.Label();
            this.lblInitialTemp = new System.Windows.Forms.Label();
            this.lblLeftTemp = new System.Windows.Forms.Label();
            this.lblRightTemp = new System.Windows.Forms.Label();
            this.lblTotalTime = new System.Windows.Forms.Label();
            this.lblDt = new System.Windows.Forms.Label();
            this.lblDx = new System.Windows.Forms.Label();
            this.lblInfo = new System.Windows.Forms.Label();

            this.txtLength = new System.Windows.Forms.TextBox();
            this.txtAlpha = new System.Windows.Forms.TextBox();
            this.txtInitialTemp = new System.Windows.Forms.TextBox();
            this.txtLeftTemp = new System.Windows.Forms.TextBox();
            this.txtRightTemp = new System.Windows.Forms.TextBox();
            this.txtTotalTime = new System.Windows.Forms.TextBox();
            this.txtDt = new System.Windows.Forms.TextBox();
            this.txtDx = new System.Windows.Forms.TextBox();
            this.txtOutput = new System.Windows.Forms.TextBox();

            this.btnRun = new System.Windows.Forms.Button();

            this.dgvResults = new System.Windows.Forms.DataGridView();
            this.chartTemperature = new System.Windows.Forms.DataVisualization.Charting.Chart();

            ((System.ComponentModel.ISupportInitialize)(this.dgvResults)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.chartTemperature)).BeginInit();
            this.SuspendLayout();

            // lblLength
            this.lblLength.AutoSize = true;
            this.lblLength.Location = new System.Drawing.Point(20, 20);
            this.lblLength.Name = "lblLength";
            this.lblLength.Size = new System.Drawing.Size(122, 20);
            this.lblLength.TabIndex = 0;
            this.lblLength.Text = "Длина пластины";

            // txtLength
            this.txtLength.Location = new System.Drawing.Point(220, 17);
            this.txtLength.Name = "txtLength";
            this.txtLength.Size = new System.Drawing.Size(100, 27);
            this.txtLength.TabIndex = 1;
            this.txtLength.Text = "1";

            // lblAlpha
            this.lblAlpha.AutoSize = true;
            this.lblAlpha.Location = new System.Drawing.Point(20, 55);
            this.lblAlpha.Name = "lblAlpha";
            this.lblAlpha.Size = new System.Drawing.Size(178, 20);
            this.lblAlpha.TabIndex = 2;
            this.lblAlpha.Text = "Температуропроводность";

            // txtAlpha
            this.txtAlpha.Location = new System.Drawing.Point(220, 52);
            this.txtAlpha.Name = "txtAlpha";
            this.txtAlpha.Size = new System.Drawing.Size(100, 27);
            this.txtAlpha.TabIndex = 3;
            this.txtAlpha.Text = "0,01";

            // lblInitialTemp
            this.lblInitialTemp.AutoSize = true;
            this.lblInitialTemp.Location = new System.Drawing.Point(20, 90);
            this.lblInitialTemp.Name = "lblInitialTemp";
            this.lblInitialTemp.Size = new System.Drawing.Size(192, 20);
            this.lblInitialTemp.TabIndex = 4;
            this.lblInitialTemp.Text = "Начальная температура";

            // txtInitialTemp
            this.txtInitialTemp.Location = new System.Drawing.Point(220, 87);
            this.txtInitialTemp.Name = "txtInitialTemp";
            this.txtInitialTemp.Size = new System.Drawing.Size(100, 27);
            this.txtInitialTemp.TabIndex = 5;
            this.txtInitialTemp.Text = "50";

            // lblLeftTemp
            this.lblLeftTemp.AutoSize = true;
            this.lblLeftTemp.Location = new System.Drawing.Point(20, 125);
            this.lblLeftTemp.Name = "lblLeftTemp";
            this.lblLeftTemp.Size = new System.Drawing.Size(155, 20);
            this.lblLeftTemp.TabIndex = 6;
            this.lblLeftTemp.Text = "Температура слева";

            // txtLeftTemp
            this.txtLeftTemp.Location = new System.Drawing.Point(220, 122);
            this.txtLeftTemp.Name = "txtLeftTemp";
            this.txtLeftTemp.Size = new System.Drawing.Size(100, 27);
            this.txtLeftTemp.TabIndex = 7;
            this.txtLeftTemp.Text = "30";

            // lblRightTemp
            this.lblRightTemp.AutoSize = true;
            this.lblRightTemp.Location = new System.Drawing.Point(20, 160);
            this.lblRightTemp.Name = "lblRightTemp";
            this.lblRightTemp.Size = new System.Drawing.Size(165, 20);
            this.lblRightTemp.TabIndex = 8;
            this.lblRightTemp.Text = "Температура справа";

            // txtRightTemp
            this.txtRightTemp.Location = new System.Drawing.Point(220, 157);
            this.txtRightTemp.Name = "txtRightTemp";
            this.txtRightTemp.Size = new System.Drawing.Size(100, 27);
            this.txtRightTemp.TabIndex = 9;
            this.txtRightTemp.Text = "100";

            // lblTotalTime
            this.lblTotalTime.AutoSize = true;
            this.lblTotalTime.Location = new System.Drawing.Point(20, 195);
            this.lblTotalTime.Name = "lblTotalTime";
            this.lblTotalTime.Size = new System.Drawing.Size(160, 20);
            this.lblTotalTime.TabIndex = 10;
            this.lblTotalTime.Text = "Время моделирования";

            // txtTotalTime
            this.txtTotalTime.Location = new System.Drawing.Point(220, 192);
            this.txtTotalTime.Name = "txtTotalTime";
            this.txtTotalTime.Size = new System.Drawing.Size(100, 27);
            this.txtTotalTime.TabIndex = 11;
            this.txtTotalTime.Text = "2";

            // lblDt
            this.lblDt.AutoSize = true;
            this.lblDt.Location = new System.Drawing.Point(20, 230);
            this.lblDt.Name = "lblDt";
            this.lblDt.Size = new System.Drawing.Size(115, 20);
            this.lblDt.TabIndex = 12;
            this.lblDt.Text = "Шаг по времени";

            // txtDt
            this.txtDt.Location = new System.Drawing.Point(220, 227);
            this.txtDt.Name = "txtDt";
            this.txtDt.Size = new System.Drawing.Size(100, 27);
            this.txtDt.TabIndex = 13;
            this.txtDt.Text = "0,001";

            // lblDx
            this.lblDx.AutoSize = true;
            this.lblDx.Location = new System.Drawing.Point(20, 265);
            this.lblDx.Name = "lblDx";
            this.lblDx.Size = new System.Drawing.Size(153, 20);
            this.lblDx.TabIndex = 14;
            this.lblDx.Text = "Шаг по пространству";

            // txtDx
            this.txtDx.Location = new System.Drawing.Point(220, 262);
            this.txtDx.Name = "txtDx";
            this.txtDx.Size = new System.Drawing.Size(100, 27);
            this.txtDx.TabIndex = 15;
            this.txtDx.Text = "0,1";

            // btnRun
            this.btnRun.Location = new System.Drawing.Point(24, 310);
            this.btnRun.Name = "btnRun";
            this.btnRun.Size = new System.Drawing.Size(296, 40);
            this.btnRun.TabIndex = 16;
            this.btnRun.Text = "Рассчитать";
            this.btnRun.UseVisualStyleBackColor = true;
            this.btnRun.Click += new System.EventHandler(this.btnRun_Click);

            // lblInfo
            this.lblInfo.AutoSize = true;
            this.lblInfo.Location = new System.Drawing.Point(20, 365);
            this.lblInfo.Name = "lblInfo";
            this.lblInfo.Size = new System.Drawing.Size(0, 20);
            this.lblInfo.TabIndex = 17;

            // txtOutput
            this.txtOutput.Location = new System.Drawing.Point(24, 395);
            this.txtOutput.Multiline = true;
            this.txtOutput.Name = "txtOutput";
            this.txtOutput.ReadOnly = true;
            this.txtOutput.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.txtOutput.Size = new System.Drawing.Size(296, 180);
            this.txtOutput.TabIndex = 18;

            // dgvResults
            this.dgvResults.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dgvResults.Location = new System.Drawing.Point(340, 17);
            this.dgvResults.Name = "dgvResults";
            this.dgvResults.RowHeadersWidth = 51;
            this.dgvResults.Size = new System.Drawing.Size(620, 230);
            this.dgvResults.TabIndex = 19;

            // chartTemperature
            this.chartTemperature.Location = new System.Drawing.Point(340, 265);
            this.chartTemperature.Name = "chartTemperature";
            this.chartTemperature.Size = new System.Drawing.Size(620, 310);
            this.chartTemperature.TabIndex = 20;
            this.chartTemperature.Text = "chartTemperature";

            // Form1
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 20F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(984, 601);
            this.Controls.Add(this.chartTemperature);
            this.Controls.Add(this.dgvResults);
            this.Controls.Add(this.txtOutput);
            this.Controls.Add(this.lblInfo);
            this.Controls.Add(this.btnRun);
            this.Controls.Add(this.txtDx);
            this.Controls.Add(this.lblDx);
            this.Controls.Add(this.txtDt);
            this.Controls.Add(this.lblDt);
            this.Controls.Add(this.txtTotalTime);
            this.Controls.Add(this.lblTotalTime);
            this.Controls.Add(this.txtRightTemp);
            this.Controls.Add(this.lblRightTemp);
            this.Controls.Add(this.txtLeftTemp);
            this.Controls.Add(this.lblLeftTemp);
            this.Controls.Add(this.txtInitialTemp);
            this.Controls.Add(this.lblInitialTemp);
            this.Controls.Add(this.txtAlpha);
            this.Controls.Add(this.lblAlpha);
            this.Controls.Add(this.txtLength);
            this.Controls.Add(this.lblLength);
            this.Name = "Form1";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Метод конечных разностей для уравнения теплопроводности";
            this.Load += new System.EventHandler(this.Form1_Load);

            ((System.ComponentModel.ISupportInitialize)(this.dgvResults)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.chartTemperature)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();
        }

        #endregion
    }
}