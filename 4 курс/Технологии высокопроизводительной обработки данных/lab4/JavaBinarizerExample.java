package org.example;

import org.apache.spark.sql.SparkSession;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.ml.feature.Binarizer;
import org.apache.spark.sql.types.*;

public class JavaBinarizerExample {
    public static void main(String[] args) {
        // Создание SparkSession
        SparkSession spark = SparkSession.builder()
                .appName("JavaBinarizerExample")
                .config("spark.master", "local")
                .getOrCreate();

        // Задание схемы для данных
        StructType schema = new StructType(new StructField[]{
                new StructField("feature", DataTypes.DoubleType, false, Metadata.empty())  // Используем пустые метаданные
        });

        // Создание DataFrame с примерами данных
        Dataset<Row> data = spark.read().schema(schema).csv("C:\\Users\\ВЫХУХОЛЬ\\IdeaProjects\\SparkBinarizer\\src\\data.csv");

        // Настройка Binarizer
        Binarizer binarizer = new Binarizer()
                .setInputCol("feature")
                .setOutputCol("binarized_feature")
                .setThreshold(0.5);

        // Применение бинаризации
        Dataset<Row> binarizedData = binarizer.transform(data);

        // Показать результат
        binarizedData.show();

        // Завершение работы Spark
        spark.stop();
    }
}