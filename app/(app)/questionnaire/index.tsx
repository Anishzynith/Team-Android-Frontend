import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useQuestionnaire } from "../../../contexts/QuestionnaireContext";
import { router } from "expo-router";
import QuestionCard from "./components/QuestionCard";
import ProgressBar from "./components/ProgressBar";

export default function QuestionnaireScreen() {
  const {
    questions,
    currentQuestionIndex,
    answers,
    isLoading,
    error,
    isComplete,
    answerQuestion,
    goToNext,
    goToPrevious,
    submitAnswers,
    progress,
  } = useQuestionnaire();

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(
    (a) => a.questionId === currentQuestion?.id
  )?.value;

  const handleSubmit = async () => {
    // Check if all required questions are answered
    const unansweredRequired = questions.filter(
      (q) => q.isRequired && !answers.some((a) => a.questionId === q.id)
    );

    if (unansweredRequired.length > 0) {
      Alert.alert(
        "Incomplete",
        "Please answer all required questions before submitting.",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Submit Answers",
      "Are you sure you want to submit your answers?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          onPress: async () => {
            try {
              await submitAnswers();
              Alert.alert(
                "Success",
                "Your answers have been submitted successfully!",
                [{ text: "OK", onPress: () => router.replace("/(app)/dashboard") }]
              );
            } catch (error) {
              Alert.alert("Error", "Failed to submit answers. Please try again.");
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => window.location.reload()}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isComplete) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.completeText}>✓ Questionnaire Complete!</Text>
        <Text style={styles.completeSubtext}>
          Thank you for completing the questionnaire.
        </Text>
        <TouchableOpacity
          style={styles.dashboardButton}
          onPress={() => router.replace("/(app)/dashboard")}
        >
          <Text style={styles.dashboardButtonText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!questions.length || !currentQuestion) {
    return (
      <View style={styles.centerContainer}>
        <Text>No questions available</Text>
      </View>
    );
  }

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <View style={styles.container}>
      <ProgressBar
        progress={progress}
        totalQuestions={questions.length}
        currentQuestion={currentQuestionIndex}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <QuestionCard
          question={currentQuestion}
          currentAnswer={currentAnswer}
          onAnswer={(value) => answerQuestion(currentQuestion.id, value)}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.prevButton]}
          onPress={goToPrevious}
          disabled={currentQuestionIndex === 0}
        >
          <Text
            style={[
              styles.buttonText,
              currentQuestionIndex === 0 && styles.disabledText,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        {isLastQuestion ? (
          <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={goToNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// Import Alert from react-native
import { Alert } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#ff4444",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  completeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4CAF50",
    marginBottom: 8,
  },
  completeSubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  dashboardButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: "#007AFF",
    borderRadius: 10,
  },
  dashboardButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  prevButton: {
    backgroundColor: "#f0f0f0",
  },
  nextButton: {
    backgroundColor: "#007AFF",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  disabledText: {
    color: "#999",
  },
});