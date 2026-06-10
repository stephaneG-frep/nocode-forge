const serializeForMobile = (elements) => JSON.stringify(elements, null, 2);

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
  const boxStyle = { width: width ? width + 'px' : undefined, height: height ? height + 'px' : undefined };

  switch (item.type) {
    case 'text': return <p style={boxStyle} className={className}>{content}</p>;
    case 'hero': {
      const [title, subtitle] = content.split('\\n');
      return <section style={boxStyle} className={className}><p className=\"mb-3 inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-[color:var(--ncf-accent-strong)]\">Pret a publier</p><h1 className=\"max-w-3xl text-4xl font-black tracking-tight text-[color:var(--ncf-text)] md:text-5xl\">{title || 'Grand titre'}</h1><p className=\"mt-4 max-w-2xl text-base leading-7 text-[color:var(--ncf-muted)] md:text-lg\">{subtitle || 'Sous-titre de presentation'}</p></section>;
    }
    case 'button': return <button style={boxStyle} className={className}>{content}</button>;
    case 'badge': return <span style={boxStyle} className={className}>{content}</span>;
    case 'image': return <img style={boxStyle} src={content} alt={item.type} className={className} />;
    case 'card': {
      const [title, description] = content.split('\\n');
      return <div style={boxStyle} className={className + ' shadow-sm'}><h3 className=\"text-lg font-semibold\">{title || 'Card title'}</h3><p className=\"mt-2 text-slate-600\">{description || 'Card description'}</p></div>;
    }
    case 'stats': {
      const lines = content.split('\\n').filter(Boolean);
      const stats = [0, 2, 4].map((start) => ({ value: lines[start] || '0', label: lines[start + 1] || 'Description' }));
      return <div style={boxStyle} className={className}><div className=\"grid gap-4 sm:grid-cols-3\">{stats.map((stat, index) => <div key={index} className=\"rounded-2xl bg-[color:var(--ncf-surface-soft)] p-4 text-center\"><p className=\"text-3xl font-black text-[color:var(--ncf-accent-strong)]\">{stat.value}</p><p className=\"mt-1 text-sm text-[color:var(--ncf-muted)]\">{stat.label}</p></div>)}</div></div>;
    }
    case 'testimonial': {
      const [quote, name, role] = content.split('\\n');
      return <figure style={boxStyle} className={className}><p className=\"text-lg font-medium leading-8 text-[color:var(--ncf-text)]\">&quot;{quote || 'Avis client'}&quot;</p><figcaption className=\"mt-5 flex items-center gap-3\"><div className=\"grid h-11 w-11 place-items-center rounded-full bg-[color:var(--ncf-accent)] font-bold text-white\">{(name || 'A').slice(0, 1)}</div><div><p className=\"font-semibold text-[color:var(--ncf-text)]\">{name || 'Nom du client'}</p><p className=\"text-sm text-[color:var(--ncf-muted)]\">{role || 'Role'}</p></div></figcaption></figure>;
    }
    case 'pricing': {
      const [name, price, description, features = ''] = content.split('\\n');
      return <div style={boxStyle} className={className + ' border border-[color:var(--ncf-surface-soft)] shadow-sm'}><p className=\"text-sm font-semibold uppercase tracking-wide text-[color:var(--ncf-accent-strong)]\">{name || 'Offre'}</p><p className=\"mt-3 text-4xl font-black text-[color:var(--ncf-text)]\">{price || 'Prix'}</p><p className=\"mt-2 text-sm text-[color:var(--ncf-muted)]\">{description || 'Description'}</p><ul className=\"mt-5 space-y-2 text-sm text-[color:var(--ncf-text)]\">{features.split('|').filter(Boolean).map((feature) => <li key={feature}>+ {feature}</li>)}</ul></div>;
    }
    case 'quote': {
      const [quote, author] = content.split('\\n');
      return <blockquote style={boxStyle} className={className}><p className=\"leading-8\">&quot;{quote || 'Citation'}&quot;</p><footer className=\"mt-3 text-sm font-semibold text-[color:var(--ncf-muted)]\">{author || 'Auteur'}</footer></blockquote>;
    }
    case 'list':
      return <ul style={boxStyle} className={className + ' space-y-2'}>{content.split('\\n').filter(Boolean).map((line) => <li key={line} className=\"flex gap-2\"><span className=\"font-bold text-[color:var(--ncf-accent)]\">+</span><span>{line}</span></li>)}</ul>;
    case 'input': return <input style={boxStyle} placeholder={content} className={className + ' border border-slate-300'} readOnly />;
    case 'section': return <section style={boxStyle} className={className}><h2 className=\"text-2xl font-bold\">{content}</h2></section>;
    case 'divider':
    case 'spacer':
      return <div style={boxStyle} className={className} aria-hidden=\"true\" />;
    case 'navbar': return <nav style={boxStyle} className={className}>{content}</nav>;
    case 'footer': return <footer style={boxStyle} className={className}>{content}</footer>;
    default: return <div style={boxStyle} className={className}>{content}</div>;
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
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { elements } from './src/data/elements';
import { theme } from './src/theme';
import { RenderElement } from './src/components/RenderElement';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.appBg }}>
      <StatusBar style=\"dark\" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {elements.length === 0 ? <Text style={{ color: theme.muted }}>Add components to start building</Text> : elements.map((item) => <RenderElement key={item.id} item={item} />)}
      </ScrollView>
    </SafeAreaView>
  );
}
`,
    'src/components/RenderElement.js': `import React from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
