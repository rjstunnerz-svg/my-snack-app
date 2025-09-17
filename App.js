import React, { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";

const { height } = Dimensions.get("window");

/* -------------------- LOT SIZE TAB (Diamond Hands) -------------------- */
function LotSizeCalculator() {
  const [accountSize, setAccountSize] = useState("10000");
  const [riskPercent, setRiskPercent] = useState("1");
  const [stopLoss, setStopLoss] = useState("");
  const [pipValue, setPipValue] = useState("10");
  const [lotSize, setLotSize] = useState(null);
  const [lockedField, setLockedField] = useState(null);
  const [fallingItems, setFallingItems] = useState([]);

  const calculateLotSize = () => {
    if (!accountSize || !riskPercent || !stopLoss || !pipValue) return;

    const riskAmount =
      parseFloat(accountSize) * (parseFloat(riskPercent) / 100);
    const result =
      riskAmount / (parseFloat(stopLoss) * parseFloat(pipValue));
    setLotSize(result.toFixed(2));

    startFallingItems();
  };

  const startFallingItems = () => {
    const emojis = ["💎", "🚀"];
    const phrases = [
      "🚀 To the Moon!",
      "💎 Hands",
      "🦍 Apes Strong Together",
      "🦧 YOLO",
      "🦄 Unicorn Mode",
      "📈 Diamond Hands",
      "💰 Bag Holder",
      "📉 Paper Hands",
      "🔥 FOMO",
      "💸 Lambo",
      "🦍🚀",
      "💎💎💎",
    ];

    const items = [];

    [...emojis, ...phrases].forEach((content) => {
      const animY = new Animated.Value(-50);
      const rotate = new Animated.Value(Math.random() * 360);
      const opacity = new Animated.Value(1);
      const scale = new Animated.Value(1);
      const left = Math.random() * 97;
      const delay = Math.random() * 1000;
      const duration = 3000 + Math.random() * 3000;

      items.push({ content, animY, rotate, left, opacity, scale });

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(animY, {
            toValue: height + 50,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: rotate._value + 360,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1.3,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 0.8,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start();
    });

    setFallingItems(items);

    setTimeout(() => setFallingItems([]), 7000);
  };

  const handleLock = (field) => {
    setLockedField(field === lockedField ? null : field);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: 60 }]}>
      <Text style={styles.title}>💎 Diamond Hands 💎</Text>

      {[
        { label: "Account Size", value: accountSize, setter: setAccountSize, key: "accountSize" },
        { label: "Risk %", value: riskPercent, setter: setRiskPercent, key: "riskPercent" },
        { label: "Stop Loss (pips)", value: stopLoss, setter: setStopLoss, key: "stopLoss" },
        { label: "Pip Value", value: pipValue, setter: setPipValue, key: "pipValue" },
      ].map((field) => (
        <View style={styles.row} key={field.key}>
          <Text style={styles.label}>{field.label}:</Text>
          <TextInput
            style={[
              styles.input,
              lockedField === field.key && styles.lockedInput,
            ]}
            keyboardType="numeric"
            editable={lockedField !== field.key}
            value={field.value}
            onChangeText={field.setter}
            placeholder="Enter value"
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            style={styles.lockBtn}
            onPress={() => handleLock(field.key)}
          >
            <Text style={styles.lockText}>
              {lockedField === field.key ? "🔓" : "🔒"}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.calcBtn} onPress={calculateLotSize}>
        <Text style={styles.calcText}>🚀🚀 Calculate 🚀🚀</Text>
      </TouchableOpacity>

      {lotSize && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Lot Size: {lotSize}</Text>
        </View>
      )}

      {fallingItems.map((item, index) => {
        const rotateInterpolate = item.rotate.interpolate({
          inputRange: [0, 360],
          outputRange: ["0deg", "360deg"],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.fallingItem,
              {
                transform: [
                  { translateY: item.animY },
                  { rotate: rotateInterpolate },
                  { scale: item.scale },
                ],
                left: `${item.left}%`,
                opacity: item.opacity,
              },
            ]}
          >
            <Text style={styles.fallingText}>{item.content}</Text>
          </Animated.View>
        );
      })}
    </SafeAreaView>
  );
}

