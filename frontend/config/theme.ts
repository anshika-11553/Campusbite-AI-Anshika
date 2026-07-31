export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  borderRadius: string;
}

export const defaultThemeConfig: ThemeConfig = {
  mode: 'light',
  primaryColor: '#054A36', // Deep Emerald
  borderRadius: '0.75rem', // rounded-xl
};
