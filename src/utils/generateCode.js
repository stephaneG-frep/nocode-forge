const serializeForMobile = (elements) =>
  JSON.stringify(elements, null, 2)
    .replace(/\\u2028/g, '\\u2028')
    .replace(/\\u2029/g, '\\u2029');

const classFromProps = (item) => {
  const p = item.props || {};
  return [
    p.textColor,
    p.backgroundColor,
    p.padding,
    p.radius,
    p.fontSize,
    item.className,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();
};

const webFiles = (elements, theme) => {
  const serialized = JSON.stringify(elements, null, 2);
  const serializedThemeVars = JSON.stringify(theme?.vars || {}, null, 2);

  return {
    'src/App.jsx': `import React from 'react';
import { elements } from './data/elements';
import { RenderElement } from './components/RenderElement';
import { themeVars } from './theme';

export default function App() {
  return (
    <main className=\"min-h-screen p-6\" style={{ backgroundColor: 'var(--ncf-app-bg)', ...themeVars }}>
      <div className=\"mx-auto flex w-full max-w-5xl flex-col gap-4\">
        {elements.length === 0 ? (
          <p className=\"text-[color:var(--ncf-muted)]\">Canvas is empty</p>
        ) : (
          elements.map((item) => <RenderElement key={item.id} item={item} />)
        )}
      </div>
    </main>
  );
}
`,
    'src/components/RenderElement.jsx': `import React from 'react';

const getClasses = (item) => {
  const p = item.props || {};
  return [p.textColor, p.backgroundColor, p.padding, p.radius, p.fontSize, item.className]
    .filter(Boolean)
    .join(' ')
    .trim();
};

const parseSize = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const numeric = Number.parseInt(value, 10);
    return Number.isFinite(numeric) ? numeric : null;
  }
  return null;
};

export function RenderElement({ item }) {
  const className = getClasses(item);
  const content = item.content || '';
  const width = parseSize(item.props?.width);
  const height = parseSize(item.props?.height);
  const boxStyle = {
    width: width ? width + 'px' : undefined,
    height: height ? height + 'px' : undefined,
  };

  switch (item.type) {
    case 'text':
      return <p style={boxStyle} className={className}>{content}</p>;
    case 'button':
      return <button style={boxStyle} className={className}>{content}</button>;
    case 'image':
      return <img style={boxStyle} src={content} alt={item.type} className={className} />;
    case 'card': {
      const [title, description] = content.split('\\n');
      return (
        <div style={boxStyle} className={className + ' shadow-sm'}>
          <h3 className=\"text-lg font-semibold\">{title || 'Card title'}</h3>
          <p className=\"mt-2 text-slate-600\">{description || 'Card description'}</p>
        </div>
      );
    }
    case 'input':
      return <input style={boxStyle} placeholder={content} className={className + ' border border-slate-300'} readOnly />;
    case 'section':
      return (
        <section style={boxStyle} className={className}>
          <h2 className=\"text-2xl font-bold\">{content}</h2>
        </section>
      );
    case 'navbar':
      return <nav style={boxStyle} className={className}>{content}</nav>;
    case 'footer':
      return <footer style={boxStyle} className={className}>{content}</footer>;
    default:
      return <div style={boxStyle} className={className}>{content}</div>;
  }
}
`,
    'src/data/elements.js': `export const elements = ${serialized};\n`,
    'src/theme.js': `export const themeVars = ${serializedThemeVars};\n`,
    'README.md': `# Generated NoCode Forge Web Export\n\nThis export contains a React + Tailwind page generated from NoCode Forge.\n`,
  };
};

const mobileFiles = (elements, theme) => {
  const serialized = serializeForMobile(elements);
  const vars = theme?.vars || {};
  return {
    'package.json': `{
  "name": "nocode-forge-mobile-export",
  "version": "1.0.0",
  "private": true,
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "expo-status-bar": "~1.12.1",
    "react": "18.2.0",
    "react-native": "0.74.3"
  }
}
`,
    'App.js': `import React from 'react';
import { SafeAreaView, ScrollView, View, Text, Pressable, TextInput, Image, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { elements } from './src/data/elements';
import { theme } from './src/theme';

function parseSpacing(value) {
  if (!value) return {};
  if (value === 'p-0') return { padding: 0 };
  if (value === 'p-2') return { padding: 8 };
  if (value === 'p-4') return { padding: 16 };
  if (value === 'p-6') return { padding: 24 };
  if (value === 'p-8') return { padding: 32 };
  if (value === 'px-4 py-2') return { paddingHorizontal: 16, paddingVertical: 8 };
  if (value === 'px-4 py-3') return { paddingHorizontal: 16, paddingVertical: 12 };
  if (value === 'px-6 py-3') return { paddingHorizontal: 24, paddingVertical: 12 };
  if (value === 'px-6 py-4') return { paddingHorizontal: 24, paddingVertical: 16 };
  if (value === 'px-6 py-5') return { paddingHorizontal: 24, paddingVertical: 20 };
  return {};
}

function parseRadius(value) {
  if (value === 'rounded-none') return 0;
  if (value === 'rounded-lg') return 12;
  if (value === 'rounded-xl') return 16;
  if (value === 'rounded-2xl') return 20;
  if (value === 'rounded-3xl') return 28;
  return 16;
}

function parseFontSize(value) {
  if (value === 'text-sm') return 14;
  if (value === 'text-base') return 16;
  if (value === 'text-lg') return 18;
  if (value === 'text-xl') return 20;
  if (value === 'text-2xl') return 24;
  return 16;
}

function colorFromToken(token) {
  if (!token) return undefined;
  if (token === 'text-white') return '#ffffff';
  if (token === 'text-slate-900') return '#0f172a';
  if (token === 'text-slate-500') return '#64748b';
  if (token.includes('--ncf-text')) return theme.text;
  if (token.includes('--ncf-muted')) return theme.muted;
  if (token.includes('--ncf-accent')) return theme.accent;
  if (token.includes('--ncf-accent-strong')) return theme.accentStrong;
  return undefined;
}

function backgroundFromToken(token) {
  if (!token) return undefined;
  if (token === 'bg-white') return '#ffffff';
  if (token === 'bg-slate-100') return '#f1f5f9';
  if (token === 'bg-slate-900') return '#0f172a';
  if (token.includes('--ncf-surface-soft')) return theme.surfaceSoft;
  if (token.includes('--ncf-surface')) return theme.surface;
  if (token.includes('--ncf-accent-strong')) return theme.accentStrong;
  if (token.includes('--ncf-accent')) return theme.accent;
  return undefined;
}

function itemStyle(item) {
  const props = item.props || {};
  return {
    ...parseSpacing(props.padding),
    borderRadius: parseRadius(props.radius),
    backgroundColor: backgroundFromToken(props.backgroundColor),
    width: typeof props.width === 'number' ? props.width : undefined,
    height: typeof props.height === 'number' ? props.height : undefined,
  };
}

function textStyle(item) {
  const props = item.props || {};
  return {
    color: colorFromToken(props.textColor) || theme.text,
    fontSize: parseFontSize(props.fontSize),
  };
}

function RenderElement({ item }) {
  const content = item.content || '';

  switch (item.type) {
    case 'text':
      return <Text style={[itemStyle(item), textStyle(item)]}>{content}</Text>;
    case 'button':
      return (
        <Pressable style={itemStyle(item)}>
          <Text style={[textStyle(item), { fontWeight: '600' }]}>{content}</Text>
        </Pressable>
      );
    case 'image':
      return <Image source={{ uri: content }} style={[itemStyle(item), { minHeight: 180 }]} resizeMode="cover" />;
    case 'card': {
      const [title, description] = content.split('\n');
      return (
        <View style={[itemStyle(item), styles.cardShadow]}>
          <Text style={[textStyle(item), styles.cardTitle]}>{title || 'Card title'}</Text>
          <Text style={[{ color: theme.muted, marginTop: 8 }, textStyle(item)]}>{description || 'Card description'}</Text>
        </View>
      );
    }
    case 'input':
      return <TextInput editable={false} placeholder={content} style={[itemStyle(item), textStyle(item), styles.input]} />;
    case 'section':
      return (
        <View style={itemStyle(item)}>
          <Text style={[textStyle(item), styles.sectionTitle]}>{content}</Text>
        </View>
      );
    case 'navbar':
      return <Text style={[itemStyle(item), textStyle(item)]}>{content}</Text>;
    case 'footer':
      return <Text style={[itemStyle(item), textStyle(item)]}>{content}</Text>;
    default:
      return <Text style={[itemStyle(item), textStyle(item)]}>{content}</Text>;
  }
}

export default function App() {
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.appBg }]}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        {elements.length === 0 ? (
          <Text style={{ color: theme.muted }}>Add components to start building</Text>
        ) : (
          elements.map((item) => <RenderElement key={item.id} item={item} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    padding: 16,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
});
`,
    'src/data/elements.js': `export const elements = ${serialized};\n`,
    'src/theme.js': `export const theme = {
  appBg: '${vars['--ncf-app-bg'] || '#e2e8f0'}',
  surface: '${vars['--ncf-surface'] || '#ffffff'}',
  surfaceSoft: '${vars['--ncf-surface-soft'] || '#f8fafc'}',
  text: '${vars['--ncf-text'] || '#0f172a'}',
  muted: '${vars['--ncf-muted'] || '#475569'}',
  accent: '${vars['--ncf-accent'] || '#0f6cbd'}',
  accentStrong: '${vars['--ncf-accent-strong'] || '#0b4c84'}',
};
`,
    'README.md': `# Generated NoCode Forge Mobile Export (Expo)\n\n## Run\n1. npm install\n2. npm run start\n3. Press i (iOS) / a (Android) / w (Web)\n`,
  };
};

export const generateProjectFiles = (elements, theme) => ({
  web: webFiles(elements, theme),
  mobile: mobileFiles(elements, theme),
});
