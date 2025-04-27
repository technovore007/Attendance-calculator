import customtkinter as ctk
from tkinter import messagebox

# Set appearance
ctk.set_appearance_mode("Light")  # Light, Dark, or System
ctk.set_default_color_theme("blue")  # Blue, green, dark-blue

# Main window
app = ctk.CTk()
app.title("🎯 Attendance Calculator 🎯")
app.geometry("500x600")

# Create a main frame inside the app
main_frame = ctk.CTkFrame(master=app)
main_frame.pack(pady=20, padx=20, fill="both", expand=True)

# Heading
heading = ctk.CTkLabel(master=main_frame, text="🎯 Attendance Calculator 🎯", font=("Arial", 26, "bold"))
heading.pack(pady=20)

# Total Classes Entry
total_label = ctk.CTkLabel(master=main_frame, text="📚 Enter Total Classes:", font=("Arial", 18))
total_label.pack(pady=5)
total_entry = ctk.CTkEntry(master=main_frame, placeholder_text="Eg: 50")
total_entry.pack(pady=5)

# Missed Classes Entry
missed_label = ctk.CTkLabel(master=main_frame, text="🚫 Enter Classes Missed:", font=("Arial", 18))
missed_label.pack(pady=5)
missed_entry = ctk.CTkEntry(master=main_frame, placeholder_text="Eg: 5")
missed_entry.pack(pady=5)

# Threshold Attendance Entry
threshold_label = ctk.CTkLabel(master=main_frame, text="🎯 Threshold Attendance %:", font=("Arial", 18))
threshold_label.pack(pady=5)
threshold_entry = ctk.CTkEntry(master=main_frame, placeholder_text="Eg: 80")
threshold_entry.pack(pady=5)

# Result Display
result_label = ctk.CTkLabel(master=main_frame, text="", font=("Arial", 18), wraplength=400, justify="center")
result_label.pack(pady=20)

# Calculation function
def calculate_attendance():
    try:
        total_classes = int(total_entry.get())
        missed_classes = int(missed_entry.get())
        threshold = float(threshold_entry.get())

        if missed_classes > total_classes or total_classes <= 0:
            messagebox.showerror("Error", "Invalid class numbers entered! 🚫")
            return

        attended_classes = total_classes - missed_classes
        current_attendance = (attended_classes / total_classes) * 100

        # Calculate additional classes needed
        x = 0
        while True:
            new_attended = attended_classes + x
            new_total = total_classes + x
            new_attendance = (new_attended / new_total) * 100

            if new_attendance >= threshold:
                break
            x += 1

        result_label.configure(text=f"✅ Your Current Attendance: {current_attendance:.2f}%\n\n"
                                    f"🏆 Attend {x} more class(es) without missing\n"
                                    f"to reach {threshold}% attendance!")

    except ValueError:
        messagebox.showerror("Error", "Please enter valid numbers! 🚫")

# Calculate Button
calculate_button = ctk.CTkButton(master=main_frame, text="✨ Calculate ✨", command=calculate_attendance, font=("Arial", 18))
calculate_button.pack(pady=20)

# Footer
footer = ctk.CTkLabel(master=main_frame, text="Made with ❤️ by Mandeep", font=("Arial", 14))
footer.pack(side="bottom", pady=10)

# Run the app
app.mainloop()
