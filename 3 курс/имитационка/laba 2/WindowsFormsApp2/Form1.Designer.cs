namespace HeatEquationApp
{
    partial class Form1
    {
        private System.ComponentModel.IContainer components = null;
        private System.Windows.Forms.DataGridView table;
        private System.Windows.Forms.Button btnCalculate;
        private System.Windows.Forms.Label titleLabel;
        private System.Windows.Forms.Label taskLabel;
        private System.Windows.Forms.Label noteLabel;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
                components.Dispose();

            base.Dispose(disposing);
        }

        private void InitializeComponent()
        {
            this.table = new System.Windows.Forms.DataGridView();
            this.btnCalculate = new System.Windows.Forms.Button();
            this.titleLabel = new System.Windows.Forms.Label();
            this.taskLabel = new System.Windows.Forms.Label();
            this.noteLabel = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.table)).BeginInit();
            this.SuspendLayout();

            // titleLabel
            this.titleLabel.AutoSize = true;
            this.titleLabel.Font = new System.Drawing.Font("Segoe UI", 14F, System.Drawing.FontStyle.Bold);
            this.titleLabel.Location = new System.Drawing.Point(20, 20);
            this.titleLabel.Name = "titleLabel";
            this.titleLabel.Size = new System.Drawing.Size(502, 32);
            this.titleLabel.Text = "Метод конечных разностей для теплопроводности";

            // taskLabel
            this.taskLabel.AutoSize = true;
            this.taskLabel.Location = new System.Drawing.Point(22, 70);
            this.taskLabel.Name = "taskLabel";
            this.taskLabel.Size = new System.Drawing.Size(760, 40);
            this.taskLabel.Text = "Заполнить таблицу значений температуры в центральной точке пластины\r\nпосле 2 секу" +
    "нд моделирования для заданных шагов по времени и пространству.";

            // table
            this.table.AllowUserToAddRows = false;
            this.table.AllowUserToDeleteRows = false;
            this.table.AllowUserToResizeColumns = false;
            this.table.AllowUserToResizeRows = false;
            this.table.Location = new System.Drawing.Point(20, 120);
            this.table.Name = "table";
            this.table.RowHeadersVisible = false;
            this.table.Size = new System.Drawing.Size(1100, 300);
            this.table.Font = new System.Drawing.Font("Segoe UI", 12F);

            // btnCalculate
            this.btnCalculate.Location = new System.Drawing.Point(26, 370);
            this.btnCalculate.Name = "btnCalculate";
            this.btnCalculate.Size = new System.Drawing.Size(180, 40);
            this.btnCalculate.TabIndex = 1;
            this.btnCalculate.Text = "Заполнить таблицу";
            this.btnCalculate.UseVisualStyleBackColor = true;
            this.btnCalculate.Click += new System.EventHandler(this.btnCalculate_Click);

            // noteLabel
            this.noteLabel.AutoSize = true;
            this.noteLabel.Location = new System.Drawing.Point(26, 425);
            this.noteLabel.Name = "noteLabel";
            this.noteLabel.Size = new System.Drawing.Size(134, 20);
            this.noteLabel.Text = "Сделать вывод.";

            // Form1
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 20F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1150, 500);
            this.Controls.Add(this.noteLabel);
            this.Controls.Add(this.table);
            this.Controls.Add(this.btnCalculate);
            this.Controls.Add(this.taskLabel);
            this.Controls.Add(this.titleLabel);
            this.Name = "Form1";
            this.Text = "Лабораторная работа";
            this.Load += new System.EventHandler(this.Form1_Load);
            ((System.ComponentModel.ISupportInitialize)(this.table)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();
        }
    }
}