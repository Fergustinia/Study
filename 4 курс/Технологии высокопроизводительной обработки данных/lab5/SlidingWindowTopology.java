package org.example.topologies;

import org.apache.storm.Config;
import org.apache.storm.task.OutputCollector;
import org.apache.storm.task.TopologyContext;
import org.apache.storm.topology.OutputFieldsDeclarer;
import org.apache.storm.topology.TopologyBuilder;
import org.apache.storm.topology.base.BaseWindowedBolt;
import org.apache.storm.tuple.Fields;
import org.apache.storm.tuple.Tuple;
import org.apache.storm.tuple.Values;
import org.apache.storm.windowing.TupleWindow;
import org.apache.storm.topology.base.BaseWindowedBolt.Count;
import org.example.bolts.PrinterBolt;
import org.example.bolts.SlidingWindowSumBolt;
import org.example.spouts.RandomIntegerSpout;
import org.apache.storm.LocalCluster;

import java.util.List;
import java.util.Map;

/**
 * A sample topology that demonstrates the usage of {@link org.apache.storm.topology.IWindowedBolt}
 * to calculate sliding window sum.
 */
public class SlidingWindowTopology {

    public static void main(String[] args) throws Exception {
        try (LocalCluster cluster = new LocalCluster()) {
            TopologyBuilder builder = new TopologyBuilder();
            builder.setSpout("integer", new RandomIntegerSpout(), 1);
            builder.setBolt("slidingsum", new SlidingWindowSumBolt().withWindow(Count.of(30), Count.of(10)), 1)
                    .shuffleGrouping("integer");
            builder.setBolt("tumblingavg", new TumblingWindowAvgBolt().withTumblingWindow(Count.of(3)), 1)
                    .shuffleGrouping("slidingsum");
            builder.setBolt("printer", new PrinterBolt(), 1).shuffleGrouping("tumblingavg");
            Config conf = new Config();
            conf.setDebug(true);
            String topoName = "test";
            if (args != null && args.length > 0) {
                topoName = args[0];
            }
            conf.setNumWorkers(1);

            cluster.submitTopology(topoName, conf, builder.createTopology());
            Thread.sleep(20000);
        }
    }

    /**
     * Computes tumbling window average.
     */
    private static class TumblingWindowAvgBolt extends BaseWindowedBolt {
        private OutputCollector collector;

        @Override
        public void prepare(Map<String, Object> topoConf, TopologyContext context, OutputCollector collector) {
            this.collector = collector;
        }

        @Override
        public void execute(TupleWindow inputWindow) {
            int sum = 0;
            List<Tuple> tuplesInWindow = inputWindow.get();
            System.out.println("Events in current window: " + tuplesInWindow.size());
            if (tuplesInWindow.size() > 0) {
                /*
                 * Since this is a tumbling window calculation,
                 * we use all the tuples in the window to compute the avg.
                 */
                for (Tuple tuple : tuplesInWindow) {
                    sum += (int) tuple.getValue(0);
                }
                collector.emit(new Values(sum / tuplesInWindow.size()));
            }
        }

        @Override
        public void declareOutputFields(OutputFieldsDeclarer declarer) {
            declarer.declare(new Fields("avg"));
        }
    }
}
