from tkinter import *

root = Tk()
root.title('Automated Flashcards')
root.geometry('550x410')

question = Label(root, text="", font=("Helvetica", 36))
question.pack(pady=50)

answer_label = Label(root, text="")
answer_label.pack(pady=20)

my_entry = Entry(root, font=("Helvetica", 18))
my_entry.pack(pady=20)

# Create buttons
button_frame = Frame(root)
button_frame.pack(pady=20)

answer_button = Button(button_frame, text="Answer")
answer_button.grid(row=0, column=0, padx=20)

next_button = Button(button_frame, text="Next")
next_button.grid(row=0, column=1)

hint_button = Button(button_frame, text="Hint")
hint_button.grid(row=0, column=2, padx=20)

# create hint label

hint_label = Label(root, text="")
hint_label.pack(pady=20)

root.mainloop()
