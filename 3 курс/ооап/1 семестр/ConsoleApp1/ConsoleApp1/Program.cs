using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

class Program
{
    static void Main()
    {
        // Чтение данных студентов из файла
        List<Student> students = LoadStudentsFromFile("students.txt");

        if (students.Count == 0)
        {
            Console.WriteLine("Файл students.txt пустой или данные не удалось загрузить.");
            return;
        }

        // Создаем общежитие и добавляем комнаты
        Dormitory dormitory = new Dormitory();
        dormitory.AddRooms(9, 40); // 9 этажей, по 40 комнат на этаж

        // Запускаем процесс заселения студентов
        dormitory.ProcessStudents(students);

        // Вывод отчета в консоль
        dormitory.GenerateReport();

        // Запись отчета в файл
        dormitory.SaveReportToFile("DormitoryReport.txt");

        // Теперь добавим функцию для поиска комнаты по ID студента
        Settler settler = new Settler(dormitory);

        // Запрашиваем ID студента и показываем комнату
        Console.WriteLine("\nВведите ID студента для поиска комнаты:");
        int studentId = int.Parse(Console.ReadLine());
        settler.ShowAssignedRoom(studentId);
    }

    static List<Student> LoadStudentsFromFile(string filePath)
    {
        List<Student> students = new List<Student>();

        try
        {
            using (StreamReader reader = new StreamReader(filePath))
            {
                string line;
                while ((line = reader.ReadLine()) != null)
                {
                    var data = line.Split(';'); // Изменено на точку с запятой

                    if (data.Length == 5)
                    {
                        string name = data[0];
                        int id = int.Parse(data[1]);
                        bool hasValidInfo = bool.Parse(data[2]);
                        bool hasCertificate = bool.Parse(data[3]);
                        bool hasDocuments = bool.Parse(data[4]);

                        students.Add(new Student(name, id, hasValidInfo, hasCertificate, hasDocuments));
                        Console.WriteLine($"Загружен студент: {name}, ID: {id}, Документы: {hasValidInfo}, Сертификат: {hasCertificate}, Общие документы: {hasDocuments}");
                    }
                    else
                    {
                        Console.WriteLine($"Ошибка в строке: {line}. Ожидалось 5 элементов.");
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка при чтении файла {filePath}: {ex.Message}");
        }

        return students;
    }
}

class Student
{
    public string Name { get; }
    public int ID { get; }
    public bool HasValidInfo { get; }
    public bool HasCertificate { get; }
    public bool HasDocuments { get; }
    public string MissingDocuments { get; private set; }

    public Student(string name, int id, bool hasValidInfo, bool hasCertificate, bool hasDocuments)
    {
        Name = name;
        ID = id;
        HasValidInfo = hasValidInfo;
        HasCertificate = hasCertificate;
        HasDocuments = hasDocuments;
        MissingDocuments = GetMissingDocuments();
    }

    private string GetMissingDocuments()
    {
        List<string> missingDocs = new List<string>();

        if (!HasValidInfo) missingDocs.Add("Valid Information");
        if (!HasCertificate) missingDocs.Add("Certificate");
        if (!HasDocuments) missingDocs.Add("General Documents");

        return missingDocs.Count > 0 ? string.Join(", ", missingDocs) : "None";
    }
}

class Room
{
    public string Number { get; }
    public int MaxCapacity { get; } = 4;
    public List<Student> Students { get; } = new List<Student>();

    public bool IsOccupied => Students.Count >= MaxCapacity;

    public Room(string number)
    {
        Number = number;
    }

    public void AddStudent(Student student)
    {
        Students.Add(student);
    }
}

class Staff
{
    public bool VerifyDocuments(Student student)
    {
        bool hasAllDocuments = student.HasValidInfo && student.HasCertificate && student.HasDocuments;
        Console.WriteLine($"Проверка документов для {student.Name}: {(hasAllDocuments ? "Все документы в наличии" : $"Отсутствуют: {student.MissingDocuments}")}");
        return hasAllDocuments;
    }
}

class Dormitory
{
    public List<Room> rooms { get; } = new List<Room>();
    public List<Student> failedStudents { get; } = new List<Student>();
    public List<Student> registeredStudents { get; } = new List<Student>();

    public void AddRooms(int floors, int roomsPerFloor)
    {
        for (int floor = 1; floor <= floors; floor++)
        {
            for (int roomNumber = 1; roomNumber <= roomsPerFloor; roomNumber++)
            {
                rooms.Add(new Room($"{floor}{roomNumber:D2}"));
               
            }
        }
    }

    public void ProcessStudents(List<Student> students)
    {
        Staff staff = new Staff();

        foreach (var student in students)
        {
            Console.WriteLine($"\nProcessing student: {student.Name}");

            if (staff.VerifyDocuments(student))
            {
                bool roomAssigned = RegisterStudent(student);
                if (!roomAssigned)
                {
                    Console.WriteLine($"No available rooms for {student.Name}. Added to failed list.");
                    failedStudents.Add(student);
                }
            }
            else
            {
                Console.WriteLine($"Student {student.Name} is missing documents: {student.MissingDocuments}");
                failedStudents.Add(student);
            }
        }
    }

    public bool RegisterStudent(Student student)
    {
        foreach (var room in rooms)
        {
            if (!room.IsOccupied)
            {
                room.AddStudent(student);
                registeredStudents.Add(student);
                Console.WriteLine($"Student {student.Name} assigned to room {room.Number}");
                return true;
            }
        }
        return false;
    }

    public void GenerateReport()
    {
        Console.WriteLine("\n--- Registration Report ---");

        Console.WriteLine("Students with all documents:");
        foreach (var room in rooms)
        {
            if (room.Students.Count > 0)
            {
                string studentsInRoom = string.Join(", ", room.Students.Select(s => s.Name));
                Console.WriteLine($"Room {room.Number}: {studentsInRoom}");
            }
        }

        Console.WriteLine("\nFailed Students:");
        foreach (var student in failedStudents)
        {
            Console.WriteLine($"- {student.Name}, Missing Documents: {student.MissingDocuments}");
        }
    }

    public void SaveReportToFile(string filePath)
    {
        using (StreamWriter writer = new StreamWriter(filePath))
        {
            writer.WriteLine("--- Registration Report ---");

            writer.WriteLine("Students with all documents:");
            foreach (var room in rooms)
            {
                if (room.Students.Count > 0)
                {
                    string studentsInRoom = string.Join(", ", room.Students.Select(s => s.Name));
                    writer.WriteLine($"Room {room.Number}: {studentsInRoom}");
                }
            }

            writer.WriteLine("\nFailed Students:");
            foreach (var student in failedStudents)
            {
                writer.WriteLine($"- {student.Name}, Missing Documents: {student.MissingDocuments}");
            }
        }

        Console.WriteLine($"\nReport saved to {filePath}");
    }
}

class Settler
{
    private Dormitory dormitory;

    public Settler(Dormitory dormitory)
    {
        this.dormitory = dormitory;
    }

    public void ShowAssignedRoom(int studentId)
    {
        var student = dormitory.registeredStudents.FirstOrDefault(s => s.ID == studentId);
        if (student != null)
        {
            var room = dormitory.rooms.FirstOrDefault(r => r.Students.Contains(student));
            if (room != null)
            {
                Console.WriteLine($"Студент {student.Name} (ID: {student.ID}) заселен в комнату {room.Number}");
            }
            else
            {
                Console.WriteLine($"Студент {student.Name} (ID: {student.ID}) не был заселен в комнату.");
            }
        }
        else
        {
            Console.WriteLine($"Студент с ID {studentId} не найден.");
        }
    }
}
