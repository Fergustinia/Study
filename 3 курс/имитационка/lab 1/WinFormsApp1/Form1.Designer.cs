namespace FlightSimulation
{
    partial class Form1
    {
        private System.ComponentModel.IContainer components = null;

        private System.Windows.Forms.Panel panelDraw;
        private System.Windows.Forms.Button buttonRun;
        private System.Windows.Forms.DataGridView table;
        private System.Windows.Forms.TextBox textStep;
        private System.Windows.Forms.Label label1;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
                components.Dispose();

            base.Dispose(disposing);
        }

        private void InitializeComponent()
        {
            this.panelDraw = new System.Windows.Forms.Panel();
            this.buttonRun = new System.Windows.Forms.Button();
            this.table = new System.Windows.Forms.DataGridView();
            this.textStep = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();

            ((System.ComponentModel.ISupportInitialize)(this.table)).BeginInit();
            this.SuspendLayout();

            panelDraw.Location = new System.Drawing.Point(10, 10);
            panelDraw.Size = new System.Drawing.Size(960, 400);
            panelDraw.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            panelDraw.Paint += new System.Windows.Forms.PaintEventHandler(this.panelDraw_Paint);

            label1.Text = "Шаг моделирования:";
            label1.Location = new System.Drawing.Point(10, 420);

            textStep.Location = new System.Drawing.Point(150, 420);
            textStep.Width = 100;
            textStep.Text = "0.01";

            buttonRun.Text = "Добавить моделирование";
            buttonRun.Location = new System.Drawing.Point(270, 418);
            buttonRun.Size = new System.Drawing.Size(200, 30);
            buttonRun.Click += new System.EventHandler(this.buttonRun_Click);

            table.Location = new System.Drawing.Point(10, 460);
            table.Size = new System.Drawing.Size(960, 150);
            table.ColumnCount = 4;

            table.Columns[0].Name = "Шаг";
            table.Columns[1].Name = "Дальность";
            table.Columns[2].Name = "Макс высота";
            table.Columns[3].Name = "Скорость в конце";

            this.ClientSize = new System.Drawing.Size(980, 630);
            this.Controls.Add(panelDraw);
            this.Controls.Add(buttonRun);
            this.Controls.Add(table);
            this.Controls.Add(textStep);
            this.Controls.Add(label1);

            this.Text = "Моделирование полёта тела";

            ((System.ComponentModel.ISupportInitialize)(this.table)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();
        }
    }
}