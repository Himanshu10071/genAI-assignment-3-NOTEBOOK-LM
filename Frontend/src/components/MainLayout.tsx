import React, { useState } from "react";
import { 
  View, 
  StyleSheet, 
  useWindowDimensions, 
  TouchableOpacity, 
  Modal,
  Platform
} from "react-native";
import { THEME } from "../constants/theme";
import { X, Menu, PanelLeft } from "lucide-react-native";

interface MainLayoutProps {
  leftPanel: React.ReactNode;
  centerPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export const MainLayout = ({ leftPanel, centerPanel, rightPanel }: MainLayoutProps) => {
  const { width } = useWindowDimensions();
  const isDesktop = width > 1024;
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    if (isDesktop) {
      setIsSidebarVisible(!isSidebarVisible);
    } else {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  };

  // Pass toggleSidebar to centerPanel if needed via cloning or context (simplified here by adding the button in MainLayout)
  
  return (
    <View style={styles.container}>
      {/* Desktop Sidebar */}
      {isDesktop && isSidebarVisible && (
        <View style={styles.leftPanel}>{leftPanel}</View>
      )}

      {/* Mobile Sidebar (Modal) */}
      <Modal
        visible={isMobileMenuOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsMobileMenuOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.mobileSidebar}>
            <View style={styles.mobileSidebarHeader}>
              <TouchableOpacity onPress={() => setIsMobileMenuOpen(false)}>
                <X size={24} color={THEME.colors.textPrimary} />
              </TouchableOpacity>
            </View>
            {leftPanel}
          </View>
          <TouchableOpacity 
            style={styles.modalCloseArea} 
            onPress={() => setIsMobileMenuOpen(false)} 
          />
        </View>
      </Modal>

      {/* Main Content Area */}
      <View style={styles.centerPanel}>
        {/* Toggle Button in Header Style */}
        <View style={styles.headerToggle}>
          <TouchableOpacity 
            style={styles.toggleButton} 
            onPress={toggleSidebar}
          >
            <PanelLeft size={20} color={THEME.colors.textSecondary} />
          </TouchableOpacity>
        </View>
        {centerPanel}
      </View>

      {isDesktop && rightPanel && <View style={styles.rightPanel}>{rightPanel}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: THEME.colors.background,
  },
  leftPanel: {
    width: 320,
    backgroundColor: THEME.colors.surface,
    borderRightWidth: 1,
    borderRightColor: THEME.colors.border,
  },
  centerPanel: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  rightPanel: {
    width: 300,
    backgroundColor: THEME.colors.background,
    padding: THEME.spacing.lg,
    gap: THEME.spacing.lg,
  },
  headerToggle: {
    position: "absolute",
    left: 20,
    top: 18,
    zIndex: 100,
  },
  toggleButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: THEME.colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  modalOverlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  mobileSidebar: {
    width: 300,
    height: "100%",
    backgroundColor: THEME.colors.background,
    borderRightWidth: 1,
    borderRightColor: THEME.colors.border,
  },
  mobileSidebarHeader: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  modalCloseArea: {
    flex: 1,
  },
});
