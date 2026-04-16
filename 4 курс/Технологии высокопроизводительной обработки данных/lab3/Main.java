import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.KTable;
import org.apache.kafka.streams.state.KeyValueStore;

import java.util.Arrays;
import java.util.Properties;

public class Main {
    public static void main(String[] args) {
        // Настройки Kafka Streams
        Properties props = new Properties();
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "wordcount-application");
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass());
        props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass());

        // Создание топологии Kafka Streams
        StreamsBuilder builder = new StreamsBuilder();

        // Чтение данных из топика
        KStream<String, String> textLines = builder.stream("quickstart-events");

        // Подсчёт слов
        KTable<String, Long> wordCounts = textLines
                .flatMapValues(textLine -> Arrays.asList(textLine.toLowerCase().split("\\W+")))  // Разделение на слова
                .groupBy((key, word) -> word)  // Группировка по слову
                .count();  // Подсчёт

        // Запись результатов в новый топик
        wordCounts.toStream().to("WordsWithCountsTopic");

        // Запуск приложения
        KafkaStreams streams = new KafkaStreams(builder.build(), props);
        streams.start();

        // Ожидание завершения
        Runtime.getRuntime().addShutdownHook(new Thread(streams::close));
    }
}