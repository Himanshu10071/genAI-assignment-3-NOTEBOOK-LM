import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Upload, FilePlus } from "lucide-react-native";

interface UploadCardProps {
  onPress: () => void;
  isUploading: boolean;
  fileName?: string | null;
}

export const UploadCard = ({ onPress, isUploading, fileName }: UploadCardProps) => (
  <View style={styles.container}>
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      disabled={isUploading}
    >
      {isUploading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#1a73e8" />
          <Text style={styles.loadingText}>Analyzing your sources...</Text>
        </View>
      ) : (
        <>
          <View style={styles.iconCircle}>
            <FilePlus size={32} color="#1a73e8" />
          </View>
          <Text style={styles.title}>
            Add sources to get started
          </Text>
          <Text style={styles.subtitle}>
            Upload PDFs or Doc files to create your intelligent notebook.
          </Text>
          <View style={styles.button}>
            <Upload size={18} color="#fff" />
            <Text style={styles.buttonText}>Upload from computer</Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 500,
    padding: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#dadce0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  loadingState: {
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#5f6368",
    fontWeight: "500",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e8f0fe",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    color: "#202124",
    fontSize: 22,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    color: "#5f6368",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1a73e8",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
});
