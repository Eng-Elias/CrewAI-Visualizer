import { useCallback, useEffect, useState } from "react";
import { ToastUtils } from "@/utils/ui/toast-utils";

interface AppSettings {
  theme: "light" | "dark" | "system";
  autoSave: boolean;
  notifications: boolean;
  defaultLLM?: string;
  defaultAgentTemplate?: string;
  defaultTaskTemplate?: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: "system",
  autoSave: true,
  notifications: true,
};

const STORAGE_KEY = "app_settings";

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save settings to localStorage
  const updateSettings = useCallback(
    (updates: Partial<AppSettings>) => {
      try {
        const newSettings = { ...settings, ...updates };
        setSettings(newSettings);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
        ToastUtils.success("Settings updated successfully");
      } catch (error) {
        console.error("Failed to update settings:", error);
        ToastUtils.error("Failed to update settings");
      }
    },
    [settings]
  );

  // Reset settings to defaults
  const resetSettings = useCallback(() => {
    try {
      setSettings(DEFAULT_SETTINGS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      ToastUtils.success("Settings reset to defaults");
    } catch (error) {
      console.error("Failed to reset settings:", error);
      ToastUtils.error("Failed to reset settings");
    }
  }, []);

  return {
    settings,
    isLoading,
    updateSettings,
    resetSettings,
  };
}