import { theme } from '../theme';
import { getItemStyle, getTextStyle } from '../utils/styleParsers';

export function RenderElement({ item }) {
  const content = item.content || '';
  const itemStyle = getItemStyle(item, theme);
  const textStyle = getTextStyle(item, theme);

  switch (item.type) {
    case 'text':
      return <Text style={[itemStyle, textStyle]}>{content}</Text>;
    case 'hero': {
      const [title, subtitle] = content.split('\\n');
      return <View style={itemStyle}><Text style={[textStyle, { fontWeight: '900', fontSize: 34 }]}>{title || 'Grand titre'}</Text><Text style={[textStyle, { marginTop: 12, color: theme.muted, lineHeight: 24 }]}>{subtitle || 'Sous-titre de presentation'}</Text></View>;
    }
    case 'button':
      return <Pressable style={itemStyle}><Text style={[textStyle, { fontWeight: '600' }]}>{content}</Text></Pressable>;
    case 'badge':
      return <Text style={[itemStyle, textStyle, { alignSelf: 'flex-start', fontWeight: '700' }]}>{content}</Text>;
    case 'image':
      return <Image source={{ uri: content }} style={[itemStyle, { minHeight: 180 }]} resizeMode=\"cover\" />;
    case 'card': {
      const [title, description] = content.split('\\n');
      return <View style={[itemStyle, { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 }]}><Text style={[textStyle, { fontWeight: '700', fontSize: 18 }]}>{title || 'Card title'}</Text><Text style={[textStyle, { marginTop: 8, color: theme.muted }]}>{description || 'Card description'}</Text></View>;
    }
    case 'stats': {
      const lines = content.split('\\n').filter(Boolean);
      const stats = [0, 2, 4].map((start) => ({ value: lines[start] || '0', label: lines[start + 1] || 'Description' }));
      return <View style={itemStyle}>{stats.map((stat, index) => <View key={index} style={{ paddingVertical: 8 }}><Text style={[textStyle, { fontWeight: '900', fontSize: 28, color: theme.accentStrong }]}>{stat.value}</Text><Text style={[textStyle, { color: theme.muted }]}>{stat.label}</Text></View>)}</View>;
    }
    case 'testimonial': {
      const [quote, name, role] = content.split('\\n');
      return <View style={itemStyle}><Text style={[textStyle, { fontSize: 18, lineHeight: 28 }]}>&quot;{quote || 'Avis client'}&quot;</Text><Text style={[textStyle, { marginTop: 16, fontWeight: '700' }]}>{name || 'Nom du client'}</Text><Text style={[textStyle, { color: theme.muted }]}>{role || 'Role'}</Text></View>;
    }
    case 'pricing': {
      const [name, price, description, features = ''] = content.split('\\n');
      return <View style={itemStyle}><Text style={[textStyle, { fontWeight: '800', color: theme.accentStrong }]}>{name || 'Offre'}</Text><Text style={[textStyle, { marginTop: 10, fontWeight: '900', fontSize: 30 }]}>{price || 'Prix'}</Text><Text style={[textStyle, { marginTop: 8, color: theme.muted }]}>{description || 'Description'}</Text>{features.split('|').filter(Boolean).map((feature) => <Text key={feature} style={[textStyle, { marginTop: 8 }]}>+ {feature}</Text>)}</View>;
    }
    case 'quote': {
      const [quote, author] = content.split('\\n');
      return <View style={itemStyle}><Text style={[textStyle, { fontSize: 18, lineHeight: 28 }]}>&quot;{quote || 'Citation'}&quot;</Text><Text style={[textStyle, { marginTop: 10, color: theme.muted, fontWeight: '700' }]}>{author || 'Auteur'}</Text></View>;
    }
    case 'list':
      return <View style={itemStyle}>{content.split('\\n').filter(Boolean).map((line) => <Text key={line} style={[textStyle, { marginVertical: 4 }]}>+ {line}</Text>)}</View>;
    case 'input':
      return <TextInput editable={false} placeholder={content} style={[itemStyle, textStyle, { borderWidth: 1, borderColor: '#cbd5e1' }]} />;
    case 'section':
      return <View style={itemStyle}><Text style={[textStyle, { fontWeight: '700', fontSize: 24 }]}>{content}</Text></View>;
    case 'divider':
    case 'spacer':
      return <View style={itemStyle} />;
    case 'navbar':
    case 'footer':
      return <Text style={[itemStyle, textStyle]}>{content}</Text>;
    default:
      return <Text style={[itemStyle, textStyle]}>{content}</Text>;
  }
}
`,
    'src/utils/styleParsers.js': `const parseSpacing = (value) => {
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
};

