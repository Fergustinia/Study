using System.Drawing;
using System.Windows.Forms;

namespace lab3__1d_cellular_machine_
{
    partial class Form1
    {
        private System.ComponentModel.IContainer components = null;

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
            this.components = new System.ComponentModel.Container();
            this.AutoScaleMode = AutoScaleMode.Font;
            this.ClientSize = new Size(1200, 800);
            this.Name = "Form1";
            this.Text = "Лесные пожары";
            this.StartPosition = FormStartPosition.CenterScreen;
        }
    }
}