/* -------------------- CALCULATOR TAB -------------------- */
function Calculator() {
  const [accountBalance, setAccountBalance] = useState("10000");
  const [entry, setEntry] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [lotSize, setLotSize] = useState("");
  const [pipValue, setPipValue] = useState("10");
  const [result, setResult] = useState(null);
  const [fallingItems, setFallingItems] = useState([]);

  const adjustValue = (value, increment = true) => {
    if (!value) return "0";
    const decimalPlaces = (value.split(".")[1] || "").length;
    const step = decimalPlaces > 0 ? 1 / 10 ** decimalPlaces : 1;
    let newVal = parseFloat(value) + (increment ? step : -step);
    if (newVal < 0) newVal = 0;
    return newVal.toFixed(decimalPlaces);
  };

  const calculateProfitLoss = () => {
    if (!entry || !stopLoss || !takeProfit || !lotSize || !pipValue || !accountBalance) return;

    const entryF = parseFloat(entry);
    const slF = parseFloat(stopLoss);
    const tpF = parseFloat(takeProfit);
    const lotF = parseFloat(lotSize);
    const pipVal = parseFloat(pipValue);
    const acc = parseFloat(accountBalance);

    const pipsTP = Math.abs(tpF - entryF) * 10000;
    const pipsSL = Math.abs(entryF - slF) * 10000;

    const profit = pipsTP * lotF * pipVal;
    const loss = pipsSL * lotF * pipVal;

    const profitPercent = ((profit / acc) * 100).toFixed(2);
    const lossPercent = ((loss / acc) * 100).toFixed(2);

    setResult({ profit: profit.toFixed(2), loss: loss.toFixed(2), profitPercent, lossPercent });
    startFallingItems();
  };

  const startFallingItems = () => {
    const emojis = ["💎", "🚀"];
    const phrases = [
      "🚀 To the Moon!",
      "💎 Hands",
      "🦍 Apes Strong Together",
      "🔥 Profit Time!",
      "💰 Cash In!",
      "📈 Winning Trade",
    ];

    const items = [];
    [...emojis, ...phrases].forEach((content) => {
      const animY = new Animated.Value(-50);
      const rotate = new Animated.Value(Math.random() * 360);
      const opacity = new Animated.Value(1);
      const scale = new Animated.Value(1);
      const left = Math.random() * 97;
      const delay = Math.random() * 1000;
      const duration = 3000 + Math.random() * 3000;

      items.push({ content, animY, rotate, left, opacity, scale });

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(animY, {
            toValue: height + 50,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: rotate._value + 360,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1.3,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 0.8,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start();
    });

    setFallingItems(items);
    setTimeout(() => setFallingItems([]), 7000);
  };

  const renderInput = (label, value, setter, incrementable = false) => (
    <View style={styles.row} key={label}>
      <Text style={styles.label}>{label}:</Text>
      <TextInput
        style={[styles.input, { flex: incrementable ? 1.5 : 1 }]}
        keyboardType="numeric"
        value={value}
        onChangeText={setter}
      />
      {incrementable && (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.incBtn}
            onPress={() => setter(adjustValue(value, true))}
          >
            <Text style={styles.incText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.incBtn}
            onPress={() => setter(adjustValue(value, false))}
          >
            <Text style={styles.incText}>-</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: 60 }]}>
      <Text style={styles.title}>🦍 Calculator 🦍</Text>

      {renderInput("Account Balance", accountBalance, setAccountBalance)}
      {renderInput("Entry Price", entry, setEntry, true)}
      {renderInput("Take Profit", takeProfit, setTakeProfit, true)}
      {renderInput("Stop Loss", stopLoss, setStopLoss, true)}
      {renderInput("Lot Size", lotSize, setLotSize)}
      {renderInput("Pip Value", pipValue, setPipValue)}

      <TouchableOpacity style={styles.calcBtn} onPress={calculateProfitLoss}>
        <Text style={styles.calcText}>🔥 Calculate 🔥</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            If TP Hit: ${result.profit} ({result.profitPercent}%)
          </Text>
          <Text style={styles.resultText}>
            If SL Hit: ${result.loss} ({result.lossPercent}%)
          </Text>
        </View>
      )}

      {fallingItems.map((item, index) => {
        const rotateInterpolate = item.rotate.interpolate({
          inputRange: [0, 360],
          outputRange: ["0deg", "360deg"],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.fallingItem,
              {
                transform: [
                  { translateY: item.animY },
                  { rotate: rotateInterpolate },
                  { scale: item.scale },
                ],
                left: `${item.left}%`,
                opacity: item.opacity,
              },
            ]}
          >
            <Text style={styles.fallingText}>{item.content}</Text>
          </Animated.View>
        );
      })}
    </SafeAreaView>
  );
}

/* -------------------- TABVIEW WRAPPER -------------------- */
export default function App() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "lot", title: "Lot Size" },
    { key: "calculator", title: "Calculator" },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "lot":
        return <LotSizeCalculator />;
      case "calculator":
        return <Calculator />;
      default:
        return null;
    }
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get("window").width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          style={{ backgroundColor: "#0d0d0d", paddingTop: StatusBar.currentHeight || 20 }}
          indicatorStyle={{ backgroundColor: "#00ffcc" }}
          labelStyle={{ color: "#00ffcc", fontWeight: "bold" }}
        />
      )}
    />
  );
}

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 20,
    backgroundColor: "#0d0d0d",
    padding: 16,
  },
  title: {
    fontSize: 28,
    color: "#00ffcc",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 10,
  },
  label: { color: "#fff", width: 130 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: 8,
    marginRight: 8,
    borderRadius: 10,
  },
  lockedInput: { backgroundColor: "#333", color: "#777" },
  lockBtn: { padding: 6 },
  lockText: { color: "#00ffcc", fontSize: 18 },
  calcBtn: { marginTop: 24, backgroundColor: "#00ffcc", padding: 16, borderRadius: 14, alignItems: "center" },
  calcText: { color: "#000", fontWeight: "bold", fontSize: 20 },
  resultBox: { marginTop: 20, padding: 18, borderWidth: 2, borderRadius: 14, borderColor: "#00ffcc", backgroundColor: "#1a1a1a" },
  resultText: { color: "#00ffcc", fontSize: 22, fontWeight: "bold", textAlign: "center" },
  fallingItem: { position: "absolute", top: 0, zIndex: 999 },
  fallingText: { color: "#00ffcc", fontSize: 18, fontWeight: "bold" },
  incBtn: { backgroundColor: "#00ffcc", marginLeft: 4, paddingHorizontal: 6, borderRadius: 6, justifyContent: "center", alignItems: "center" },
  incText: { color: "#000", fontWeight: "bold", fontSize: 18 },
});