const parseRadius = (value) => {
  if (value === 'rounded-none') return 0;
  if (value === 'rounded-lg') return 12;
  if (value === 'rounded-xl') return 16;
  if (value === 'rounded-2xl') return 20;
  if (value === 'rounded-3xl') return 28;
  return 16;
};

const parseFontSize = (value) => {
  if (value === 'text-sm') return 14;
  if (value === 'text-base') return 16;
  if (value === 'text-lg') return 18;
  if (value === 'text-xl') return 20;
  if (value === 'text-2xl') return 24;
  return 16;
};

const colorFromToken = (token, theme) => {
  if (!token) return undefined;
  if (token === 'text-white') return '#ffffff';
  if (token === 'text-slate-900') return '#0f172a';
  if (token === 'text-slate-500') return '#64748b';
  if (token.includes('--ncf-text')) return theme.text;
  if (token.includes('--ncf-muted')) return theme.muted;
  if (token.includes('--ncf-accent')) return theme.accent;
  if (token.includes('--ncf-accent-strong')) return theme.accentStrong;
  return undefined;
};

const backgroundFromToken = (token, theme) => {
  if (!token) return undefined;
  if (token === 'bg-white') return '#ffffff';
  if (token === 'bg-slate-100') return '#f1f5f9';
  if (token === 'bg-slate-900') return '#0f172a';
  if (token.includes('--ncf-surface-soft')) return theme.surfaceSoft;
  if (token.includes('--ncf-surface')) return theme.surface;
  if (token.includes('--ncf-accent-strong')) return theme.accentStrong;
  if (token.includes('--ncf-accent')) return theme.accent;
  return undefined;
};

export const getItemStyle = (item, theme) => {
  const props = item.props || {};
  return {
    ...parseSpacing(props.padding),
    borderRadius: parseRadius(props.radius),
    backgroundColor: backgroundFromToken(props.backgroundColor, theme),
    width: typeof props.width === 'number' ? props.width : undefined,
    height: typeof props.height === 'number' ? props.height : undefined,
  };
};

export const getTextStyle = (item, theme) => {
  const props = item.props || {};
  return {
    color: colorFromToken(props.textColor, theme) || theme.text,
    fontSize: parseFontSize(props.fontSize),
  };
};
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
    'README.md': `# Generated NoCode Forge Mobile Export (Expo)\n\n## Run\n1. npm install\n2. npm run start\n3. Press i (iOS) / a (Android) / w (Web)\n\n## Structure\n- App.js\n- src/components/RenderElement.js\n- src/utils/styleParsers.js\n- src/data/elements.js\n- src/theme.js\n`,
  };
};

export const generateProjectFiles = (elements, theme) => ({
  web: webFiles(elements, theme),
  mobile: mobileFiles(elements, theme),
});
