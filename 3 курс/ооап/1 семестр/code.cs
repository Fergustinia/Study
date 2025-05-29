using System;
using System.Collections.Generic;

public class Student
{
    public string Name { get; set; }
    public int ID { get; set; }
}

public class Staff
{
    public string Position { get; set; }

    public void CheckInfo(Student student)
    {
        Console.WriteLine($"{Position} проверяет информацию о студенте: {student.Name}");
    }

    public void CheckCertificate(Student student)
    {
        Console.WriteLine($"{Position} проверяет справки студента: {student.Name}");
    }

    public void CheckDocuments(Student student)
    {
        Console.WriteLine($"{Position} проверяет документы студента: {student.Name}");
    }

    public void ShowRoom(Room room)
    {
        Console.WriteLine($"{Position} показывает комнату номер {room.Number}");
    }
}

public class Room
{
    public int Number { get; set; }
    public bool IsOccupied { get; set; }

    public Room(int number)
    {
        Number = number;
        IsOccupied = false;
    }
}

public class Dormitory
{
    private List<Room> rooms = new List<Room>();
    private List<Student> students = new List<Student>();
    private Staff commandant;
    private Staff passportOfficer;
    private Staff roomAllocator;

    public Dormitory()
    {
        commandant = new Staff { Position = "Комендант" };
        passportOfficer = new Staff { Position = "Паспортнист" };
        roomAllocator = new Staff { Position = "Расселитель" };

        // Инициализация комнат
        rooms.Add(new Room(101));
        rooms.Add(new Room(102));
        rooms.Add(new Room(103));
    }

    public void CheckIn(Student student)
    {
        Console.WriteLine($"Начало процесса заселения студента: {student.Name}");

        commandant.CheckInfo(student);
        commandant.CheckCertificate(student);
        passportOfficer.CheckDocuments(student);

        Register(student);
    }

    private void Register(Student student)
    {
        students.Add(student);
        Console.WriteLine($"Студент {student.Name} зарегистрирован.");

        Room room = FindAvailableRoom();
        if (room != null)
        {
            roomAllocator.ShowRoom(room);
            AssignRoom(student, room);
        }
        else
        {
            Console.WriteLine("Нет доступных комнат для заселения.");
        }
    }

    private Room FindAvailableRoom()
    {
        foreach (Room room in rooms)
        {
            if (!room.IsOccupied)
                return room;
        }
        return null;
    }

    private void AssignRoom(Student student, Room room)
    {
        room.IsOccupied = true;
        Console.WriteLine($"Студент {student.Name} заселен в комнату {room.Number}.");
    }
}

class Program
{
    static void Main(string[] args)
    {
        Student student = new Student { Name = "Иван Иванов", ID = 1 };
        Dormitory dormitory = new Dormitory();
        
        dormitory.CheckIn(student);
    }
}
